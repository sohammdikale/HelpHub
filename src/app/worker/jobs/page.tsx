"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPaiseToRupees } from "@/lib/utils";
import {
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Play,
  CheckCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function WorkerJobsPage() {
  const {
    currentUser,
    jobs,
    applications,
    updateJobStatus,
    updateApplicationStatus,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"assigned" | "applications" | "completed">("assigned");

  if (!currentUser || currentUser.role !== "worker") {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Please log in or switch persona to a Worker to manage your jobs.
      </div>
    );
  }

  // Jobs where this worker is assigned
  const myAssignedJobs = jobs.filter(
    (j) =>
      j.assignedWorkerIds.includes(currentUser.id) &&
      (j.status === "assigned" || j.status === "in_progress" || j.status === "awaiting_completion" || j.status === "disputed")
  );

  // Completed jobs
  const myCompletedJobs = jobs.filter(
    (j) => j.assignedWorkerIds.includes(currentUser.id) && j.status === "completed"
  );

  // Applications
  const myApplications = applications.filter((a) => a.workerId === currentUser.id);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-teal-600" />
              My Work & Applications
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track your active assignments, bids, and completed task history.
            </p>
          </div>
          <Link
            href="/find-work"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            + Browse More Jobs
          </Link>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab("assigned")}
            className={`pb-3 transition-colors ${
              activeTab === "assigned"
                ? "border-b-2 border-teal-600 text-teal-700"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Active Assignments ({myAssignedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`pb-3 transition-colors ${
              activeTab === "applications"
                ? "border-b-2 border-teal-600 text-teal-700"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Applied & Offers ({myApplications.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-3 transition-colors ${
              activeTab === "completed"
                ? "border-b-2 border-teal-600 text-teal-700"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Completed Jobs ({myCompletedJobs.length})
          </button>
        </div>

        {/* TAB 1: Assigned Jobs */}
        {activeTab === "assigned" && (
          <div className="space-y-4">
            {myAssignedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-xs text-slate-500 space-y-2">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700">No active assignments right now.</p>
                <p>When an employer accepts your application, your task instructions appear here.</p>
              </div>
            ) : (
              myAssignedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="teal">{job.category}</Badge>
                      <Badge
                        variant={
                          job.status === "in_progress"
                            ? "warning"
                            : job.status === "awaiting_completion"
                            ? "success"
                            : "default"
                        }
                      >
                        {job.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                    <p className="text-xs text-slate-500 max-w-2xl">{job.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location.address}, {job.location.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {job.workDate} at {job.startTime}
                      </span>
                      <span className="font-bold text-indigo-950">
                        Pay: {formatPaiseToRupees(job.budgetPaise)}
                      </span>
                      <span>Employer: <strong>{job.employerName}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                    <Link
                      href="/worker/chat"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat Employer
                    </Link>

                    {job.status === "assigned" && (
                      <Button
                        size="sm"
                        variant="accent"
                        onClick={() => updateJobStatus(job.id, "in_progress")}
                      >
                        <Play className="w-3.5 h-3.5 mr-1" />
                        Start Job
                      </Button>
                    )}

                    {job.status === "in_progress" && (
                      <Button
                        size="sm"
                        variant="accent"
                        onClick={() => updateJobStatus(job.id, "awaiting_completion")}
                      >
                        <CheckCheck className="w-3.5 h-3.5 mr-1" />
                        Mark as Completed
                      </Button>
                    )}

                    {job.status === "awaiting_completion" && (
                      <span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl">
                        Pending Employer Approval
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Applications */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            {myApplications.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-xs text-slate-500 space-y-2">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700">You haven&apos;t submitted any job bids yet.</p>
                <Link href="/find-work" className="text-teal-700 underline font-semibold">
                  Browse open tasks nearby &rarr;
                </Link>
              </div>
            ) : (
              myApplications.map((app) => {
                const job = jobs.find((j) => j.id === app.jobId);
                return (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {job?.title || "Job Application"}
                        </h3>
                        <Badge
                          variant={
                            app.status === "accepted"
                              ? "success"
                              : app.status === "offered"
                              ? "teal"
                              : app.status === "shortlisted"
                              ? "warning"
                              : "default"
                          }
                        >
                          {app.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>
                          Your Proposed Bid:{" "}
                          <strong className="text-indigo-950 font-bold">
                            {formatPaiseToRupees(app.bidAmountPaise)}
                          </strong>
                        </span>
                        <span>Date: {app.createdAt.slice(0, 10)}</span>
                      </div>

                      {app.coverNote && (
                        <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg max-w-xl">
                          &quot;{app.coverNote}&quot;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {app.status === "offered" && (
                        <Button
                          size="sm"
                          variant="accent"
                          onClick={() => updateApplicationStatus(app.id, "accepted")}
                        >
                          Accept Offer
                        </Button>
                      )}

                      {app.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateApplicationStatus(app.id, "withdrawn")}
                        >
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: Completed Jobs */}
        {activeTab === "completed" && (
          <div className="space-y-4">
            {myCompletedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-xs text-slate-500 space-y-2">
                <CheckCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700">No completed jobs recorded yet.</p>
                <p>When you finish tasks and the employer releases payment, they appear in this ledger.</p>
              </div>
            ) : (
              myCompletedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle flex items-center justify-between"
                >
                  <div>
                    <Badge variant="success">COMPLETED</Badge>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{job.title}</h3>
                    <p className="text-xs text-slate-500">Employer: {job.employerName} &bull; {job.workDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-emerald-700 font-bold block">
                      +{formatPaiseToRupees(job.budgetPaise)}
                    </span>
                    <span className="text-[10px] text-slate-400">Credited to Wallet</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
