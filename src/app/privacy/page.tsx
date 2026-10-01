import React from "react";
import { ShieldCheck, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/80 shadow-subtle space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div className="border-b border-slate-200 pb-4 space-y-1">
          <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Personal Data Protection Act, 2023 Aligned</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">Effective Date: October 1, 2026 &bull; Version 1.0</p>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Data Principal Rights & Notice</h2>
          <p>
            HelpHub Technologies Pvt. Ltd. operates as a Data Fiduciary under the Digital Personal Data Protection (DPDP) Act, 2023. We collect only the minimum necessary personal data required to connect employers and workers, prevent fraudulent activities, and settle payments.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account Data:</strong> Full name, verified mobile number, email address, preferred language, and city/PIN code.</li>
            <li><strong>KYC Verification Metadata:</strong> Masked Aadhaar identifier (e.g. •••• •••• 1234), PAN holder name, and Surepass transaction verification IDs. <em>We strictly do NOT retain full 12-digit Aadhaar numbers or biometric data.</em></li>
            <li><strong>Approximate Location Data:</strong> City and neighborhood coordinates truncated to ~1 km accuracy for nearby job discovery feeds.</li>
            <li><strong>Financial Records:</strong> Transaction IDs, integer paise amounts, UPI VPAs for withdrawals, and Razorpay payment signatures.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Purpose of Processing</h2>
          <p>We process your data strictly to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Facilitate mutual discovery between employers and nearby workers.</li>
            <li>Verify identity and authenticate genuine accounts.</li>
            <li>Execute secure escrow payments and UPI payouts via authorized payment partners.</li>
            <li>Maintain an immutable audit trail for dispute adjudication and regulatory compliance.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Data Deletion & Privacy Inquiries</h2>
          <p>
            You have the right to review, update, or request the deletion of your account and personal data.
            Deletion requests can be submitted through your account settings or by emailing our Data Protection Officer (DPO) at <a href="mailto:dpo@helphub.in" className="text-teal-700 underline font-semibold">dpo@helphub.in</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
