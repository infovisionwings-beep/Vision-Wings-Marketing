import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import * as jose from 'jose';
import { db } from '../db';
import { adminRoles, adminAuditLogs, adminInvites, photos, videos, campaigns } from '../db/schema';
import { eq, desc, asc, and } from 'drizzle-orm';
import { adminAuthMiddleware } from '../middleware/rbac';
import { StorageService } from '../storage';
import { sendEmail, MAIL_FROM } from '../email';

const router = Router();

// Ownership split, matching the page guards in frontend/app/admin:
//   media library   — SEO and Content Manager both upload
//   campaigns       — SEO decides what appears where on the public site
//   written content — Content Manager owns essays and insights
// Developer is the super admin and Admin is the existing full-access role, so
// both appear everywhere. These must stay in step with the frontend guards: a
// page that blocks a role while the API still answers it is not a restriction.
const MEDIA_ROLES = ['Developer', 'Admin', 'SEO', 'Content Manager'];
const CAMPAIGN_ROLES = ['Developer', 'Admin', 'SEO'];

// Roles the super admin may hand out. 'Developer' is deliberately absent: it comes
// from SUPER_ADMIN_EMAIL only, so no invite can mint another super admin.
const ASSIGNABLE_ROLES = ['Admin', 'SEO', 'Content Manager'];

const INVITE_TTL_MS = 24 * 60 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 12;

const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-for-admin-session-please-change';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function logAdminAction(data: {
  adminName?: string;
  adminEmail?: string;
  role?: string;
  ipAddress?: string;
  userAgent?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  previousValue?: any;
  newValue?: any;
  status: 'success' | 'failure';
  failureReason?: string;
}) {
  try {
    await db.insert(adminAuditLogs).values(data);
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

// Returns the role alongside the flag: the frontend derives its role from this when
// no admin_session JWT is present, instead of defaulting everyone to 'Admin'.
router.get('/is-admin/:email', async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) return res.json({ isAdmin: false, role: null });
    if (email === process.env.SUPER_ADMIN_EMAIL) {
      return res.json({ isAdmin: true, role: 'Developer' });
    }
    const [admin] = await db.select().from(adminRoles).where(eq(adminRoles.email, email));
    if (admin) {
      return res.json({ isAdmin: true, role: admin.role });
    }
    return res.json({ isAdmin: false, role: null });
  } catch (error) {
    console.error('Error checking is-admin:', error);
    res.json({ isAdmin: false, role: null });
  }
});

router.post('/auth', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    let role = '';
    let name = 'Admin';
    let isValid = false;

    if (email === process.env.SUPER_ADMIN_EMAIL) {
      if (password === process.env.SUPER_ADMIN_PASSWORD) {
        isValid = true;
        role = 'Developer';
        name = 'Super Admin';
      }
    } else {
      const [admin] = await db.select().from(adminRoles).where(eq(adminRoles.email, email));
      if (admin) {
        isValid = await bcrypt.compare(password, admin.passwordHash);
        if (isValid) {
          role = admin.role;
          name = admin.name;
        }
      }
    }

    if (!isValid) {
      await logAdminAction({
        adminEmail: email,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        action: 'login',
        status: 'failure',
        failureReason: 'Invalid credentials'
      });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = await new jose.SignJWT({ email, role, name })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('12h')
      .sign(secretKey);

    await logAdminAction({
      adminEmail: email,
      adminName: name,
      role,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      action: 'login',
      status: 'success'
    });

    res.json({ token, user: { email, role, name } });
  } catch (error: any) {
    console.error('Auth error:', error);
    if (error?.code === '28P01' || error?.message?.includes('password authentication failed')) {
      return res.status(500).json({ error: 'Database authentication failed. Please update DATABASE_URL in .env with valid Neon credentials.' });
    }
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
});

// ==========================================
// ADMIN INVITES
// Replaces the dual-OTP promotion flow, which returned both codes in its own HTTP
// response and rendered them on screen — so neither party ever needed inbox access
// and the second factor proved nothing. Here the emailed link IS the proof.
// ==========================================

