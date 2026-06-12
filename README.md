# URL Shortener + Analytics

A URL shortener with a personal dashboard showing click analytics.

## Features

- Shorten any URL to a 6-character short code
- Fast redirects via Redis cache
- Click analytics: total clicks, daily chart, top referrers
- JWT authentication — each user manages their own links

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Recharts
- **Backend:** Node.js, Express, Prisma, PostgreSQL, Redis, JWT

## Getting Started

### Prerequisites

- PostgreSQL running locally
- Redis running locally

### Server

```bash
cd server
npm install
cp .env.example .env  # fill in DATABASE_URL, REDIS_URL, JWT_SECRET
npx prisma migrate dev
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173
