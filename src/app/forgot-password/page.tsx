"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950 text-white shadow-md">
              <Sparkles className="h-5 w-5 text-teal-400" />
            </div>
            <span className="text-2xl font-black text-indigo-950 tracking-tight">
              Help<span className="text-teal-600">Hun</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Reset Your Password</h1>
          <p className="text-xs text-slate-500">We will send you a password reset link</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-card">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-sm font-bold text-slate-900">Password Reset Email Dispatched</h2>
              <p className="text-xs text-slate-500">
                If an account exists for <strong>{email}</strong>, you will receive instructions shortly to reset your password.
              </p>
              <div className="pt-2">
                <Link href="/login" className="text-xs font-bold text-teal-700 hover:text-teal-800">
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Registered Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full">
                Send Reset Instructions
              </Button>

              <div className="text-center pt-2">
                <Link href="/login" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
