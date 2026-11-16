# BINGOOO Spin & Win — Security Controls & Launch Checklist

## 1. Security Architecture Summary
1. **Server-Authoritative Prize Engine**: The frontend has zero influence over which prize is picked. Prizes are generated using Node.js CSPRNG (`crypto.randomInt`) inside an atomic database transaction.
2. **Strict Single-Spin Enforcement**: Guaranteed by PostgreSQL compound unique index `@@unique([customerId, periodKey])`. Simultaneous race requests cannot create duplicate spins.
3. **Password Security**: Administrative passwords hashed using Argon2id (`argon2.hash`).
4. **Data Privacy**: Customer mobile numbers are masked in all public contexts (`+91 98*** **210`).
5. **No Production OTP Bypasses**: The backend throws a hard initialization error if `MOCK_OTP_ENABLED=true` when `NODE_ENV=production`.
6. **Strict Rate Limiting & Throttling**: `@nestjs/throttler` limits repeated attempts on auth and spin endpoints.

---

## 2. India Legal & Launch Compliance Checklist

Before taking the Spin & Win campaign live for the public in Srikakulam:
- [ ] **SMS DLT Registration**: Register your business entity and sender ID (e.g. `BGOSTP`) with Indian telecom operators via DLT portals (Jio, Airtel, or Vodafone Idea DLT).
- [ ] **SMS Template Approval**: Ensure your OTP SMS message matches the approved DLT template: `{#var#} is your BINGOOO verification code. Valid for 5 minutes.`
- [ ] **Physical Store Terms**: Display the promotion rules and voucher expiry clearly inside the store at Main Road, Srikakulam.
- [ ] **Audit Trail Review**: Verify that the Super Admin regularly monitors `AuditLog` records for unauthorized prize changes or voucher revocations.
