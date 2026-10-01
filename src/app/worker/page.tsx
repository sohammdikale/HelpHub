"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPaiseToRupees, formatDistance } from "@/lib/utils";
import {
  Wrench,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Star,
  MapPin,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function WorkerDashboardPage() {
  const {
    currentUser,
    currentWorkerProfile,
    jobs,
    applications,
    wallet,
    conversations,
    updateJobStatus,
  } = useStore();

  const [isAvailable, setIsAvailable] = useState(currentWorkerProfile?.isAvailable ?? true);

  if (!currentUser || currentUser.role !== "worker") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-md shadow-card">
          <Wrench className="w-10 h-10 text-teal-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Worker Portal Access</h2>
          <p className="text-xs text-slate-500">
            You are currently logged in as a <strong>{currentUser?.role || "Guest"}</strong>. Switch your persona to Ramesh (Worker) using the role switcher at top right to view this dashboard.
          </p>
          <Link href="/login" className="inline-block text-xs font-bold text-teal-700 underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Worker metrics
  const myApplications = applications.filter((a) => a.workerId === currentUser.id);
  const myJobs = jobs.filter((j) => j.assignedWorkerIds.includes(currentUser.id));
  const activeJob = myJobs.find(
    (j) => j.status === "assigned" || j.status === "in_progress" || j.status === "awaiting_completion"
  );
  const completedJobsCount = myJobs.filter((j) => j.status === "completed").length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Worker Profile & Availability Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-teal-600/20">
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">{currentUser.fullName}</h1>
                {currentUser.isKycVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Worker
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    KYC Pending
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.city}, {currentUser.state}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {currentWorkerProfile?.ratingAverage || 4.8} ({currentWorkerProfile?.ratingCount || 42} reviews)
                </span>
                <span>Work Radius: {currentWorkerProfile?.workRadiusKm || 12} km</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Availability Toggle */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-700 pl-2">
                Status: {isAvailable ? "Available for Work" : "Offline"}
              </span>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  isAvailable ? "bg-teal-600 text-white" : "bg-slate-300 text-slate-700"
                }`}
              >
                {isAvailable ? "Online" : "Paused"}
              </button>
            </div>

            <Link
              href="/worker/wallet"
              className="inline-flex items-center gap-1.5 bg-indigo-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-900 transition-colors shadow-sm"
            >
              <Wallet className="w-4 h-4 text-teal-400" />
              <span>Wallet: {formatPaiseToRupees(wallet?.availableBalancePaise || 0)}</span>
            </Link>
          </div>
        </div>

        {/* KYC Verification Alert if not verified */}
        {!currentUser.isKycVerified && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  Complete Aadhaar or PAN Verification (Surepass)
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  Verified workers gain 4x more employer inquiries and unlock instant UPI withdrawals to bank accounts.
                </p>
              </div>
            </div>
            <Link
              href="/worker/kyc"
              className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl shrink-0 transition-colors"
            >
              Verify KYC Now &rarr;
            </Link>
          </div>
        )}

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Available Balance
            </span>
            <div className="text-xl font-black text-indigo-950">
              {formatPaiseToRupees(wallet?.availableBalancePaise || 0)}
            </div>
            <Link href="/worker/wallet" className="text-[11px] font-semibold text-teal-700 hover:underline block pt-1">
              Request UPI Payout &rarr;
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Earnings
            </span>
            <div className="text-xl font-black text-emerald-700">
              {formatPaiseToRupees(wallet?.totalEarnedPaise || 0)}
            </div>
            <span className="text-[11px] text-slate-400 block pt-1">Lifetime earned</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Completed Tasks
            </span>
            <div className="text-xl font-black text-slate-900">
              {completedJobsCount + (currentWorkerProfile?.completedJobsCount || 0)}
            </div>
            <span className="text-[11px] text-slate-400 block pt-1">100% completion rate</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Applications
            </span>
            <div className="text-xl font-black text-indigo-900">
              {myApplications.filter((a) => a.status === "pending" || a.status === "shortlisted").length}
            </div>
            <Link href="/worker/jobs" className="text-[11px] font-semibold text-teal-700 hover:underline block pt-1">
              View Status &rarr;
            </Link>
          </div>
        </div>

        {/* Current Active Assignment Card (if any) */}
        {activeJob && (
          <div className="bg-gradient-to-r from-indigo-950 to-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-elevated">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  Active Ongoing Job
                </span>
              </div>
              <Badge variant="teal">{activeJob.category}</Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">{activeJob.title}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Employer: <strong>{activeJob.employerName}</strong> &bull; Location: {activeJob.location.address}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span>Scheduled: {activeJob.workDate} at {activeJob.startTime}</span>
                  <span>Pay: {formatPaiseToRupees(activeJob.budgetPaise)}</span>
                  <span>Status: <strong className="text-teal-300 uppercase">{activeJob.status}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/worker/chat"
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat Employer
                </Link>

                {activeJob.status === "assigned" && (
                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() => updateJobStatus(activeJob.id, "in_progress")}
                  >
                    Start Task
                  </Button>
                )}

                {activeJob.status === "in_progress" && (
                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() => updateJobStatus(activeJob.id, "awaiting_completion")}
                  >
                    Mark as Done
                  </Button>
                )}

                {activeJob.status === "awaiting_completion" && (
                  <span className="text-xs text-teal-300 bg-teal-900/50 px-3 py-2 rounded-xl border border-teal-500/40">
                    Awaiting employer approval & pay release
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Hub & Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Recommended Jobs */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Recommended Jobs for You</h2>
              <Link href="/find-work" className="text-xs font-bold text-teal-700 hover:text-teal-800">
                Browse all &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {jobs
                .filter((j) => j.status === "open")
                .slice(0, 3)
                .map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-teal-500 transition-colors bg-slate-50/50"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{job.title}</span>
                        <Badge variant="default">{job.category}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span>{job.location.city}</span>
                        <span>Date: {job.workDate}</span>
                        <span className="font-bold text-indigo-950">
                          {formatPaiseToRupees(job.budgetPaise)}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/find-work?q=${encodeURIComponent(job.title)}`}
                      className="inline-flex items-center justify-center text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200"
                    >
                      View & Apply
                    </Link>
                  </div>
                ))}
            </div>
          </div>

          {/* Column 2: Worker Tools */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-3">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Worker Management
            </h2>
            <div className="space-y-2">
              <Link
                href="/worker/jobs"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-xs font-semibold text-slate-800"
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-teal-600" />
                  My Applications & Jobs
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/worker/wallet"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-xs font-semibold text-slate-800"
              >
                <span className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-teal-600" />
                  Earnings & UPI Withdrawals
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/worker/kyc"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-xs font-semibold text-slate-800"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Surepass KYC Verification
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/worker/chat"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-xs font-semibold text-slate-800"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-600" />
                  In-App Messages
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
