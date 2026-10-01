import React from "react";
import Link from "next/link";
import { Sparkles, Briefcase, Wrench, ShieldCheck, CreditCard, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Guide to HelpHun
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How HelpHun Works
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            A transparent walkthrough of the end-to-end journey from posting a task to mutual completion and verified payment release.
          </p>
        </div>

        {/* Section 1: For Employers */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950 text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">For Employers (Hiring Help)</h2>
              <p className="text-xs text-slate-500">How to get your everyday tasks resolved cleanly</p>
            </div>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-slate-700">
            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-950">
                1
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Create a Task Listing</h3>
                <p className="text-slate-500 leading-relaxed">
                  Enter your task description. Our built-in Google Gemini AI classifies the trade into one of 14 standardized Indian sectors, suggests skills, and recommends fair wage bounds based on task duration.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-950">
                2
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Review Candidate Applications</h3>
                <p className="text-slate-500 leading-relaxed">
                  Nearby workers within your area review your listing and submit their bids. You can inspect each candidate&apos;s Surepass KYC badge, past job ratings, and proposed hourly or fixed quote.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-950">
                3
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Pre-Authorize Escrow Payment</h3>
                <p className="text-slate-500 leading-relaxed">
                  Once you select a worker, you authorize the agreed amount via Razorpay (UPI, Card, NetBanking). The money is held safely in escrow and is NOT sent to the worker until the job is inspected.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-950">
                4
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Confirm Completion & Rate</h3>
                <p className="text-slate-500 leading-relaxed">
                  When the worker marks the job finished, inspect the work and click &quot;Confirm Completion&quot;. Escrow funds are released to the worker&apos;s digital wallet, and you can leave a star rating and review.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: For Workers */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">For Workers (Earning Income)</h2>
              <p className="text-xs text-slate-500">How to find consistent local micro-jobs and get paid</p>
            </div>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-slate-700">
            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-800">
                1
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Register & Complete KYC</h3>
                <p className="text-slate-500 leading-relaxed">
                  Sign up, configure your primary skills, hourly rate, and travel radius. Submit your Aadhaar or PAN via Surepass to get a Verified Worker badge, unlocking higher employer trust and UPI withdrawals.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-800">
                2
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Discover & Apply for Nearby Jobs</h3>
                <p className="text-slate-500 leading-relaxed">
                  Use the live distance filter to see tasks within 1 to 25 km of your current location. Submit your bid or accept the employer&apos;s listed budget.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-800">
                3
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Execute Work & Communicate</h3>
                <p className="text-slate-500 leading-relaxed">
                  Coordinate via in-app chat. Once assigned, location sharing is enabled strictly for the active assignment. Mark the task done when finished.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-800">
                4
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Instant UPI Payouts</h3>
                <p className="text-slate-500 leading-relaxed">
                  Earnings are credited directly to your HelpHun wallet in integer paise. Request a payout to your UPI ID (Google Pay, PhonePe, Paytm, BHIM) anytime once your balance exceeds ₹100.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            <span>Create Your Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