/**
 * POST /invites — super admin creates an invite and the backend emails the link.
 * The raw token is never returned to the caller; it exists only in that email.
 */
router.post('/invites', adminAuthMiddleware(['Developer']), async (req, res, next) => {
  const { name, email, role } = req.body || {};

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required' });
  }
  if (!ASSIGNABLE_ROLES.includes(role)) {
    return res.status(400).json({ error: `Role must be one of: ${ASSIGNABLE_ROLES.join(', ')}` });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizedEmail)) {
    return res.status(400).json({ error: 'Enter a valid email address' });
  }
  if (normalizedEmail === (process.env.SUPER_ADMIN_EMAIL || '').toLowerCase()) {
    return res.status(400).json({ error: 'That address is already the super admin' });
  }

  try {
    const existing = await db.select().from(adminRoles).where(eq(adminRoles.email, normalizedEmail));
    if (existing.length > 0) {
      return res.status(409).json({ error: `${normalizedEmail} is already an admin (${existing[0].role})` });
    }

    // Re-inviting supersedes any earlier pending invite, so one address never has
    // two live tokens at once (and stale rows do not linger in the UI).
    await db
      .update(adminInvites)
      .set({ status: 'revoked' })
      .where(and(eq(adminInvites.email, normalizedEmail), eq(adminInvites.status, 'pending')));

    const token = crypto.randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

    const [invite] = await db
      .insert(adminInvites)
      .values({
        email: normalizedEmail,
        name,
        role,
        tokenHash: hashToken(token),
        invitedBy: req.admin!.email,
        expiresAt,
      })
      .returning();

    const siteUrl = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
    if (!siteUrl) {
      await db.update(adminInvites).set({ status: 'revoked' }).where(eq(adminInvites.id, invite.id));
      return res.status(500).json({ error: 'FRONTEND_URL is not configured, so the invite link cannot be built.' });
    }
    const inviteUrl = `${siteUrl}/admin-invite?token=${token}`;

    // Delivery failure must fail the request, so the invite never reports success
    // while sitting undelivered.
    const deliveryError = await sendEmail({
      from: MAIL_FROM,
      to: normalizedEmail,
      subject: `You have been invited as ${role} — Vision Wings`,
      html: `
        <p>Hi ${name},</p>
        <p>${req.admin!.email} has invited you to the Vision Wings admin as <strong>${role}</strong>.</p>
        <p>Sign in with <strong>${normalizedEmail}</strong>, then open this single-use link to set your own password:</p>
        <p><a href="${inviteUrl}">${inviteUrl}</a></p>
        <p>The link expires in 24 hours. If you were not expecting this, ignore it.</p>
      `,
    });

    if (deliveryError) {
      await db.update(adminInvites).set({ status: 'revoked' }).where(eq(adminInvites.id, invite.id));
      await logAdminAction({
        adminEmail: req.admin!.email,
        role: req.admin!.role,
        action: 'create_admin_invite',
        resourceType: 'admin_invites',
        resourceId: normalizedEmail,
        status: 'failure',
        failureReason: `Email delivery failed: ${deliveryError}`,
      });
      return res.status(502).json({
        error: `Could not deliver the invite to ${normalizedEmail} — ${deliveryError}. If this mentions testing addresses, verify a domain in Resend and set RESEND_FROM: the shared ${MAIL_FROM} sandbox only delivers to the Resend account owner.`,
      });
    }

    // Notify the super admin that an invite went out — visibility, not a second factor.
    const notifyError = await sendEmail({
      from: MAIL_FROM,
      to: req.admin!.email,
      subject: `Admin invite sent to ${normalizedEmail}`,
      html: `<p>You invited <strong>${normalizedEmail}</strong> as <strong>${role}</strong>. It expires in 24 hours. If this was not you, revoke it in /admin/new.</p>`,
    });
    if (notifyError) {
      console.warn('Invite delivered, but the super admin notification failed:', notifyError);
    }

    await logAdminAction({
      adminEmail: req.admin!.email,
      role: req.admin!.role,
      action: 'create_admin_invite',
      resourceType: 'admin_invites',
      resourceId: normalizedEmail,
      newValue: { role, expiresAt },
      status: 'success',
    });

    res.status(201).json({
      success: true,
      invite: { id: invite.id, email: normalizedEmail, name, role, expiresAt },
    });
  } catch (error) {
    next(error);
  }
});

