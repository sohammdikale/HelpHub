"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatPaiseToRupees, formatDistance, rupeesToPaise } from "@/lib/utils";
import { calculateHaversineDistanceKm } from "@/lib/location/distance";
import { APPROVED_CATEGORIES, Job } from "@/types";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Wrench,
  Sparkles,
  SlidersHorizontal,
  CheckCircle,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function FindWorkPage() {
  const { jobs, currentUser, currentWorkerProfile, applyForJob, applications } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxDistanceKm, setMaxDistanceKm] = useState(25);
  const [minBudgetRupees, setMinBudgetRupees] = useState(0);

  // Application Modal state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [bidAmountRupees, setBidAmountRupees] = useState<number>(0);
  const [coverNote, setCoverNote] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");

  // Worker coordinates (default to Central Delhi if profile not available)
  const workerLat = currentWorkerProfile?.location?.lat || 28.6139;
  const workerLng = currentWorkerProfile?.location?.lng || 77.2090;

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    // Only open or applications_review jobs
    if (job.status !== "open" && job.status !== "applications_review") return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = job.title.toLowerCase().includes(q);
      const matchesDesc = job.description.toLowerCase().includes(q);
      const matchesSkill = job.skillsRequired.some((s) => s.toLowerCase().includes(q));
      if (!matchesTitle && !matchesDesc && !matchesSkill) return false;
    }

    // Category
    if (selectedCategory !== "All" && job.category !== selectedCategory) {
      return false;
    }

    // Budget
    const jobBudgetRupees = job.budgetPaise / 100;
    if (minBudgetRupees > 0 && jobBudgetRupees < minBudgetRupees) {
      return false;
    }

    // Distance
    const distanceKm = calculateHaversineDistanceKm(
      workerLat,
      workerLng,
      job.location.approxLat,
      job.location.approxLng
    );
    if (distanceKm > maxDistanceKm) {
      return false;
    }

    return true;
  });

  const handleOpenApplyModal = (job: Job) => {
    setSelectedJob(job);
    setBidAmountRupees(job.budgetPaise / 100);
    setCoverNote("");
    setApplyError("");
    setApplySuccess(false);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!currentUser) {
      setApplyError("Please log in to apply for jobs.");
      return;
    }

    if (currentUser.role !== "worker") {
      setApplyError("Only worker accounts can apply for tasks. Switch persona to a worker.");
      return;
    }

    if (bidAmountRupees <= 0) {
      setApplyError("Please enter a valid bid amount.");
      return;
    }

    const success = applyForJob(
      selectedJob.id,
      rupeesToPaise(bidAmountRupees),
      coverNote.trim()
    );

    if (success) {
      setApplySuccess(true);
      setTimeout(() => {
        setSelectedJob(null);
        setApplySuccess(false);
      }, 1800);
    } else {
      setApplyError("You have already applied for this task or your account cannot submit applications.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Wrench className="w-6 h-6 text-teal-600" />
              Find Work Nearby
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Explore local micro-jobs in your neighborhood. Guaranteed payments, verified employers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Your Location: <strong className="text-slate-900">{currentWorkerProfile?.location?.city || "New Delhi"}</strong>
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by skill, title, or task (e.g. tap, wiring)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
              />
            </div>

            {/* Category Dropdown */}
            <div className="sm:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-slate-700 cursor-pointer"
              >
                <option value="All">All Categories (14)</option>
                {APPROVED_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Budget */}
            <div className="sm:col-span-3">
              <select
                value={minBudgetRupees}
                onChange={(e) => setMinBudgetRupees(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-slate-700 cursor-pointer"
              >
                <option value={0}>Any Budget</option>
                <option value={300}>Min ₹300</option>
                <option value={500}>Min ₹500</option>
                <option value={1000}>Min ₹1,000</option>
                <option value={2000}>Min ₹2,000</option>
              </select>
            </div>
          </div>

          {/* Distance Slider */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
              <span>Search Radius:</span>
              <strong className="text-slate-900">{maxDistanceKm} km</strong>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="w-48 accent-teal-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing {filteredJobs.length} active opportunities</span>
            <span>Sorted by closest distance</span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No matching jobs found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your distance radius or selecting &quot;All Categories&quot; to see more micro-jobs in nearby neighborhoods.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setMaxDistanceKm(50);
                  setMinBudgetRupees(0);
                }}
                className="mt-2 text-xs font-bold text-teal-700 hover:text-teal-800"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job) => {
                const distanceKm = calculateHaversineDistanceKm(
                  workerLat,
                  workerLng,
                  job.location.approxLat,
                  job.location.approxLng
                );

                const hasApplied = applications.some(
                  (a) => a.jobId === job.id && a.workerId === currentUser?.id
                );

                return (
                  <div
                    key={job.id}
                    className="flex flex-col justify-between rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle hover:shadow-card hover:border-teal-500 transition-all"
                  >
                    <div className="space-y-3">
                      {/* Top Meta */}
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="teal">{job.category}</Badge>
                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-teal-600" />
                          {formatDistance(distanceKm)} away
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      </div>

                      {/* Required Skills */}
                      <div className="flex flex-wrap gap-1">
                        {job.skillsRequired.map((skill) => (
                          <span
                            key={skill}
                            className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Schedule details */}
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {job.workDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {job.startTime} ({job.estimatedDurationHours}h)
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Budget ({job.budgetType})
                        </span>
                        <span className="text-base font-black text-indigo-950">
                          {formatPaiseToRupees(job.budgetPaise)}
                        </span>
                      </div>

                      {hasApplied ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Applied
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="accent"
                          onClick={() => handleOpenApplyModal(job)}
                        >
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <Modal
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          title={`Apply for: ${selectedJob.title}`}
        >
          {applySuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Application Submitted!</h4>
              <p className="text-xs text-slate-500">
                The employer ({selectedJob.employerName}) has been notified. Check your dashboard for updates.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p>
                  <strong>Offered Budget:</strong> {formatPaiseToRupees(selectedJob.budgetPaise)} ({selectedJob.budgetType})
                </p>
                <p className="text-slate-500">
                  <strong>Location:</strong> {selectedJob.location.address}, {selectedJob.location.city}
                </p>
              </div>

              {applyError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{applyError}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Your Bid Amount (₹ Rupees)
                </label>
                <input
                  type="number"
                  min={50}
                  step={10}
                  required
                  value={bidAmountRupees}
                  onChange={(e) => setBidAmountRupees(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  You can accept the employer&apos;s budget or propose your rate.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Short Note / Experience (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. I have 5 years experience with Jaguar fittings. I can bring my own tools."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedJob(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="accent" size="sm">
                  Confirm Application
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
