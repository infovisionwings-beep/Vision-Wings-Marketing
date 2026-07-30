import { Router, Request, Response } from 'express';
import { db } from '../db';
import { campaigns } from '../db/schema';
import { eq, desc, asc, and } from 'drizzle-orm';

const router = Router();

/**
 * GET /api/campaigns
 * Public: List published campaigns, optionally filtered by section
 * Query params: ?section=hero|samples|showcases|archive
 */
router.get('/', async (req: Request, res: Response, next) => {
  try {
    const section = req.query.section as string | undefined;

    const conditions = [eq(campaigns.publishStatus, 'published')];
    if (section) {
      conditions.push(eq(campaigns.section, section));
    }

    const list = await db
      .select()
      .from(campaigns)
      .where(and(...conditions))
      .orderBy(
        desc(campaigns.isStarred),
        desc(campaigns.isFeatured),
        asc(campaigns.displayOrder),
        desc(campaigns.createdAt)
      );

    res.json(list);
  } catch (error) {
    console.error('Failed to fetch public campaigns:', error);
    next(error);
  }
});

/**
 * GET /api/campaigns/:slug
 * Public: Get a single published campaign by slug
 */
router.get('/:slug', async (req: Request, res: Response, next) => {
  try {
    const slug = String(req.params.slug);
    const result = await db
      .select()
      .from(campaigns)
      .where(and(eq(campaigns.slug, slug), eq(campaigns.publishStatus, 'published')));

    if (result.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Failed to fetch campaign by slug:', error);
    next(error);
  }
});

export default router;
