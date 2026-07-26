import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db';
import { projects, insights, userProfiles } from './db/schema';
import { eq } from 'drizzle-orm';
import videoRoutes from './routes/videos';
import photoRoutes from './routes/photos';
import './worker';
import './photoWorker';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Video Processing API
app.use('/api/videos', videoRoutes);

// Photo Processing API
app.use('/api/photos', photoRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});


// Projects API
app.get('/api/projects', async (req, res) => {
  try {
    const allProjects = await db.select().from(projects);
    res.json(allProjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = await db.insert(projects).values(req.body).returning();
    res.json(project[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await db.update(projects).set({ ...req.body, updatedAt: new Date() }).where(eq(projects.id, parseInt(req.params.id))).returning();
    res.json(project[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await db.delete(projects).where(eq(projects.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Insights API
app.get('/api/insights', async (req, res) => {
  try {
    const allInsights = await db.select().from(insights);
    res.json(allInsights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

app.post('/api/insights', async (req, res) => {
  try {
    const insight = await db.insert(insights).values(req.body).returning();
    res.json(insight[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create insight' });
  }
});

// User Profiles API
app.get('/api/user-profiles', async (req, res) => {
  try {
    const profiles = await db.select().from(userProfiles);
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

app.get('/api/user-profiles/:userId', async (req, res) => {
  try {
    const profile = await db.select().from(userProfiles).where(eq(userProfiles.userId, req.params.userId));
    if (profile.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.post('/api/user-profiles', async (req, res) => {
  try {
    const profile = await db.insert(userProfiles).values(req.body).returning();
    res.json(profile[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
