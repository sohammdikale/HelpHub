import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/80 shadow-subtle space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div className="border-b border-slate-200 pb-4 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-400">Last Revised: October 1, 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By registering, browsing, posting, or applying for micro-jobs on HelpHun (&quot;the Platform&quot;), you agree to be bound by these Terms of Service and applicable laws of the Republic of India.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Marketplace Model & Intermediary Status</h2>
          <p>
            HelpHun acts strictly as an electronic intermediary connecting independent workers with employers. HelpHun does not employ workers, nor does it control or direct how tasks are executed. Workers operate as independent micro-contractors.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Identity Verification & Disclaimers</h2>
          <p>
            Identity checks through Surepass verify official government records. Verification does not constitute a background guarantee, character warranty, or certification of quality. Users are responsible for exercising reasonable caution and inspecting completed tasks before authorizing fund release.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Payments, Escrow & Fees</h2>
          <p>
            Payments are collected and held via Razorpay payment rails. Employers agree to fund accepted jobs in advance. Once an employer marks a job completed, payment release is final and non-reversible except through formal administrative dispute resolution.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Prohibited Activities</h2>
          <p>
            Users must not list illegal goods or services, bypass platform payment mechanisms, forge KYC documents, engage in harassment or abusive conduct, or misuse live tracking capabilities.
          </p>
        </section>
      </div>
    </div>
  );
}
