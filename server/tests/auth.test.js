import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import app from '../src/app.js';
import prisma from '../src/lib/prisma.js';

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: { contains: 'test-auth' } } });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { contains: 'test-auth' } } });
  await prisma.$disconnect();
});

describe('POST /auth/register', () => {
  it('creates a user and returns a token', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test-auth@example.com', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('rejects duplicate email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test-auth@example.com', password: 'password123' });
    expect(res.status).toBe(409);
  });
});

describe('POST /auth/login', () => {
  it('returns token for valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test-auth@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejects invalid password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test-auth@example.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});
