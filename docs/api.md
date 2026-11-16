# BINGOOO Spin & Win — REST API Documentation

Base URL: `/api/v1`
Interactive Swagger UI: `http://localhost:3001/api/docs`

---

## 1. Authentication Endpoints

### 1.1 Request Mobile OTP
`POST /api/v1/auth/otp/request`
- Request:
```json
{
  "phoneNumber": "9876543210",
  "marketingConsent": true
}
```
- Response:
```json
{
  "success": true,
  "challengeId": "uuid-here",
  "maskedPhone": "+91 98*** **210",
  "expiresInSeconds": 300,
  "resendCooldownSeconds": 60,
  "devMockOtp": "123456" // Only present when MOCK_OTP_ENABLED=true in development
}
```

### 1.2 Verify Mobile OTP
`POST /api/v1/auth/otp/verify`
- Request:
```json
{
  "challengeId": "uuid-here",
  "otp": "123456"
}
```
- Response:
```json
{
  "token": "jwt_customer_session_token",
  "customer": {
    "id": "customer-uuid",
    "maskedPhone": "+91 98*** **210",
    "isVerified": true
  }
}
```

---

## 2. Spin Wheel Endpoints

### 2.1 Get Visual Configuration
`GET /api/v1/wheel/config`
Returns active visual segments for wheel canvas rendering.

### 2.2 Check Monthly Eligibility
`GET /api/v1/wheel/eligibility`
Header: `Authorization: Bearer <customer_token>`
- Response:
```json
{
  "isEligible": true,
  "periodKey": "2026-11",
  "nextEligibleAt": "2026-12-01T00:00:00.000Z"
}
```

### 2.3 Execute Wheel Spin
`POST /api/v1/wheel/spin`
Header: `Authorization: Bearer <customer_token>`
Optional Header: `x-idempotency-key: unique_spin_request_key`
- Response:
```json
{
  "spinId": "spin-uuid",
  "prizeType": "DISCOUNT_10",
  "prizeName": "10% OFF Entire Purchase",
  "description": "Get flat 10% discount on T-shirts, Shirts, Jeans & Trousers at BINGOOO Srikakulam.",
  "rewardCode": "BGO-K79A-4M2P",
  "expiresAt": "2026-12-16T18:30:00.000Z",
  "segmentIndex": 0,
  "isWin": true,
  "periodKey": "2026-11"
}
```

---

## 3. Rewards & In-Store Redemption

### 3.1 Customer Rewards List
`GET /api/v1/rewards`
Header: `Authorization: Bearer <customer_token>`

### 3.2 Staff Redemption
`POST /api/v1/admin/rewards/redeem`
Header: `Authorization: Bearer <admin_staff_token>`
```json
{
  "code": "BGO-K79A-4M2P",
  "notes": "Invoice #8921"
}
```
