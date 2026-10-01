import React from "react";
import Link from "next/link";
import { HelpCircle, Shield, CreditCard, Wrench, Briefcase, FileText } from "lucide-react";

export default function HelpCenterPage() {
  const topics = [
    {
      title: "Getting Started & Registration",
      icon: Briefcase,
      desc: "How to register as an employer or worker, set your preferred language, and configure your profile.",
      link: "/faq",
    },
    {
      title: "KYC & Aadhaar Verification",
      icon: Shield,
      desc: "Understanding the Surepass verification flow, OTP dispatch, and privacy masking under the DPDP Act.",
      link: "/safety",
    },
    {
      title: "Payments, Pricing & Escrow",
      icon: CreditCard,
      desc: "How Razorpay payment pre-authorization works, fund protection, and completion approvals.",
      link: "/how-it-works",
    },
    {
      title: "Worker Wallet & UPI Withdrawals",
      icon: Wrench,
      desc: "Rules for instant payouts to UPI IDs, minimum withdrawal thresholds (₹100), and transaction history.",
      link: "/how-it-works",
    },
    {
      title: "Disputes & Cancellation Policy",
      icon: FileText,
      desc: "What to do if a job is incomplete, delayed, or unsatisfactory, and how admin mediation works.",
      link: "/terms",
    },
    {
      title: "Community Guidelines & Safety",
      icon: HelpCircle,
      desc: "Respectful communication, prohibition of harassment, fair wage standards, and reporting bad actors.",
      link: "/community-guidelines",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            HelpHun Knowledge Base
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Help Center</h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Browse guides, tutorials, and policies to get the most out of HelpHun.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.title}
                href={t.link}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle hover:border-teal-500 hover:shadow-card transition-all space-y-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{t.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
              </Link>
            );
          })}
        </div>

        <div className="bg-indigo-950 text-white rounded-2xl p-6 sm:p-8 text-center space-y-3">
          <h2 className="text-lg font-bold">Still Need Assistance?</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Our support desk is online from 8:00 AM to 8:00 PM IST every day to assist you with active micro-jobs.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center text-xs font-bold bg-teal-500 text-slate-950 px-4 py-2 rounded-xl hover:bg-teal-400 transition-colors"
          >
            Open Support Ticket &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
