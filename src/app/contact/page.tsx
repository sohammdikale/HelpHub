"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Contact HelpHub Support</h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Have questions about a micro-job, payment, or KYC verification? Reach our dedicated operations desk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 bg-indigo-950 text-white p-6 sm:p-8 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold">HelpHub Helpdesk</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Available 7 days a week, 8:00 AM to 8:00 PM IST for dispute assistance and identity queries.
            </p>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>support@helphub.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+91 11 4050 9900 (Toll Free Helpline)</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>HelpHub Technologies Pvt Ltd<br />Barakhamba Road, Connaught Place<br />New Delhi, Delhi 110001</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-subtle">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Message Received</h3>
                <p className="text-xs text-slate-500">
                  Our Indian operations team has logged your inquiry and will respond within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anjali Gupta"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email or Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. anjali@example.com or 9876543210"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Inquiry Topic</label>
                  <select className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                    <option>KYC Identity Verification Query</option>
                    <option>Payment or Razorpay Escrow Issue</option>
                    <option>Worker Payout / UPI Withdrawal</option>
                    <option>Dispute or Moderation Appeal</option>
                    <option>General Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your question or issue in detail..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <Button type="submit" variant="accent" size="sm" className="w-full">
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Submit Support Request
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
