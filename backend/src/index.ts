import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db';
import { projects, insights, userProfiles, contactSubmissions } from './db/schema';
import { eq } from 'drizzle-orm';
import videoRoutes from './routes/videos';
import photoRoutes from './routes/photos';
import adminRoutes from './routes/admin';
import settingsRoutes from './routes/settings';
import campaignRoutes from './routes/campaigns';
import './worker';
import './photoWorker';
import { authRateLimitMiddleware, publicRateLimitMiddleware, userActionRateLimitMiddleware } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { validateBody, ProjectSchema, InsightSchema, UserProfileSchema, ContactSubmissionSchema } from './validators';
import { sendEmail, MAIL_FROM } from './email';
import { isQueueAvailable } from './queue';


dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// `FRONTEND_URL` as a literal string means `cors` echoes that exact value for
// every request, so a single typo (http instead of https, missing www) silently
// breaks every browser call to the API — with no error until a real browser hits
// it, since curl and health checks don't send an Origin header at all. Building
// an allowlist from it instead survives that class of typo: both the www and
// bare-domain variants of whatever is configured are accepted, and additional
// origins can be added as a comma-separated list without a code change.
function parseAllowedOrigins(raw: string | undefined): Set<string> {
  const origins = new Set<string>();
  for (const part of (raw || '').split(',').map((s) => s.trim()).filter(Boolean)) {
    const normalized = part.replace(/\/+$/, '');
    origins.add(normalized);
    try {
      const url = new URL(normalized);
      const swapped = url.hostname.startsWith('www.') ? url.hostname.slice(4) : `www.${url.hostname}`;
      origins.add(`${url.protocol}//${swapped}${url.port ? `:${url.port}` : ''}`);
    } catch {
      // Not a parseable absolute URL (e.g. a bare '*') — kept as-is above, no host variant to add.
    }
  }
  return origins;
}

const allowedOrigins = parseAllowedOrigins(process.env.FRONTEND_URL);

app.use(cors({
  origin(requestOrigin, callback) {
    // No Origin header: server-to-server calls, curl, health checks. These are
    // not subject to same-origin policy, so there is nothing to check here.
    if (!requestOrigin) return callback(null, true);
    // Unset FRONTEND_URL keeps the previous fallback's intent (allow anything),
    // but as a reflected origin rather than a literal '*' — which browsers
    // reject outright once `credentials: true` is also set.
    if (allowedOrigins.size === 0) return callback(null, true);
    callback(null, allowedOrigins.has(requestOrigin));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Video Processing API
app.use('/api/videos', userActionRateLimitMiddleware, videoRoutes);

// Photo Processing API
app.use('/api/photos', userActionRateLimitMiddleware, photoRoutes);

// Admin APIs (Auth, Logs, Dual-OTP Promotion)
app.use('/api/admin', adminRoutes);

// Settings API
app.use('/api/settings', settingsRoutes);

// Public Campaigns API
app.use('/api/campaigns', publicRateLimitMiddleware, campaignRoutes);

// Whether uploads can be converted right now. The admin upload dialog asks
// before it starts, so an exhausted Upstash quota becomes a choice the operator
// makes rather than a file stuck on "converting" with no explanation.
app.get('/api/media/conversion-status', publicRateLimitMiddleware, async (req, res) => {
  const available = await isQueueAvailable();
  res.json({ available });
});

// Health check
app.get('/health', publicRateLimitMiddleware, (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});
app.get('/', publicRateLimitMiddleware, (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});


// Projects API
app.get('/api/projects', publicRateLimitMiddleware, async (req, res, next) => {
  try {
    const allProjects = await db.select().from(projects);
    res.json(allProjects);
  } catch (error) {
    next(error);
  }
});

app.post('/api/projects', authRateLimitMiddleware, validateBody(ProjectSchema), async (req, res, next) => {
  try {
    const project = await db.insert(projects).values(req.body).returning();
    res.json(project[0]);
  } catch (error) {
    next(error);
  }
});

app.put('/api/projects/:id', authRateLimitMiddleware, validateBody(ProjectSchema), async (req, res, next) => {
  try {
    const project = await db.update(projects).set({ ...req.body, updatedAt: new Date() }).where(eq(projects.id, parseInt(req.params.id as string))).returning();
    res.json(project[0]);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/projects/:id', authRateLimitMiddleware, async (req, res, next) => {
  try {
    await db.delete(projects).where(eq(projects.id, parseInt(req.params.id as string)));
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Insights API
app.get('/api/insights', publicRateLimitMiddleware, async (req, res, next) => {
  try {
    const allInsights = await db.select().from(insights);
    res.json(allInsights);
  } catch (error) {
    next(error);
  }
});

app.post('/api/insights', authRateLimitMiddleware, validateBody(InsightSchema), async (req, res, next) => {
  try {
    const insight = await db.insert(insights).values(req.body).returning();
    res.json(insight[0]);
  } catch (error) {
    next(error);
  }
});

// User Profiles API
app.get('/api/user-profiles', publicRateLimitMiddleware, async (req, res, next) => {
  try {
    const profiles = await db.select().from(userProfiles);
    res.json(profiles);
  } catch (error) {
    next(error);
  }
});

app.get('/api/user-profiles/:userId', publicRateLimitMiddleware, async (req, res, next) => {
  try {
    const profile = await db.select().from(userProfiles).where(eq(userProfiles.userId, req.params.userId as string));
    if (profile.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile[0]);
  } catch (error) {
    next(error);
  }
});

app.post('/api/user-profiles', authRateLimitMiddleware, validateBody(UserProfileSchema), async (req, res, next) => {
  try {
    const profile = await db.insert(userProfiles).values(req.body).returning();
    res.json(profile[0]);
  } catch (error) {
    next(error);
  }
});

// Contact API. Public write, no public read — submissions carry a name, email
// and message, so listing them is an admin-only concern (the admin dashboard
// reads this table directly over its own DB connection, the same way it reads
// leads from user_profiles).
app.post('/api/contact', authRateLimitMiddleware, validateBody(ContactSubmissionSchema), async (req, res, next) => {
  try {
    const [submission] = await db.insert(contactSubmissions).values(req.body).returning();

    // Notification failure must not fail the request: the inquiry is already
    // saved, so a flaky send here should not tell the visitor their message
    // was lost. It is logged instead, the same tradeoff FAILED sends make in
    // the invite flow — visible to us, invisible to the person who just asked
    // for help.
    const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL || process.env.SUPER_ADMIN_EMAIL;
    if (notifyEmail) {
      const { firstName, lastName, email, company, message } = submission;
      const notifyError = await sendEmail({
        from: MAIL_FROM,
        to: notifyEmail,
        replyTo: email,
        subject: `New contact inquiry — ${firstName} ${lastName}${company ? ` (${company})` : ''}`,
        html: `
          <p><strong>${firstName} ${lastName}</strong> (${email}) sent a new inquiry via the Vision Wings contact form.</p>
          ${company ? `<p>Company: ${company}</p>` : ''}
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `,
      });
      if (notifyError) {
        console.warn('Contact submission saved, but the notification email failed:', notifyError);
      }
    }

    res.json(submission);
  } catch (error) {
    next(error);
  }
});

// Global Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
