"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPaiseToRupees } from "@/lib/utils";
import {
  Shield,
  Users,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Search,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function AdminDashboardPage() {
  const {
    currentUser,
    users,
    jobs,
    disputes,
    transactions,
    resolveDispute,
    toggleUserSuspension,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"overview" | "disputes" | "users" | "jobs">("overview");

  // Dispute resolution modal state
  const [selectedDispute, setSelectedDispute] = useState<any | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolutionAction, setResolutionAction] = useState<"refund_employer" | "payout_worker">("refund_employer");

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-md shadow-card">
          <Shield className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Admin Portal Restricted</h2>
          <p className="text-xs text-slate-500">
            Access restricted to platform administrators. Switch persona to <strong>Vikram (Admin)</strong> using the role switcher at top right to inspect system controls.
          </p>
          <Link href="/login" className="inline-block text-xs font-bold text-amber-700 underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Real database metrics
  const totalUsers = users.length;
  const workerCount = users.filter((u) => u.role === "worker").length;
  const employerCount = users.filter((u) => u.role === "employer").length;
  const verifiedKycCount = users.filter((u) => u.isKycVerified).length;

  const openJobsCount = jobs.filter((j) => j.status === "open" || j.status === "applications_review").length;
  const activeJobsCount = jobs.filter((j) => j.status === "assigned" || j.status === "in_progress" || j.status === "awaiting_completion").length;
  const completedJobsCount = jobs.filter((j) => j.status === "completed").length;
  const disputedJobsCount = jobs.filter((j) => j.status === "disputed").length;

  const totalGrossVolumePaise = jobs
    .filter((j) => j.paymentStatus === "authorized" || j.paymentStatus === "released")
    .reduce((sum, j) => sum + j.budgetPaise, 0);

  const handleResolveDispute = () => {
    if (!selectedDispute) return;
    resolveDispute(selectedDispute.id, resolutionNotes, resolutionAction);
    setSelectedDispute(null);
    setResolutionNotes("");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">HelpHub Administration Center</h1>
                <Badge variant="warning">Super Admin</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Indian hyperlocal marketplace governance, dispute mediation, and audit logs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Strict Role Enforcement Active</span>
          </div>
        </div>

        {/* Global Marketplace KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Registered Users
            </span>
            <div className="text-2xl font-black text-slate-900">{totalUsers}</div>
            <span className="text-[10px] text-slate-500 block pt-1">
              {workerCount} Workers &bull; {employerCount} Employers
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              KYC Verified Users
            </span>
            <div className="text-2xl font-black text-emerald-700">{verifiedKycCount}</div>
            <span className="text-[10px] text-teal-700 font-semibold block pt-1">
              Surepass Aadhaar / PAN
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Platform Gross Volume
            </span>
            <div className="text-2xl font-black text-indigo-950">
              {formatPaiseToRupees(totalGrossVolumePaise)}
            </div>
            <span className="text-[10px] text-slate-400 block pt-1">Razorpay Ingestion</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Disputes Pending
            </span>
            <div className="text-2xl font-black text-rose-600">
              {disputes.filter((d) => d.status === "open").length}
            </div>
            <span className="text-[10px] text-rose-600 font-semibold block pt-1">
              Requires Admin Action
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 transition-colors ${
              activeTab === "overview"
                ? "border-b-2 border-amber-600 text-amber-700"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab("disputes")}
            className={`pb-3 transition-colors ${
              activeTab === "disputes"
                ? "border-b-2 border-amber-600 text-amber-700"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Dispute Resolution ({disputes.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-3 transition-colors ${
              activeTab === "users"
                ? "border-b-2 border-amber-600 text-amber-700"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            User Moderation ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`pb-3 transition-colors ${
              activeTab === "jobs"
                ? "border-b-2 border-amber-600 text-amber-700"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            All Listings ({jobs.length})
          </button>
        </div>

        {/* TAB 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
              <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Job Lifecycle Breakdown
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Open & Review:</span>
                  <strong className="text-slate-900">{openJobsCount}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Assigned & In-Progress:</span>
                  <strong className="text-teal-700">{activeJobsCount}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Completed & Settled:</span>
                  <strong className="text-emerald-700">{completedJobsCount}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Disputed:</span>
                  <strong className="text-rose-600">{disputedJobsCount}</strong>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
              <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Security & DPDP Compliance Summary
              </h2>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Raw Aadhaar Retention:</strong> Only masked credentials persisted.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Cryptographic Webhooks:</strong> HMAC-SHA256 signature verification active.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Integer Paise Math:</strong> Absolute protection against IEEE floating point drift.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: Disputes */}
        {activeTab === "disputes" && (
          <div className="space-y-4">
            {disputes.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-xs text-slate-500">
                No disputes on record. The marketplace is operating smoothly!
              </div>
            ) : (
              disputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{dispute.jobTitle}</span>
                      <Badge variant={dispute.status === "open" ? "danger" : "success"}>
                        {dispute.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>Reason:</strong> {dispute.reason}
                    </p>
                    <p className="text-xs text-slate-500 italic max-w-xl">
                      &quot;{dispute.description}&quot;
                    </p>
                    <div className="flex gap-4 text-[11px] text-slate-400 pt-1">
                      <span>Initiator: {dispute.initiatorName} ({dispute.initiatorRole})</span>
                      <span>Respondent: {dispute.respondentName}</span>
                    </div>
                  </div>

                  {dispute.status === "open" && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setSelectedDispute(dispute);
                        setResolutionNotes("");
                      }}
                    >
                      Adjudicate Dispute
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: User Moderation */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Registered Platform Users ({users.length})
              </h2>
            </div>
            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">KYC Status</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{u.fullName}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </td>
                      <td className="p-3 capitalize font-semibold">{u.role}</td>
                      <td className="p-3">{u.city}, {u.state}</td>
                      <td className="p-3">
                        {u.isKycVerified ? (
                          <Badge variant="success">VERIFIED</Badge>
                        ) : (
                          <Badge variant="warning">{u.kycStatus.toUpperCase()}</Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge variant={u.status === "active" ? "teal" : "danger"}>
                          {u.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        {u.role !== "admin" && (
                          <button
                            onClick={() => toggleUserSuspension(u.id)}
                            className={`text-xs font-bold px-3 py-1 rounded-lg border transition-colors ${
                              u.status === "active"
                                ? "text-rose-600 border-rose-200 hover:bg-rose-50"
                                : "text-teal-700 border-teal-200 hover:bg-teal-50"
                            }`}
                          >
                            {u.status === "active" ? "Suspend" : "Reinstate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: All Listings */}
        {activeTab === "jobs" && (
          <div className="space-y-3">
            {jobs.map((j) => (
              <div
                key={j.id}
                className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{j.title}</span>
                    <Badge variant="default">{j.status.toUpperCase()}</Badge>
                    <Badge variant="teal">{j.category}</Badge>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Employer: {j.employerName} &bull; Budget: {formatPaiseToRupees(j.budgetPaise)} &bull; {j.location.city}
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {j.assignedWorkerIds.length > 0 ? "Worker Assigned" : "Open for bids"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dispute Mediation Modal */}
      {selectedDispute && (
        <Modal
          isOpen={!!selectedDispute}
          onClose={() => setSelectedDispute(null)}
          title={`Adjudicate Dispute: ${selectedDispute.jobTitle}`}
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p><strong>Reason:</strong> {selectedDispute.reason}</p>
              <p className="text-slate-600 italic">&quot;{selectedDispute.description}&quot;</p>
              <p className="text-slate-400 pt-1">
                Employer: {selectedDispute.initiatorName} &bull; Worker: {selectedDispute.respondentName}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Administrative Resolution Action
              </label>
              <select
                value={resolutionAction}
                onChange={(e) => setResolutionAction(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="refund_employer">Cancel Job & Refund Escrow to Employer</option>
                <option value="payout_worker">Release Full Payment to Worker</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Resolution Rationale & Case Notes
              </label>
              <textarea
                rows={3}
                required
                placeholder="Document the finding and reason for this determination..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedDispute(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleResolveDispute}>
                Execute Determination
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