/** GET /invites — pending invites, so the super admin can see and revoke them. */
router.get('/invites', adminAuthMiddleware(['Developer']), async (req, res, next) => {
  try {
    const list = await db
      .select({
        id: adminInvites.id,
        email: adminInvites.email,
        name: adminInvites.name,
        role: adminInvites.role,
        status: adminInvites.status,
        invitedBy: adminInvites.invitedBy,
        expiresAt: adminInvites.expiresAt,
        acceptedAt: adminInvites.acceptedAt,
        createdAt: adminInvites.createdAt,
      })
      .from(adminInvites)
      .orderBy(desc(adminInvites.createdAt))
      .limit(50);
    res.json(list);
  } catch (error) {
    next(error);
  }
});

/** POST /invites/:id/revoke — kill a pending invite before it is used. */
router.post('/invites/:id/revoke', adminAuthMiddleware(['Developer']), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const [invite] = await db.select().from(adminInvites).where(eq(adminInvites.id, id));
    if (!invite) return res.status(404).json({ error: 'Invite not found' });
    if (invite.status !== 'pending') {
      return res.status(409).json({ error: `Invite is already ${invite.status}` });
    }

    await db.update(adminInvites).set({ status: 'revoked' }).where(eq(adminInvites.id, id));

    await logAdminAction({
      adminEmail: req.admin!.email,
      role: req.admin!.role,
      action: 'revoke_admin_invite',
      resourceType: 'admin_invites',
      resourceId: invite.email,
      previousValue: { status: 'pending' },
      newValue: { status: 'revoked' },
      status: 'success',
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

/**
 * Look up a pending invite by raw token. Unauthenticated by necessity — the invitee
 * is not an admin yet — so it returns only what the accept screen must render, and
 * the unguessable 32-byte token is the sole credential.
 */
router.get('/invites/lookup/:token', async (req, res, next) => {
  try {
    const [invite] = await db
      .select()
      .from(adminInvites)
      .where(eq(adminInvites.tokenHash, hashToken(String(req.params.token))));

    if (!invite || invite.status !== 'pending' || new Date(invite.expiresAt) <= new Date()) {
      return res.status(404).json({ error: 'This invite link is invalid, already used, or expired.' });
    }

    res.json({ email: invite.email, name: invite.name, role: invite.role, expiresAt: invite.expiresAt });
  } catch (error) {
    next(error);
  }
});

/**
 * Accept an invite: the invitee sets their own password and the admin row is created.
 * Single use — the invite is marked accepted in the same request.
 *
 * ponytail: the "must already have a site account" rule is enforced by the frontend
 * accept page, which checks the Neon Auth session email against the invite before
 * calling this. Someone holding the raw token could call this directly and skip that
 * check — but holding the token already means they control the invited inbox. Move
 * the check here if the backend ever gains a way to verify a Neon session.
 */
router.post('/invites/accept', async (req, res, next) => {
  const { token, password } = req.body || {};
  if (!token || !password) {
    return res.status(400).json({ error: 'Token and password are required' });
  }
  if (String(password).length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }

  try {
    const [invite] = await db
      .select()
      .from(adminInvites)
      .where(eq(adminInvites.tokenHash, hashToken(String(token))));

    if (!invite || invite.status !== 'pending' || new Date(invite.expiresAt) <= new Date()) {
      return res.status(400).json({ error: 'This invite link is invalid, already used, or expired.' });
    }

    // Burn the invite first: a second concurrent request finds it non-pending.
    const burned = await db
      .update(adminInvites)
      .set({ status: 'accepted', acceptedAt: new Date() })
      .where(and(eq(adminInvites.id, invite.id), eq(adminInvites.status, 'pending')))
      .returning();

    if (burned.length === 0) {
      return res.status(409).json({ error: 'This invite link has already been used.' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    await db.insert(adminRoles).values({
      email: invite.email,
      role: invite.role,
      passwordHash,
      name: invite.name,
      createdBy: invite.invitedBy,
    });

    await logAdminAction({
      adminEmail: invite.email,
      adminName: invite.name,
      role: invite.role,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      action: 'accept_admin_invite',
      resourceType: 'admin_roles',
      resourceId: invite.email,
      newValue: { role: invite.role, invitedBy: invite.invitedBy },
      status: 'success',
    });

    res.json({ success: true, email: invite.email, role: invite.role });
  } catch (error) {
    next(error);
  }
});
router.get('/logs', adminAuthMiddleware(['Developer']), async (req, res) => {
  try {
    const logs = await db.select().from(adminAuditLogs).orderBy(desc(adminAuditLogs.timestamp)).limit(500);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// ==========================================
// MEDIA CRUD OPERATIONS (Photos)
// ==========================================

router.get('/media/photos', adminAuthMiddleware(), async (req, res, next) => {
  try {
    const list = await db.select().from(photos).orderBy(desc(photos.createdAt));
    res.json(list);
  } catch (error) {
    next(error);
  }
});

router.put('/media/photos/:id', adminAuthMiddleware(MEDIA_ROLES), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const adminEmail = req.admin!.email;
    const body = req.body;
    
    // fetch prev
    const prev = await db.select().from(photos).where(eq(photos.id, id));
    if (prev.length === 0) return res.status(404).json({ error: 'Photo not found' });

    const updateData: any = {};
    const allowedFields = ['heading', 'subHeading', 'description', 'altText', 'tags', 'category', 'publishStatus', 'isStarred', 'displayOrder'];
    for (const key of allowedFields) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }
    
    updateData.updatedAt = new Date();

    const [updated] = await db.update(photos).set(updateData).where(eq(photos.id, id)).returning();
    
    await logAdminAction({
      adminEmail,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      action: 'UPDATE_PHOTO',
      resourceType: 'photo',
      resourceId: id,
      previousValue: prev[0],
      newValue: updated,
      status: 'success'
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete('/media/photos/:id', adminAuthMiddleware(MEDIA_ROLES), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const adminEmail = req.admin!.email;

    const prev = await db.select().from(photos).where(eq(photos.id, id));
    if (prev.length === 0) return res.status(404).json({ error: 'Photo not found' });

    const [updated] = await db.update(photos).set({ publishStatus: 'archived', updatedAt: new Date() }).where(eq(photos.id, id)).returning();

    await logAdminAction({
      adminEmail,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      action: 'SOFT_DELETE_PHOTO',
      resourceType: 'photo',
      resourceId: id,
      previousValue: prev[0],
      newValue: updated,
      status: 'success'
    });
    res.json({ success: true, message: 'Photo archived (soft deleted)' });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// MEDIA CRUD OPERATIONS (Videos)
// ==========================================

router.get('/media/videos', adminAuthMiddleware(), async (req, res, next) => {
  try {
    const list = await db.select().from(videos).orderBy(desc(videos.createdAt));
    res.json(list);
  } catch (error) {
    next(error);
  }
});

router.put('/media/videos/:id', adminAuthMiddleware(MEDIA_ROLES), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const adminEmail = req.admin!.email;
    const body = req.body;
    
    const prev = await db.select().from(videos).where(eq(videos.id, id));
    if (prev.length === 0) return res.status(404).json({ error: 'Video not found' });

    const updateData: any = {};
    const allowedFields = ['heading', 'subHeading', 'description', 'tags', 'category', 'publishStatus', 'isStarred', 'displayOrder'];
    for (const key of allowedFields) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }
    
    updateData.updatedAt = new Date();

    const [updated] = await db.update(videos).set(updateData).where(eq(videos.id, id)).returning();
    
    await logAdminAction({
      adminEmail,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      action: 'UPDATE_VIDEO',
      resourceType: 'video',
      resourceId: id,
      previousValue: prev[0],
      newValue: updated,
      status: 'success'
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete('/media/videos/:id', adminAuthMiddleware(MEDIA_ROLES), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const adminEmail = req.admin!.email;

    const prev = await db.select().from(videos).where(eq(videos.id, id));
    if (prev.length === 0) return res.status(404).json({ error: 'Video not found' });

    const [updated] = await db.update(videos).set({ publishStatus: 'archived', updatedAt: new Date() }).where(eq(videos.id, id)).returning();

    await logAdminAction({
      adminEmail,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      action: 'SOFT_DELETE_VIDEO',
      resourceType: 'video',
      resourceId: id,
      previousValue: prev[0],
      newValue: updated,
      status: 'success'
    });
    res.json({ success: true, message: 'Video archived (soft deleted)' });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// PERMANENT DELETE
// The existing DELETE routes archive (publishStatus = 'archived'), which is the
// safe default. These are the second, explicit step: drop the row and release the
// blobs, so an archived asset can actually be got rid of rather than accumulating
// forever in the library and in blob storage.
// ==========================================

/** Shared by both media types: archived-only, blobs released, fully audited. */
async function permanentlyDelete(
  req: any,
  res: any,
  kind: 'photo' | 'video'
) {
  const id = String(req.params.id);
  const table = kind === 'photo' ? photos : videos;

  const [existing] = await db.select().from(table).where(eq(table.id, id));
  if (!existing) return res.status(404).json({ error: `${kind} not found` });

  // Archive first, delete second. Without this an accidental call on a live asset
  // would silently break whichever site section still references it.
  if (existing.publishStatus !== 'archived') {
    return res.status(409).json({
      error: `Archive this ${kind} before deleting it permanently.`,
    });
  }

  const blobUrls = kind === 'photo'
    ? [(existing as any).inputPath, (existing as any).webpPath, (existing as any).thumbnailPath]
    : [(existing as any).inputPath, (existing as any).webmPath, (existing as any).mp4Path, (existing as any).thumbnailPath];

  // Blob cleanup is best-effort and must not block the row delete: a blob that
  // was already removed would otherwise make the asset undeletable forever.
  await Promise.allSettled(
    [...new Set(blobUrls.filter(Boolean))].map((url) => StorageService.deleteBlob(url as string))
  );

  await db.delete(table).where(eq(table.id, id));

  await logAdminAction({
    adminEmail: req.admin!.email,
    role: req.admin!.role,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    action: `PERMANENT_DELETE_${kind.toUpperCase()}`,
    resourceType: kind,
    resourceId: id,
    previousValue: existing,
    status: 'success',
  });

  res.json({ success: true, message: `${kind} deleted permanently` });
}

router.delete('/media/photos/:id/permanent', adminAuthMiddleware(MEDIA_ROLES), async (req, res, next) => {
  try {
    await permanentlyDelete(req, res, 'photo');
  } catch (error) {
    next(error);
  }
});

router.delete('/media/videos/:id/permanent', adminAuthMiddleware(MEDIA_ROLES), async (req, res, next) => {
  try {
    await permanentlyDelete(req, res, 'video');
  } catch (error) {
    next(error);
  }
});

// ==========================================
// CAMPAIGN CMS CRUD OPERATIONS
// ==========================================

router.get('/media/campaigns', adminAuthMiddleware(), async (req, res, next) => {
  try {
    const list = await db
      .select()
      .from(campaigns)
      .orderBy(asc(campaigns.displayOrder), desc(campaigns.createdAt));
    res.json(list);
  } catch (error) {
    next(error);
  }
});

router.post('/media/campaigns', adminAuthMiddleware(CAMPAIGN_ROLES), async (req, res, next) => {
  try {
    const adminEmail = (req as any).admin?.email || 'admin';
    const body = req.body;

    if (!body.title || !body.section) {
      return res.status(400).json({ error: 'Title and section are required' });
    }

    // Auto-generate slug if not provided
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 200) + '-' + Date.now().toString(36);

    const insertData: any = {
      title: body.title,
      slug,
      subtitle: body.subtitle || null,
      description: body.description || null,
      coverImage: body.coverImage || null,
      videoUrl: body.videoUrl || null,
      posterImage: body.posterImage || null,
      client: body.client || null,
      category: body.category || null,
      year: body.year || null,
      duration: body.duration || null,
      quoteText: body.quoteText || null,
      section: body.section,
      badges: body.badges || null,
      primaryCtaText: body.primaryCtaText || null,
      primaryCtaLink: body.primaryCtaLink || null,
      secondaryCtaText: body.secondaryCtaText || null,
      secondaryCtaLink: body.secondaryCtaLink || null,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
      publishStatus: body.publishStatus || 'draft',
      isFeatured: body.isFeatured || false,
      isStarred: body.isStarred || false,
      displayOrder: body.displayOrder || 0,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      createdBy: adminEmail,
    };

    const [inserted] = await db.insert(campaigns).values(insertData).returning();

    await logAdminAction({
      adminEmail,
      action: 'CREATE_CAMPAIGN',
      resourceType: 'campaign',
      resourceId: inserted.id,
      newValue: inserted,
      status: 'success',
    });

    res.status(201).json({ success: true, campaign: inserted });
  } catch (error: any) {
    if (error?.code === '23505') {
      return res.status(409).json({ error: 'A campaign with this slug already exists' });
    }
    next(error);
  }
});

router.put('/media/campaigns/:id', adminAuthMiddleware(CAMPAIGN_ROLES), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const adminEmail = (req as any).admin?.email || 'admin';
    const body = req.body;

    const prev = await db.select().from(campaigns).where(eq(campaigns.id, id));
    if (prev.length === 0) return res.status(404).json({ error: 'Campaign not found' });

    const updateData: any = {};
    const allowedFields = [
      'title', 'slug', 'subtitle', 'description',
      'coverImage', 'videoUrl', 'posterImage',
      'client', 'category', 'year', 'duration', 'quoteText',
      'section', 'badges',
      'primaryCtaText', 'primaryCtaLink', 'secondaryCtaText', 'secondaryCtaLink',
      'seoTitle', 'seoDescription',
      'publishStatus', 'isFeatured', 'isStarred', 'displayOrder', 'scheduledAt',
    ];
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = key === 'scheduledAt' && body[key] ? new Date(body[key]) : body[key];
      }
    }
    updateData.updatedAt = new Date();

    const [updated] = await db.update(campaigns).set(updateData).where(eq(campaigns.id, id)).returning();

    await logAdminAction({
      adminEmail,
      action: 'UPDATE_CAMPAIGN',
      resourceType: 'campaign',
      resourceId: id,
      previousValue: prev[0],
      newValue: updated,
      status: 'success',
    });

    res.json(updated);
  } catch (error: any) {
    if (error?.code === '23505') {
      return res.status(409).json({ error: 'A campaign with this slug already exists' });
    }
    next(error);
  }
});

router.delete('/media/campaigns/:id', adminAuthMiddleware(CAMPAIGN_ROLES), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const adminEmail = (req as any).admin?.email || 'admin';

    const prev = await db.select().from(campaigns).where(eq(campaigns.id, id));
    if (prev.length === 0) return res.status(404).json({ error: 'Campaign not found' });

    const [updated] = await db
      .update(campaigns)
      .set({ publishStatus: 'archived', updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();

    await logAdminAction({
      adminEmail,
      action: 'SOFT_DELETE_CAMPAIGN',
      resourceType: 'campaign',
      resourceId: id,
      previousValue: prev[0],
      newValue: updated,
      status: 'success',
    });

    res.json({ success: true, message: 'Campaign archived (soft deleted)' });
  } catch (error) {
    next(error);
  }
});

// Batch reorder campaigns
router.put('/media/campaigns-reorder', adminAuthMiddleware(CAMPAIGN_ROLES), async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds must be an array' });
    }

    await Promise.all(
      orderedIds.map((id: string, index: number) =>
        db.update(campaigns).set({ displayOrder: index, updatedAt: new Date() }).where(eq(campaigns.id, id))
      )
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
