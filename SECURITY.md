# HelpHub — Security Architecture & Data Protection Policy

HelpHub is engineered with a Zero-Trust, Defense-in-Depth model tailored to Indian regulatory standards, including the Digital Personal Data Protection (DPDP) Act, 2023, and RBI Payment Aggregator Guidelines.

---

## 1. Authentication & Role-Based Access Control (RBAC)

### 1.1 Identity Verification & Token Integrity
- User identity is managed via Firebase Authentication with secure HTTP-only cookies and JWT bearer tokens.
- Every API route and Server Action verifies tokens server-side using the Firebase Admin SDK (`verifyIdToken`).
- Client-side claims are never trusted for authorization decisions.

### 1.2 Privilege Escalation Defense
- Self-registration is strictly hard-coded to allow only `'worker'` or `'employer'`.
- Any registration payload attempting to inject `'admin'` or `'accountant'` is rejected with HTTP 403.
- Elevated roles (`admin`, `accountant`) must be provisioned via Firebase Admin Custom Claims or an authorized administrative workflow requiring existing super-admin approval.

---

## 2. Financial & Transaction Security

### 2.1 Integer Paise Financial Calculations
- Floating-point representations (IEEE 754) are strictly prohibited for monetary values.
- All amounts are computed and stored in **integer paise** (e.g., ₹500.00 is stored as `50000`).
- Rounding occurs only at the final point of display.

### 2.2 Payment Verification & Webhook Replay Defense
- Client-reported payment status is treated as completely unverified.
- All payments are verified on the server using HMAC-SHA256 signature calculation:
  ```
  generated_signature = hmac_sha256(order_id + "|" + payment_id, RAZORPAY_KEY_SECRET)
  ```
- Razorpay Webhooks (`/api/payments/webhook`) inspect the raw unmodified request body against the `X-Razorpay-Signature` header.
- Webhook events are logged in an idempotent collection (`processedWebhooks/{eventId}`). Duplicate deliveries are identified and safely acknowledged without re-executing ledger operations.

### 2.3 Wallet Concurrency & Ledger Integrity
- Worker earnings payouts and withdrawal requests are executed exclusively inside atomic Firestore Transactions (`runTransaction`).
- Concurrency locks guarantee:
  1. No double-debiting.
  2. Available balance never drops below zero (`availableBalancePaise >= requestedAmount`).
  3. Reversal idempotency on failed payouts.

---

## 3. Data Protection & Privacy (DPDP Act Compliance)

### 3.1 KYC & Aadhaar Masking Policy
- **No Raw Storage:** Raw 12-digit Aadhaar numbers, biometric data, or full PAN document scans are never stored in Cloud Firestore or application logs.
- **Masking:** Only masked identifiers (e.g. `XXXXXXXX1234`) and provider verification IDs (`surepass_req_...`) are persisted.
- **Strict Consent:** KYC verification mandates explicit affirmative consent checkboxes specifying the statutory verification purpose.

### 3.2 Geolocation Privacy
- Precise coordinates (GPS latitude/longitude to 6 decimal places) are truncated server-side before publication on public job boards or search indexes.
- Public listings expose only the locality/suburb and approximate coordinates rounded to ~1 km accuracy (`toFixed(2)`).
- Precise live location tracking is strictly restricted to active, in-progress assignments and terminates automatically upon job completion.

---

## 4. Input Validation, XSS & Injection Prevention

- **Zod Schema Enforcement:** All user inputs (job postings, applications, messages, profile data) are sanitized and validated against rigid Zod schemas before database insertion.
- **SQL / NoSQL Injection:** Firestore natively utilizes parameterized query objects, mitigating classic SQL injection.
- **XSS Defense:** Next.js React JSX output automatically escapes content. User-generated markdown or HTML rendering is sanitized.

---

## 5. File Uploads & Firebase Storage Rules

- Profile avatars and dispute evidence attachments are restricted to approved MIME types:
  - Images: `image/jpeg`, `image/png`, `image/webp`
  - Documents: `application/pdf`
- File size caps: Maximum 5MB for images, 10MB for dispute documents.
- Storage rules enforce user ownership: workers/employers can only read/write files under their authenticated UID path (`/users/{userId}/*`).

---

## 6. Audit Logging & Observability

- High-impact events are recorded in an append-only `auditLogs` Firestore collection:
  - Admin suspensions and reinstatements.
  - Dispute resolution outcomes and fund disbursements.
  - Manual KYC reviews and role modifications.
  - Failed withdrawal alerts.
- Audit entries record `actorId`, `actorIp`, `action`, `resourceId`, and `timestamp`.
