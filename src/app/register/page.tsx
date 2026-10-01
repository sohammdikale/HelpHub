"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { RegisterSchema } from "@/types";
import {
  Sparkles,
  Wrench,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useStore();

  const [role, setRole] = useState<"worker" | "employer">("worker");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    preferredLanguage: "en",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    termsAccepted: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const validation = RegisterSchema.safeParse({
      ...formData,
      role,
    });

    if (!validation.success) {
      setIsLoading(false);
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setTimeout(() => {
      const success = register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role,
        preferredLanguage: formData.preferredLanguage,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      });

      setIsLoading(false);
      if (success) {
        if (role === "worker") router.push("/worker");
        else router.push("/employer");
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950 text-white shadow-md">
              <Sparkles className="h-5 w-5 text-teal-400" />
            </div>
            <span className="text-2xl font-black text-indigo-950 tracking-tight">
              Help<span className="text-teal-600">Hub</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Create Your Account</h1>
          <p className="text-xs text-slate-500">Join India&apos;s hyperlocal micro-job and services network</p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-card space-y-5">
          {/* Role Selector Tabs */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Select Your Role on HelpHub:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("worker")}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  role === "worker"
                    ? "border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className={`p-2 rounded-lg ${role === "worker" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Worker</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Find jobs, earn daily, withdraw via UPI</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("employer")}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  role === "employer"
                    ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className={`p-2 rounded-lg ${role === "employer" ? "bg-indigo-950 text-white" : "bg-slate-100 text-slate-600"}`}>
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Employer</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Post micro-jobs, hire nearby help</div>
                </div>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">
              * Note: Administrative and Accounting accounts cannot be self-registered and require super-admin assignment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                {errors.fullName && <p className="text-[10px] text-rose-600 mt-0.5">{errors.fullName}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone (10 digits)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    placeholder="9876543210"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                {errors.phoneNumber && <p className="text-[10px] text-rose-600 mt-0.5">{errors.phoneNumber}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="ramesh@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                {errors.email && <p className="text-[10px] text-rose-600 mt-0.5">{errors.email}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                {errors.password && <p className="text-[10px] text-rose-600 mt-0.5">{errors.password}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="New Delhi"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  placeholder="Delhi"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">PIN Code (6 digits)</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  placeholder="110001"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.pincode && <p className="text-[10px] text-rose-600 mt-0.5">{errors.pincode}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Language</label>
              <select
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="mt-0.5 accent-teal-600 rounded"
              />
              <label htmlFor="termsAccepted" className="text-[11px] text-slate-600 leading-normal">
                I agree to the{" "}
                <Link href="/terms" className="text-teal-700 underline font-semibold">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-teal-700 underline font-semibold">
                  Privacy Policy
                </Link>
                , and consent to identity authentication under the DPDP Act.
              </label>
            </div>
            {errors.termsAccepted && <p className="text-[10px] text-rose-600">{errors.termsAccepted}</p>}

            <Button type="submit" variant="accent" size="md" isLoading={isLoading} className="w-full">
              Complete Registration ({role === "worker" ? "Worker" : "Employer"})
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-indigo-950 hover:text-indigo-800">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
