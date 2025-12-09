# ThunderFast Electronics - Deployment Guide

This guide explains how to deploy this application to Vercel.

## Prerequisites

1. A PostgreSQL database (you can use Neon, Supabase, or any PostgreSQL provider)
2. Node.js 20+ installed locally

## Environment Variables

Set the following environment variables in your Vercel dashboard:

```
DATABASE_URL=postgresql://username:password@host:port/database
ADMIN_PASSWORD=your_secure_admin_password
```

## Deploying to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Clone/download this repository
3. Run `npm install` to install dependencies
4. Run `vercel` in the project directory
5. Set the `DATABASE_URL` and `ADMIN_PASSWORD` environment variables in Vercel dashboard

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the repository in Vercel dashboard
3. Configure:
   - Build Command: `vite build`
   - Output Directory: `dist/public`
   - Framework Preset: Vite
4. Add environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `ADMIN_PASSWORD` - Password for the admin dashboard
5. Deploy

The `vercel.json` file is already configured with the correct rewrites for API routes.

## Database Setup

Before deploying, ensure your PostgreSQL database has the required tables:

```bash
# Run locally with DATABASE_URL set
npm run db:push
```

Or manually execute the SQL schema from `shared/schema.ts`.

## Project Structure for Deployment

```
├── api/                    # Vercel serverless functions
│   ├── _db.ts              # Shared database utilities
│   ├── stores.ts           # GET /api/stores
│   ├── products.ts         # GET /api/products
│   ├── offers.ts           # GET /api/offers
│   ├── pilot-signup.ts     # POST /api/pilot-signup
│   ├── track-event.ts      # POST /api/track-event
│   └── admin/
│       ├── login.ts        # POST /api/admin/login
│       ├── verify.ts       # GET /api/admin/verify
│       └── stats.ts        # GET /api/admin/stats
├── client/                 # React frontend
├── shared/                 # Shared types and schema
└── vercel.json             # Vercel configuration
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stores` | GET | List all stores |
| `/api/stores/:id` | GET | Get store by ID |
| `/api/products` | GET | List all products |
| `/api/products?q=search` | GET | Search products |
| `/api/offers` | GET | List all offers |
| `/api/pilot-signup` | POST | Create pilot signup |
| `/api/track-event` | POST | Track click event |
| `/api/admin/login` | POST | Admin login (returns auth token) |
| `/api/admin/verify` | GET | Verify admin auth token |
| `/api/admin/stats` | GET | Get analytics dashboard data (requires auth) |

## Local Development

This project runs on Replit with Express.js in development. The serverless functions are used only for Vercel deployment.

```bash
# Development (on Replit or locally)
npm run dev

# Build for production (Replit)
npm run build
npm start
```

## Troubleshooting

### Database Connection Issues
- Ensure your PostgreSQL database allows connections from Vercel IP addresses
- For Neon: Enable "Allow connections from all IPs" or add Vercel IPs to allowlist
- Use SSL mode: Add `?sslmode=require` to your DATABASE_URL

### Function Timeout
- Serverless functions have a 10-second timeout on free tiers
- Optimize database queries if you experience timeouts

### Cold Start Latency
- First request after inactivity may be slow due to cold starts
- This is normal behavior for serverless functions

### Admin Access
- Make sure `ADMIN_PASSWORD` is set in Vercel environment variables
- The admin dashboard is at `/admin`
