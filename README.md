# BINGOOO SPIN & WIN — Promotional Web Application

Production-oriented promotional Spin & Win web application for **BINGOOO** (`bingooo.co.in`), premium men's clothing store in Srikakulam, Andhra Pradesh, India.

---

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js v20+ and npm v10+
- Docker Desktop (or local PostgreSQL 15/16)

### 2. Copy-Paste Local Setup Commands

Open PowerShell in this directory:

```powershell
# 1. Start PostgreSQL with Docker
docker compose up -d

# 2. Run Database Migrations
npm run db:migrate

# 3. Seed Database with initial prizes, demo customers, and admin accounts
npm run db:seed

# 4. Start both NestJS API (port 3001) and React Frontend (port 5173)
npm run dev
```

### 3. Application URLs
- **Customer Web Application**: [http://localhost:5173](http://localhost:5173)
- **Interactive Spin Wheel**: [http://localhost:5173/spin](http://localhost:5173/spin)
- **Staff / Admin Portal**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Backend REST API**: [http://localhost:3001/api/v1](http://localhost:3001/api/v1)
- **Swagger OpenAPI Docs**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

---

## Default Development Credentials

### Admin Users
- **Super Admin**:
  - Username: `admin`
  - Password: `Bingooo@Admin2026!`
  - Capabilities: Full access, probability modification, settings updates, audit logs
- **Store Staff (Cashier)**:
  - Username: `staff1`
  - Password: `Staff@Bingooo2026!`
  - Capabilities: In-store voucher validation and redemption

### Demo Customer
- Mobile Number: `9876543210`
- Mock OTP: `123456` (Auto-filled or logged in console during dev mode)

---

## Core Promotional Architecture

### 1. Exactly One Spin Per Calendar Month (Asia/Kolkata)
- Each verified phone number gets **at most 1 spin per month**.
- Eligibility period is based strictly on the `Asia/Kolkata` calendar month (`YYYY-MM`).
- At **00:00:00 IST on the 1st of every month**, all customers automatically become eligible for a new spin.
- Unused spins **never accumulate**.
- Enforced at the database level by PostgreSQL unique constraint: `@@unique([customerId, periodKey])`.

### 2. Cryptographically Secure Probability Engine
- Outcome is determined on the server using hardware-backed CSPRNG (`crypto.randomInt(0, 10000)`).
- Basis points totaling 10,000 (100.00%):
  - 10% OFF: 1,000 bp (10%)
  - 5% OFF: 3,000 bp (30%)
  - Free Gift: 1,000 bp (10%)
  - Better Luck Next Time: 5,000 bp (50%)
- Frontend wheel rotates smoothly and lands precisely on the pre-committed server outcome.
