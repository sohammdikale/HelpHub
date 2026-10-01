# HelpHun — Find Help Nearby 🇮🇳
> **Hyperlocal micro-job and services marketplace for India.**  
> Connecting everyday employers with verified, skilled, and semi-skilled local workers.

---

## 🌟 Key Features

### 👷 For Workers
- **Hyperlocal Discovery:** Discover jobs within a customizable radius (1–25 km) filtered by category, urgency, and budget.
- **Fair Wage Guarantees:** Upfront pricing in Indian Rupees with guaranteed escrow fund lock before work commences.
- **Direct UPI Withdrawals:** Real-time earnings credited to an auditable digital wallet with instant payout requests to any UPI ID (`@upi`).
- **Verifiable Reputation:** Build a trusted local profile with transparent star ratings and customer reviews.
- **Privacy First:** Real-time live location is shared only during an active, ongoing assignment.

### 💼 For Employers
- **Quick Job Posting with AI:** Type a task description in plain language; Google Gemini automatically assigns categories, extracts required skills, and recommends fair wage bounds.
- **Verified Candidates:** View worker KYC verification status (Aadhaar/PAN verified via Surepass) and past job ratings.
- **In-App Messaging:** Secure real-time chat with candidate and assigned workers without exposing private personal phone numbers.
- **Safe Payments:** Fund jobs safely via Razorpay (UPI, Google Pay, PhonePe, Cards, NetBanking); payments release only upon mutual completion confirmation.
- **Dispute Resolution:** Built-in escalation center with administrative mediation.

### 🛡️ For Administrators & Accountants
- **Admin Control Center:** Platform KPI counters, user suspension/reinstatement, dispute adjudication, and audit logs.
- **Accountant Dashboard:** Double-entry ledger audit, payment transaction logs, platform fee accounting, and CSV report export.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript (Strict Mode), Tailwind CSS, Lucide Icons, React Hook Form, Zod |
| **Backend & APIs** | Next.js Server Actions & API Routes, Firebase Admin SDK (Node.js) |
| **Database & Auth** | Firebase Authentication, Cloud Firestore (Real-time & Transactions), Firebase Storage |
| **AI Integration** | Google Gemini API (Structured JSON output with zero-dependency fallback) |
| **Identity Verification** | Surepass API Adapter (Aadhaar OTP & PAN verification with masked retention) |
| **Payment Gateway** | Razorpay PG (Order creation, HMAC-SHA256 signature verification, webhooks) |
| **Payouts & Wallet** | RazorpayX Payouts / Sandbox UPI processor, integer paise double-entry ledger |
| **Testing** | Vitest, Testing Library, Playwright E2E |

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Node.js >= 18.17.0 (Verified on v26.8.2)
- npm >= 9.x (Verified on v11.19.1)
- A Firebase Project (or run with built-in sandbox mock adapters)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/helphun.git
cd helphun

# Install dependencies
npm install
```

### 3. Environment Setup
```bash
# Copy the environment template
cp .env.example .env.local
```
Fill in your Firebase, Gemini, Surepass, and Razorpay test credentials in `.env.local`.  
*Note: If external API keys are omitted, HelpHun automatically activates graceful sandbox adapters so that all workflows (KYC verification, AI categorization, and payments) can be tested end-to-end locally.*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running Automated Tests
```bash
# Run unit & integration test suites
npm run test

# Run type check & linter
npm run lint
npm run typecheck

# Build for production
npm run build
```

---

## 📂 Project Structure

```
helphun/
├── src/
│   ├── app/                     # Next.js App Router (Public, Auth, Worker, Employer, Admin, Accountant)
│   │   ├── (public)/            # Public marketing, informational & policy pages
│   │   ├── (auth)/              # Login, Register, Forgot Password
│   │   ├── worker/              # Worker dashboard, jobs, wallet, applications, profile
│   │   ├── employer/            # Employer dashboard, job creation, worker search, reviews
│   │   ├── admin/               # Platform administration, dispute center, moderation
│   │   ├── accountant/          # Financial ledgers, platform fee reconciliation, exports
│   │   └── api/                 # Secure REST APIs (AI, KYC, Payments, Webhooks)
│   ├── components/              # UI Component Library (Buttons, Dialogs, Cards, Forms, Layouts)
│   ├── lib/                     # Core Business Logic & Infrastructure
│   │   ├── firebase/            # Client and Admin Firebase SDK connectors
│   │   ├── ai/                  # Google Gemini AI categorization adapter & fallback
│   │   ├── kyc/                 # Surepass KYC verification engine & sandbox
│   │   ├── payments/            # Razorpay order creator, signature verifier, webhooks
│   │   ├── wallet/              # Concurrency-safe double-entry ledger in integer paise
│   │   └── location/            # Haversine distance calculator & geo-privacy filters
│   └── types/                   # Unified TypeScript definitions & Zod validation schemas
├── firestore.rules              # Cloud Firestore security rules
├── storage.rules                # Firebase Storage security rules
├── ARCHITECTURE.md              # Detailed system architecture document
├── SECURITY.md                  # Security policies and DPDP Act compliance
└── IMPLEMENTATION_PLAN.md       # Implementation phases and progress checklist
```

---

## 📜 License & Compliance
Built with ❤️ for Indian micro-enterprises and workers.  
Aligned with the Digital Personal Data Protection Act, 2023.
