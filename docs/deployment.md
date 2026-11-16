# BINGOOO Spin & Win — Deployment Guide

## 1. Architecture Overview
- Frontend: Single Page Application (React + Vite + Tailwind CSS) build output in `apps/web/dist`
- Backend: NestJS Node.js application in `apps/api/dist`
- Database: Managed PostgreSQL 15/16 instance

---

## 2. Recommended Free-Tier / Production Deployment Options

### Option A: Railway / Render + Supabase / Neon (Recommended for quick setup)
1. **Managed PostgreSQL**:
   - Create a free database on **Neon** (`neon.tech`) or **Supabase** (`supabase.com`).
   - Copy the connection string: `postgresql://user:password@host/dbname?sslmode=require`.
2. **NestJS API Service**:
   - Deploy `apps/api` on **Render** (free tier Web Service) or **Railway**.
   - Build Command: `npm install && npm run build --workspace=@bingooo/api`
   - Start Command: `npm run start:prod --workspace=@bingooo/api`
   - Set environment variables (`DATABASE_URL`, `JWT_ADMIN_SECRET`, `JWT_CUSTOMER_SECRET`, `NODE_ENV=production`, `MOCK_OTP_ENABLED=false`).
3. **React Frontend**:
   - Deploy `apps/web` on **Vercel** or **Cloudflare Pages** (unlimited free bandwidth).
   - Build command: `npm run build --workspace=@bingooo/web`
   - Output directory: `apps/web/dist`

---

## 3. Production Domain & SSL Setup (`bingooo.co.in`)
1. In your DNS provider (Cloudflare, GoDaddy, or Hostinger):
   - Add CNAME for `bingooo.co.in` pointing to Vercel/Cloudflare Pages.
   - Add CNAME for `api.bingooo.co.in` pointing to Render/Railway service.
2. Update CORS in `apps/api/src/main.ts` or set `FRONTEND_URL=https://bingooo.co.in`.
