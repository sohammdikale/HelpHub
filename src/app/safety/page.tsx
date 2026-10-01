import React from "react";
import { ShieldCheck, Lock, AlertTriangle, EyeOff, UserCheck, HeartHandshake } from "lucide-react";

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3.5 py-1 text-xs font-semibold text-teal-800">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Trust, Safety & Security</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Safety & Verification at HelpHun
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Our multi-layered security measures protect identity, personal information, and payments across every micro-job.
          </p>
        </div>

        {/* Identity Verification Details */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <UserCheck className="w-6 h-6 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">1. Identity Verification via Surepass</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              HelpHun integrates <strong>Surepass Technologies</strong>, a licensed verification platform adhering to Indian identity authentication regulations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900">Aadhaar OTP Flow</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Users provide informed consent before a one-time password (OTP) is sent to the phone registered with their UIDAI record.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900">PAN Card Verification</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Validates the applicant&apos;s name and tax identification against official income tax records to deter fraudulent accounts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Location Policy */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <EyeOff className="w-6 h-6 text-indigo-950" />
            <h2 className="text-lg font-bold text-slate-900">2. Privacy-Preserving Geolocation</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Under our <strong>DPDP Act Data Minimization Policy</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                Public job listings show approximate locations rounded to ~1 km. Exact home addresses are never published.
              </li>
              <li>
                Live location tracking is activated ONLY during an ongoing, accepted assignment with explicit permission from the worker.
              </li>
              <li>
                Continuous background location tracking is strictly forbidden. Location access ceases the moment a job is completed or cancelled.
              </li>
            </ul>
          </div>
        </div>

        {/* Financial Escrow & Dispute Resolution */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Lock className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">3. Escrow & Secure Razorpay Payments</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Every payment is secured by Razorpay rails. Employers authorize payment upfront; the funds remain locked in escrow until the employer confirms satisfactory completion.
            </p>
            <p>
              If a dispute arises, either party can trigger an administrative mediation request. Platform administrators review evidence before releasing or refunding funds.
            </p>
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Important Verification Notice</span>
          </div>
          <p className="leading-relaxed">
            Identity verification confirms that a worker or employer has proven their legal identity via government-linked records.
            <strong> It does not guarantee personal character, craftsmanship, or punctuality.</strong>
            Users must review past job ratings, communicate scope clearly in writing via in-app chat, and exercise prudent judgment.
          </p>
        </div>
      </div>
    </div>
  );
}
