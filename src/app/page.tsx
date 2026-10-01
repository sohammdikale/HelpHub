"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Briefcase,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  Wallet,
  Clock,
  HelpCircle,
} from "lucide-react";
import { APPROVED_CATEGORIES } from "@/types";
import { INDIAN_CITIES_COORDINATES } from "@/lib/location/distance";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("New Delhi");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCity) params.set("city", selectedCity);
    if (selectedCategory && selectedCategory !== "All Categories") {
      params.set("cat", selectedCategory);
    }
    router.push(`/find-work?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-16 sm:py-24">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-3.5 py-1 text-xs font-semibold text-teal-300 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Hyperlocal Micro-Job Marketplace for India</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Local Work. <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Real Opportunities.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect with nearby verified workers for plumbing, electrical fixes, cleaning, cooking, deliveries, and everyday assistance. Upfront pricing, safe escrow payments, and instant UPI payouts.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/find-work"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-3.5 text-sm font-bold shadow-lg shadow-teal-500/25 transition-all active:scale-95"
            >
              <Wrench className="w-4 h-4" />
              Find Work Nearby
            </Link>
            <Link
              href="/employer/jobs/new"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-3.5 text-sm font-bold backdrop-blur-sm transition-all active:scale-95"
            >
              <Briefcase className="w-4 h-4" />
              Hire Someone (Post Job)
            </Link>
          </div>

          {/* 3. Search Bar for local services and jobs */}
          <div className="mt-12 max-w-3xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="bg-white p-2 rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col sm:flex-row gap-2"
            >
              <div className="flex-1 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-100">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Task (e.g. Tap repair, Fan wiring, Cleaning)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
              </div>

              <div className="flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-100">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="text-xs sm:text-sm text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  {Object.keys(INDIAN_CITIES_COORDINATES).map((city) => (
                    <option key={city} value={city} className="text-slate-900">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 px-3 py-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs sm:text-sm text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="All Categories" className="text-slate-900">
                    All Categories
                  </option>
                  {APPROVED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="text-slate-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-indigo-950 hover:bg-indigo-900 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 4. How HelpHub Works */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Simple 3-Step Process
            </span>
            <h2 className="mt-2 text-3xl font-black text-slate-900 tracking-tight">
              How HelpHub Works
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Designed for ease of use across India, whether you are hiring help or looking for daily micro-gigs.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Employers */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 sm:p-8">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-950 text-white">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">For Employers (Needing Help)</h3>
              </div>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-950">
                    1
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Post Task in Plain Words</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Describe your requirement. Our Google Gemini AI classifies the service, extracts required skills, and recommends fair wage bounds.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-950">
                    2
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Select Verified Worker</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Review bids from nearby workers with KYC badges and verified ratings. Chat directly in-app without sharing private numbers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-950">
                    3
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Confirm Completion & Release Pay</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Funds remain protected via Razorpay escrow until you inspect and approve the completed task.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/employer/jobs/new"
                  className="inline-flex items-center text-xs font-bold text-indigo-950 hover:text-indigo-800 gap-1"
                >
                  Post a micro-job now &rarr;
                </Link>
              </div>
            </div>

            {/* For Workers */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 sm:p-8">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">For Workers (Earning Daily)</h3>
              </div>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
                    1
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Browse Nearby Opportunities</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Discover micro-jobs within your custom travel radius (1–25 km) filtered by trade, start time, and payment terms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
                    2
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Apply & Agree on Terms</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Submit your bid or accept the offered budget. Communicate with the employer via secure in-app messaging.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
                    3
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Complete & Withdraw via UPI</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upon job approval, earnings are credited immediately to your HelpHub digital wallet with instant payout requests to your UPI ID.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/find-work"
                  className="inline-flex items-center text-xs font-bold text-teal-700 hover:text-teal-800 gap-1"
                >
                  Browse available jobs &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Popular Job Categories */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                Indian Services Directory
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Popular Categories
              </h2>
            </div>
            <Link
              href="/find-services"
              className="text-xs font-bold text-indigo-950 hover:text-indigo-800 flex items-center gap-1"
            >
              View all 14 categories &rarr;
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {APPROVED_CATEGORIES.slice(0, 8).map((cat) => (
              <Link
                key={cat}
                href={`/find-work?cat=${encodeURIComponent(cat)}`}
                className="group rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle hover:border-teal-500 hover:shadow-card transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {cat}
                </h3>
                <p className="mt-1 text-[11px] text-slate-500">
                  Tap to view local requests
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. How Worker Verification Works (Surepass KYC) */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-800">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Surepass Identity Gateway</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                How Worker & Employer Verification Works
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                HelpHub utilizes automated, privacy-preserving identity verification powered by Surepass.
                We validate official credentials while safeguarding private personal information.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700">
                    <strong>Aadhaar OTP Authentication:</strong> Verifies registered demographic records directly via authorized UIDAI gateway providers.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700">
                    <strong>Zero Raw Aadhaar Storage:</strong> Aligned with the DPDP Act 2023, only masked identifiers (e.g. •••• •••• 9012) are stored.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700">
                    <strong>PAN Tax ID Validation:</strong> Verifies full name and authenticity against income tax department records.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/safety"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
                >
                  Read our full Trust & Safety Protocol &rarr;
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Verification Lifecycle
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-indigo-950" />
                      <span className="text-xs font-semibold text-slate-900">1. User Informed Consent</span>
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">Mandatory</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-indigo-950" />
                      <span className="text-xs font-semibold text-slate-900">2. Surepass Gateway Verification</span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Server-to-Server</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-semibold text-slate-900">3. Masked Badge Issuance</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Verified Badge</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 & 8. Benefits for Workers & Employers */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Worker Benefits */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-4">
              <div className="flex items-center gap-2 text-teal-600">
                <Wallet className="w-5 h-5" />
                <h3 className="text-lg font-bold text-slate-900">Benefits for Workers</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">&#10003;</span>
                  <span><strong>Zero Commission on Micro-Gigs:</strong> Keep 100% of your agreed price for standard tasks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">&#10003;</span>
                  <span><strong>Instant UPI Payouts:</strong> Request withdrawals anytime directly to your Google Pay, PhonePe, or BHIM UPI ID.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">&#10003;</span>
                  <span><strong>Flexible Schedule:</strong> Set your own working hours, custom work radius, and availability toggle.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">&#10003;</span>
                  <span><strong>Reputation Building:</strong> Collect genuine 5-star customer ratings that win you high-value nearby jobs.</span>
                </li>
              </ul>
            </div>

            {/* Employer Benefits */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-4">
              <div className="flex items-center gap-2 text-indigo-950">
                <Briefcase className="w-5 h-5" />
                <h3 className="text-lg font-bold text-slate-900">Benefits for Employers</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-950 font-bold">&#10003;</span>
                  <span><strong>AI Job Categorization:</strong> Type your requirement in natural language; Gemini structures the requirements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-950 font-bold">&#10003;</span>
                  <span><strong>Escrow Protection:</strong> Payments are pre-authorized via Razorpay and released only when you approve the work.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-950 font-bold">&#10003;</span>
                  <span><strong>No Phone Spam:</strong> Chat and share job instructions through secure in-app messaging without exposing personal phone numbers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-950 font-bold">&#10003;</span>
                  <span><strong>Dispute Mediation:</strong> Built-in resolution center supported by platform admins.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Platform Safety & Payment Information */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-950 mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Safe Payments & Responsible Privacy
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            HelpHub integrates industry-leading payment rails from Razorpay, supporting UPI, NetBanking, and RuPay/Visa/MasterCard.
            All transactions are mathematically managed in integer paise to avoid rounding discrepancies.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-900">Double-Entry Ledger</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Every credit and withdrawal is immutably recorded with unique reference hashes.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-900">Cryptographic Signatures</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Webhook payloads and payment receipts are validated using HMAC-SHA256 hashing.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-900">DPDP Act Compliance</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Strict data minimization: no live continuous tracking without active job consent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Frequently Asked Questions */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HelpCircle className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Common questions from employers and workers across Indian cities.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-bold text-slate-900">
                Is HelpHub free to join for workers?
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Yes. Workers can register, complete KYC, and apply for local micro-jobs with zero upfront registration fees.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-bold text-slate-900">
                How does payment release work for employers?
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                When you assign a worker, you authorize the payment via Razorpay. The funds are held safely until the worker finishes the task and you click &quot;Confirm Completion&quot;.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-bold text-slate-900">
                Does KYC verification guarantee the worker will do good work?
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                No. KYC verification confirms government records (Aadhaar/PAN) to prevent fraud and impersonation, but does not guarantee skill or behavior. Please always review past customer ratings and clarify work scope.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-bold text-slate-900">
                How fast are UPI withdrawals credited?
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                In supported regions and sandbox mode, UPI payouts to verified VPA accounts are processed almost instantly (within a few minutes) once approved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-indigo-950 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to Find Help or Earn in Your Neighborhood?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Join thousands of households, micro-businesses, and skilled independent workers on HelpHub.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/register"
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/find-work"
              className="border border-white/20 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-colors"
            >
              Explore Live Tasks
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
