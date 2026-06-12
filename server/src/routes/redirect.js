import { Router } from 'express';
import prisma from '../lib/prisma.js';
import redis from '../lib/redis.js';

const router = Router();

router.get('/:code', async (req, res) => {
  const { code } = req.params;

  let originalUrl = await redis.get(code);

  if (!originalUrl) {
    const link = await prisma.shortLink.findUnique({ where: { shortCode: code } });
    if (!link) return res.status(404).send('Link not found');
    originalUrl = link.originalUrl;
    await redis.set(code, originalUrl);
  }

  res.redirect(302, originalUrl);

  // Log click after redirect is sent
  try {
    const link = await prisma.shortLink.findUnique({ where: { shortCode: code } });
    if (link) {
      await prisma.clickEvent.create({
        data: { shortLinkId: link.id, referrer: req.headers.referer || '' },
      });
    }
  } catch (err) {
    console.error('Click logging failed:', err.message);
  }
});

export default router;
