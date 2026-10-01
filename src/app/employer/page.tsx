"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPaiseToRupees } from "@/lib/utils";
import {
  Briefcase,
  Plus,
  Users,
  CheckCircle,
  CreditCard,
  MessageSquare,
  AlertTriangle,
  Star,
  ShieldCheck,
  Check,
  X,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function EmployerDashboardPage() {
  const {
    currentUser,
    jobs,
    applications,
    updateApplicationStatus,
    fundJob,
    completeJobAndReleaseFunds,
    createDispute,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"listings" | "candidates">("listings");

  // Payment Modal state
  const [paymentModalJob, setPaymentModalJob] = useState<any | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dispute Modal state
  const [disputeModalJob, setDisputeModalJob] = useState<any | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeDescription, setDisputeDescription] = useState("");
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  // Review Modal state
  const [reviewModalJob, setReviewModalJob] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!currentUser || currentUser.role !== "employer") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-md shadow-card">
          <Briefcase className="w-10 h-10 text-indigo-950 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Employer Portal Access</h2>
          <p className="text-xs text-slate-500">
            You are currently logged in as a <strong>{currentUser?.role || "Guest"}</strong>. Switch your persona to Priya (Employer) using the role switcher at top right to view this dashboard.
          </p>
          <Link href="/login" className="inline-block text-xs font-bold text-teal-700 underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Filter jobs posted by this employer (or all demo jobs if viewing as demo Priya)
  const myJobs = jobs.filter((j) => j.employerId === currentUser.id || j.employerName === currentUser.fullName);
  const allApplicationsForMyJobs = applications.filter((a) =>
    myJobs.some((j) => j.id === a.jobId)
  );

  // Handle simulated Razorpay escrow pre-authorization
  const handleAuthorizePayment = async (job: any) => {
    setIsProcessingPayment(true);
    try {
      // Step 1: Call server to create order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          employerId: currentUser.id,
          amountPaise: job.budgetPaise,
        }),
      });
      const orderData = await orderRes.json();

      // Step 2: Call verification endpoint with simulated signature
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          orderId: orderData.orderId,
          paymentId: `pay_sbx_${Date.now()}`,
          signature: `sbx_sig_${orderData.orderId}`,
        }),
      });
      const verifyData = await verifyRes.json();

      setIsProcessingPayment(false);
      if (verifyData.success) {
        fundJob(job.id, verifyData.paymentId, verifyData.orderId);
        setPaymentSuccess(true);
        setTimeout(() => {
          setPaymentModalJob(null);
          setPaymentSuccess(false);
        }, 1800);
      }
    } catch {
      setIsProcessingPayment(false);
    }
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeModalJob || !disputeReason) return;
    createDispute(disputeModalJob.id, disputeReason, disputeDescription);
    setDisputeSubmitted(true);
    setTimeout(() => {
      setDisputeModalJob(null);
      setDisputeSubmitted(false);
    }, 1800);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewModalJob(null);
      setReviewSubmitted(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 text-white flex items-center justify-center text-lg font-bold">
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">{currentUser.fullName}</h1>
                <Badge variant="teal">Verified Employer</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.city} &bull; {myJobs.length} Micro-jobs posted
              </p>
            </div>
          </div>

          <Link
            href="/employer/jobs/new"
            className="inline-flex items-center gap-1.5 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            Post New Job (with AI)
          </Link>
        </div>

        {/* Quick KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Posted Jobs
            </span>
            <div className="text-2xl font-black text-slate-900">{myJobs.length}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active In-Progress
            </span>
            <div className="text-2xl font-black text-teal-700">
              {myJobs.filter((j) => j.status === "in_progress" || j.status === "assigned" || j.status === "awaiting_completion").length}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Applications to Review
            </span>
            <div className="text-2xl font-black text-amber-600">
              {allApplicationsForMyJobs.filter((a) => a.status === "pending" || a.status === "shortlisted").length}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Completed Tasks
            </span>
            <div className="text-2xl font-black text-emerald-700">
              {myJobs.filter((j) => j.status === "completed").length}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab("listings")}
            className={`pb-3 transition-colors ${
              activeTab === "listings"
                ? "border-b-2 border-indigo-950 text-indigo-950"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            My Job Listings ({myJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("candidates")}
            className={`pb-3 transition-colors ${
              activeTab === "candidates"
                ? "border-b-2 border-indigo-950 text-indigo-950"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Candidate Applications ({allApplicationsForMyJobs.length})
          </button>
        </div>

        {/* TAB 1: Job Listings */}
        {activeTab === "listings" && (
          <div className="space-y-4">
            {myJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-xs text-slate-500 space-y-3">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700">No jobs posted yet</h3>
                <p>Post your first task using our AI categorization engine to find nearby workers.</p>
                <Link
                  href="/employer/jobs/new"
                  className="inline-block text-xs font-bold text-white bg-indigo-950 px-4 py-2 rounded-xl"
                >
                  Post a Job &rarr;
                </Link>
              </div>
            ) : (
              myJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="teal">{job.category}</Badge>
                      <Badge
                        variant={
                          job.status === "completed"
                            ? "success"
                            : job.status === "awaiting_completion"
                            ? "warning"
                            : job.status === "disputed"
                            ? "danger"
                            : "default"
                        }
                      >
                        {job.status.replace("_", " ").toUpperCase()}
                      </Badge>
                      {job.paymentStatus === "authorized" && (
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Escrow Locked
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                    <p className="text-xs text-slate-500 max-w-2xl">{job.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>Location: {job.location.address}</span>
                      <span>Date: {job.workDate} at {job.startTime}</span>
                      <span className="font-bold text-indigo-950">
                        Budget: {formatPaiseToRupees(job.budgetPaise)}
                      </span>
                    </div>
                  </div>

                  {/* Actions based on Job Lifecycle State */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                    <Link
                      href="/employer/chat"
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat
                    </Link>

                    {/* Pre-authorize Escrow Payment */}
                    {job.paymentStatus === "unpaid" && job.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setPaymentModalJob(job)}
                      >
                        <CreditCard className="w-3.5 h-3.5 mr-1" />
                        Authorize Escrow Pay
                      </Button>
                    )}

                    {/* Confirm Completion */}
                    {(job.status === "awaiting_completion" || job.status === "in_progress") && (
                      <Button
                        size="sm"
                        variant="accent"
                        onClick={() => completeJobAndReleaseFunds(job.id)}
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Confirm & Release Pay
                      </Button>
                    )}

                    {/* Rate & Review after completion */}
                    {job.status === "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReviewModalJob(job)}
                      >
                        <Star className="w-3.5 h-3.5 mr-1 text-amber-500 fill-amber-500" />
                        Rate Worker
                      </Button>
                    )}

                    {/* Dispute option */}
                    {job.status !== "completed" && job.status !== "disputed" && (
                      <button
                        onClick={() => setDisputeModalJob(job)}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 px-2 py-1"
                      >
                        Raise Dispute
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Candidate Applications */}
        {activeTab === "candidates" && (
          <div className="space-y-4">
            {allApplicationsForMyJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-xs text-slate-500 space-y-2">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700">No applications received yet.</p>
                <p>Nearby workers will review your listings and submit their bids.</p>
              </div>
            ) : (
              allApplicationsForMyJobs.map((app) => {
                const job = myJobs.find((j) => j.id === app.jobId);
                return (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{app.workerName}</h4>
                        {app.workerKycVerified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" />
                            KYC Verified
                          </span>
                        )}
                        <span className="text-xs text-amber-600 font-bold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-500" />
                          {app.workerRating}
                        </span>
                        <Badge variant="default">{app.status.toUpperCase()}</Badge>
                      </div>

                      <p className="text-xs text-slate-500">
                        Applied for: <strong>{job?.title || "Task"}</strong>
                      </p>

                      <div className="flex items-center gap-4 text-xs">
                        <span>
                          Bid Amount:{" "}
                          <strong className="text-indigo-950 font-bold">
                            {formatPaiseToRupees(app.bidAmountPaise)}
                          </strong>
                        </span>
                        <span className="text-slate-400">Date: {app.createdAt.slice(0, 10)}</span>
                      </div>

                      {app.coverNote && (
                        <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg max-w-xl">
                          &quot;{app.coverNote}&quot;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {app.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => updateApplicationStatus(app.id, "shortlisted")}
                          >
                            Shortlist
                          </Button>
                          <Button
                            size="sm"
                            variant="accent"
                            onClick={() => updateApplicationStatus(app.id, "accepted")}
                          >
                            <Check className="w-3.5 h-3.5 mr-1" />
                            Accept & Assign
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateApplicationStatus(app.id, "rejected")}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      )}

                      {app.status === "shortlisted" && (
                        <Button
                          size="sm"
                          variant="accent"
                          onClick={() => updateApplicationStatus(app.id, "accepted")}
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Accept & Assign
                        </Button>
                      )}

                      {app.status === "accepted" && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          Assigned to Job
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Razorpay Escrow Modal */}
      {paymentModalJob && (
        <Modal
          isOpen={!!paymentModalJob}
          onClose={() => setPaymentModalJob(null)}
          title="Pre-Authorize Escrow Payment (Razorpay)"
        >
          {paymentSuccess ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">Payment Authorized in Escrow!</h4>
              <p className="text-xs text-slate-500">
                Amount ({formatPaiseToRupees(paymentModalJob.budgetPaise)}) is held securely. It will be released when you approve task completion.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Task:</span>
                  <strong className="text-slate-900">{paymentModalJob.title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount to Lock:</span>
                  <span className="text-base font-black text-indigo-950">
                    {formatPaiseToRupees(paymentModalJob.budgetPaise)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>Payment Gateway:</span>
                  <span className="font-semibold text-teal-700">Razorpay (Test / Sandbox Mode)</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                By pre-authorizing, your payment is safely held until the worker finishes the task and you click &quot;Confirm & Release Pay&quot;.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setPaymentModalJob(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isProcessingPayment}
                  onClick={() => handleAuthorizePayment(paymentModalJob)}
                >
                  Confirm Escrow Lock ({formatPaiseToRupees(paymentModalJob.budgetPaise)})
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Dispute Modal */}
      {disputeModalJob && (
        <Modal
          isOpen={!!disputeModalJob}
          onClose={() => setDisputeModalJob(null)}
          title={`Raise Dispute: ${disputeModalJob.title}`}
        >
          {disputeSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle className="w-12 h-12 text-rose-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">Dispute Escalated</h4>
              <p className="text-xs text-slate-500">
                A HelpHub administrator has been notified. Funds remain frozen in escrow pending mediation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleDisputeSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Dispute *</label>
                <select
                  required
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="">Select a reason</option>
                  <option value="Worker did not show up">Worker did not show up</option>
                  <option value="Work left incomplete">Work left incomplete</option>
                  <option value="Unsatisfactory quality / damage">Unsatisfactory quality / damage</option>
                  <option value="Pricing / scope disagreement">Pricing / scope disagreement</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Explanation</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the situation in detail for platform admin review..."
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setDisputeModalJob(null)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" type="submit">
                  Escalate Dispute
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* Review Modal */}
      {reviewModalJob && (
        <Modal
          isOpen={!!reviewModalJob}
          onClose={() => setReviewModalJob(null)}
          title={`Rate Worker: ${reviewModalJob.title}`}
        >
          {reviewSubmitted ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">Review Submitted</h4>
              <p className="text-xs text-slate-500">Thank you for rating your service experience!</p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Select Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-2 rounded-xl border border-slate-200 hover:border-amber-400"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Written Feedback</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Ramesh was very professional, replaced the tap quickly and cleaned up after work."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setReviewModalJob(null)}>
                  Cancel
                </Button>
                <Button variant="accent" size="sm" type="submit">
                  Publish Review
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
