import { Router } from 'express';
import { db } from '../db';
import { siteSettings } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { adminAuthMiddleware } from '../middleware/rbac';
import { logAdminAction } from './admin';

const router = Router();

// Site copy is content, so it follows the content designations rather than
// being open to every admin role.
const CONTENT_ROLES = ['Developer', 'Admin', 'Content Manager', 'SEO'];

// Get settings
router.get('/', async (req, res, next) => {
  try {
    const list = await db.select().from(siteSettings);
    const settingsMap = list.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    res.json(settingsMap);
  } catch (error) {
    next(error);
  }
});

// Update settings (Admin only)
router.put('/', adminAuthMiddleware(CONTENT_ROLES), async (req, res, next) => {
  try {
    // `req.adminEmail` was never set by the auth middleware — it populates
    // `req.admin` — so every settings change was logged against an undefined
    // admin. The audit trail is the point of the log.
    const admin = req.admin!;
    const body = req.body || {};

    const rows = Object.entries(body)
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => ({ key, value: value as string }));

    if (rows.length === 0) {
      return res.status(400).json({ error: 'No settings supplied' });
    }

    // One upsert, not a select-then-write per key. The section editor saves the
    // whole homepage at once (~90 keys); round-tripping each one serially took
    // longer than the client's own request timeout.
    await db
      .insert(siteSettings)
      .values(rows)
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: sql`excluded.value`, updatedAt: new Date() },
      });

    await logAdminAction({
      adminEmail: admin.email,
      role: admin.role,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      action: 'UPDATE_SETTINGS',
      resourceType: 'site_settings',
      newValue: { keys: rows.map((r) => r.key) },
      status: 'success',
    });

    res.json({ success: true, updated: rows.length });
  } catch (error) {
    next(error);
  }
});

export default router;
