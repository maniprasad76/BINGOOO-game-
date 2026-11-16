# BINGOOO Spin & Win — System Architecture & Technical Specifications

## 1. Executive Summary
This document outlines the architecture, data models, security controls, and promotion logic for the **BINGOOO** Spin & Win promotional application for our physical retail store in **Srikakulam, Andhra Pradesh, India** (`bingooo.co.in`).

The platform's primary goal is to drive foot traffic into our physical retail men's store by awarding monthly discount vouchers (10% OFF, 5% OFF), free gifts, and fair participation chances.

---

## 2. Strict Monthly Eligibility Architecture

### Asia/Kolkata Timezone & Month Boundaries
The core promotional rule mandates that each verified Indian mobile number (`+91XXXXXXXXXX`) can spin the wheel **at most once per calendar month**.
- Timezone: `Asia/Kolkata` (IST)
- Period Key format: `YYYY-MM` (e.g., `2026-11`)
- Boundary: Starts at `00:00:00.000` IST on the 1st day of the calendar month and concludes at `00:00:00.000` IST on the 1st day of the following month.
- Auto-Reset: At `00:00:00` IST on the 1st of every month, any customer who checks eligibility has no record in the database for the new `YYYY-MM` period, and is immediately eligible.
- No Carryover: A user who did not spin last month receives exactly one chance in the new month; unused spins never accumulate.

### Database Uniqueness Constraint
Monthly eligibility is strictly enforced at the database level by PostgreSQL:
```prisma
model Spin {
  ...
  @@unique([customerId, periodKey], name: "customer_period_unique")
}
```
Under concurrent requests, PostgreSQL unique constraint `P2002` prevents duplicate spins.

---

## 3. Cryptographically Secure Probability Engine
Visual wheel segments and reward probabilities are completely independent.
- Probability Weight Resolution: Uses 10,000 basis points (100.00%).
- Default Weights:
  - 10% OFF: 10% (1,000 bp)
  - 5% OFF: 30% (3,000 bp)
  - Free Gift: 10% (1,000 bp)
  - Better Luck Next Time: 50% (5,000 bp)
- CSPRNG: Powered by Node.js `crypto.randomInt(0, 10000)`—unbiased hardware-backed random generator.
- Frontend Decoupling: The server commits the prize and saves the record **before** sending the result to the browser. The frontend wheel animates smoothly and stops at the segment corresponding to the backend prize.

---

## 4. Voucher & Inventory Lifecycle
- Format: `BGO-XXXX-XXXX` (using unambiguous characters `[2-9A-HJ-NP-Z]`).
- Expiry: Configurable (default 30 days from issuance).
- In-Store Redemption: Cashiers enter the code into the Staff Portal. A database transaction atomically verifies the code, checks expiration, marks status as `REDEEMED`, and reconciles gift inventory.
