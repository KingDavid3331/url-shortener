import { Router } from 'express';
import { nanoid } from 'nanoid';
import prisma from '../lib/prisma.js';
import redis from '../lib/redis.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const links = await prisma.shortLink.findMany({
    where: { userId: req.userId },
    include: { _count: { select: { clicks: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(links);
});

router.post('/', async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ error: 'originalUrl is required' });

  const shortCode = nanoid(6);
  const link = await prisma.shortLink.create({
    data: { userId: req.userId, shortCode, originalUrl },
  });
  await redis.set(shortCode, originalUrl);
  res.status(201).json(link);
});

router.delete('/:id', async (req, res) => {
  const link = await prisma.shortLink.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });
  if (!link) return res.status(404).json({ error: 'Link not found' });

  await prisma.shortLink.delete({ where: { id: req.params.id } });
  await redis.del(link.shortCode);
  res.status(204).send();
});

router.get('/:id/analytics', async (req, res) => {
  const link = await prisma.shortLink.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });
  if (!link) return res.status(404).json({ error: 'Link not found' });

  const clicks = await prisma.clickEvent.findMany({
    where: { shortLinkId: req.params.id },
    orderBy: { timestamp: 'asc' },
  });

  const byDate = clicks.reduce((acc, c) => {
    const date = c.timestamp.toISOString().slice(0, 10);
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const byReferrer = clicks.reduce((acc, c) => {
    const ref = c.referrer || 'Direct';
    acc[ref] = (acc[ref] || 0) + 1;
    return acc;
  }, {});

  const topReferrers = Object.entries(byReferrer)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([referrer, count]) => ({ referrer, count }));

  res.json({
    totalClicks: clicks.length,
    byDate: Object.entries(byDate).map(([date, count]) => ({ date, count })),
    topReferrers,
  });
});

export default router;
