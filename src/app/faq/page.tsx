import React from "react";
import { HelpCircle } from "lucide-react";

export default function FaqPage() {
  const faqs = [
    {
      q: "What is HelpHun and what does 'Find Help Nearby' mean?",
      a: "HelpHun is an Indian hyperlocal micro-job and services platform. It connects people who need help with everyday domestic and business tasks (like plumbing, fan wiring, deep cleaning, moving, parcel delivery) to verified, skilled, and semi-skilled workers within a close geographic radius (1–25 km).",
    },
    {
      q: "How does identity verification (KYC) work?",
      a: "We integrate Surepass to verify Indian identity documents (Aadhaar OTP and PAN). Once authenticated, the user receives a verified badge. In compliance with the Digital Personal Data Protection (DPDP) Act, full 12-digit Aadhaar numbers are never stored in our database; only masked tokens (•••• •••• 1234) are retained.",
    },
    {
      q: "How do payments work on HelpHun?",
      a: "When an employer selects and confirms a worker for a job, they pre-authorize the payment via Razorpay. The funds remain securely held in escrow. When the worker finishes the task, the employer reviews the work and clicks 'Confirm Completion', which automatically credits the worker's HelpHun digital wallet in integer paise.",
    },
    {
      q: "How do workers withdraw their earnings?",
      a: "Workers can request instant payouts to any valid Indian UPI ID (e.g., yourname@okaxis, yourname@ybl, yourname@paytm) directly from their wallet dashboard once their available balance is at least ₹100. Payouts are reconciled atomically.",
    },
    {
      q: "What happens if there is a dispute or incomplete work?",
      a: "Either party can raise a formal dispute through the platform. The job enters the 'disputed' state and funds remain safely frozen. A HelpHun platform administrator examines the conversation log, task description, and submitted photo evidence to either issue a partial/full refund to the employer or disburse payment to the worker.",
    },
    {
      q: "Are worker locations tracked all the time?",
      a: "No. HelpHun enforces strict location privacy. Public listings only show approximate area coordinates (~1 km resolution). Precise location sharing is only permitted during an active, ongoing assignment with the worker's explicit consent, and shuts down immediately when the job concludes.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-teal-600 mx-auto" />
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Everything you need to know about HelpHun workflows, payments, and security.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-2">
              <h3 className="text-sm font-bold text-slate-900">{f.q}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
