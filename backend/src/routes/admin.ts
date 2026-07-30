import { Router } from 'express';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { db } from '../db';
import { adminRoles, adminAuditLogs, adminOtps, photos, videos, campaigns } from '../db/schema';
import { eq, desc, asc, and } from 'drizzle-orm';
import { Resend } from 'resend';
import { adminAuthMiddleware } from '../middleware/rbac';

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_missing_key');
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

router.get('/is-admin/:email', async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) return res.json({ isAdmin: false });
    if (email === process.env.SUPER_ADMIN_EMAIL) {
      return res.json({ isAdmin: true });
    }
    const [admin] = await db.select().from(adminRoles).where(eq(adminRoles.email, email));
    if (admin) {
      return res.json({ isAdmin: true });
    }
    return res.json({ isAdmin: false });
  } catch (error) {
    console.error('Error checking is-admin:', error);
    res.json({ isAdmin: false });
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

router.post('/initiate-promotion', adminAuthMiddleware(['Developer']), async (req, res) => {
  const { name, email, role } = req.body;
  
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required' });
  }

  try {
    const superAdminOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const promotedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60000);

    await db.insert(adminOtps).values({
      superAdminEmail: req.admin!.email,
      promotedEmail: email,
      promotedName: name,
      roleToAssign: role,
      superAdminOtp,
      promotedOtp,
      expiresAt
    });

    try {
      await resend.emails.send({
        from: 'admin@resend.dev', // Testing domain
        to: req.admin!.email,
        subject: 'Admin Promotion OTP (Super Admin)',
        html: `<p>Your OTP to approve promotion for ${email} is: <strong>${superAdminOtp}</strong></p>`
      });

      await resend.emails.send({
        from: 'admin@resend.dev',
        to: email,
        subject: 'Admin Promotion OTP',
        html: `<p>You are being promoted to ${role}. Your OTP is: <strong>${promotedOtp}</strong></p>`
      });
    } catch (emailError: any) {
      console.warn('⚠️ Email delivery failed (check RESEND_API_KEY).');
      console.warn(`[DEV ONLY] Super Admin OTP for ${req.admin!.email}: ${superAdminOtp}`);
      console.warn(`[DEV ONLY] Promoted OTP for ${email}: ${promotedOtp}`);
      // Continue execution so the frontend flow doesn't block.
    }

    await logAdminAction({
      adminEmail: req.admin!.email,
      role: req.admin!.role,
      action: 'initiate_promotion',
      resourceType: 'admin_roles',
      resourceId: email,
      status: 'success'
    });

    res.json({ 
      success: true, 
      message: 'OTPs generated and sent',
      superAdminOtp,
      promotedOtp
    });
  } catch (error: any) {
    console.error('Initiate promotion error:', error);
    res.status(500).json({ error: 'Failed to initiate promotion', details: error.message });
  }
});

router.post('/verify-promotion', adminAuthMiddleware(['Developer']), async (req, res) => {
  const { email, superAdminOtp, promotedOtp, password } = req.body;
  
  if (!email || !superAdminOtp || !promotedOtp || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const otpRecords = await db.select().from(adminOtps)
      .where(eq(adminOtps.promotedEmail, email));
    
    const record = otpRecords
      .filter(r => r.status === 'pending' && new Date(r.expiresAt) > new Date())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())[0];
    
    if (!record) {
      return res.status(400).json({ error: 'No valid OTP session found or expired' });
    }

    if (record.superAdminOtp !== superAdminOtp || record.promotedOtp !== promotedOtp) {
      return res.status(400).json({ error: 'Invalid OTPs' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const existing = await db.select().from(adminRoles).where(eq(adminRoles.email, email));
    if (existing.length > 0) {
      await db.update(adminRoles).set({ role: record.roleToAssign!, passwordHash, name: record.promotedName! }).where(eq(adminRoles.email, email));
    } else {
      await db.insert(adminRoles).values({
        email,
        role: record.roleToAssign!,
        passwordHash,
        name: record.promotedName!,
        createdBy: req.admin!.email
      });
    }

    await db.update(adminOtps).set({ status: 'verified' }).where(eq(adminOtps.id, record.id));

    await logAdminAction({
      adminEmail: req.admin!.email,
      role: req.admin!.role,
      action: 'verify_promotion',
      resourceType: 'admin_roles',
      resourceId: email,
      newValue: { role: record.roleToAssign },
      status: 'success'
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Verify promotion error:', error);
    res.status(500).json({ error: 'Failed to verify promotion' });
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

router.put('/media/photos/:id', adminAuthMiddleware(), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const adminEmail = (req as any).adminEmail;
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

router.delete('/media/photos/:id', adminAuthMiddleware(), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const adminEmail = (req as any).adminEmail;

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

router.put('/media/videos/:id', adminAuthMiddleware(), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const adminEmail = (req as any).adminEmail;
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

router.delete('/media/videos/:id', adminAuthMiddleware(), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const adminEmail = (req as any).adminEmail;

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

router.post('/media/campaigns', adminAuthMiddleware(), async (req, res, next) => {
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

router.put('/media/campaigns/:id', adminAuthMiddleware(), async (req, res, next) => {
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

router.delete('/media/campaigns/:id', adminAuthMiddleware(), async (req, res, next) => {
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
router.put('/media/campaigns-reorder', adminAuthMiddleware(), async (req, res, next) => {
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
