"use client";

import React, { useState } from "react";
import Link from "next/link";
import { APPROVED_CATEGORIES, JobCategory } from "@/types";
import {
  Wrench,
  Search,
  Sparkles,
  ShieldCheck,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { INITIAL_WORKER_PROFILES } from "@/lib/firebase/mockStore";

export default function FindServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredCategories = APPROVED_CATEGORIES.filter((cat) => {
    if (selectedCategory !== "All" && cat !== selectedCategory) return false;
    if (searchQuery && !cat.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-950">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Local Services Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Find Trusted Local Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Hire nearby verified workers for daily household tasks, urgent repairs, and maintenance. Upfront rates and escrow protection.
          </p>
        </div>

        {/* Filter & Search */}
        <div className="max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search category (e.g. Plumbing, Cleaning, Electrician)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle hover:shadow-card hover:border-teal-500 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                    Verified Trade
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{category}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Connect with nearby vetted {category.toLowerCase()} specialists for residential and commercial assistance.
                </p>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md font-medium">
                    <CheckCircle className="w-3 h-3 text-teal-600" /> Aadhaar KYC
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md font-medium">
                    <CheckCircle className="w-3 h-3 text-teal-600" /> Escrow Pay
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/employer/jobs/new?cat=${encodeURIComponent(category)}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-950 hover:text-indigo-800"
                >
                  Hire in this category &rarr;
                </Link>
                <Link
                  href={`/find-work?cat=${encodeURIComponent(category)}`}
                  className="text-xs text-slate-400 hover:text-teal-600"
                >
                  View Tasks
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Verified Worker Profile Showcase */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Featured Verified Workers</h2>
              <p className="text-xs text-slate-500">
                Independent professionals in Delhi NCR with verified identity and high community ratings.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Identity Verified (Surepass)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_WORKER_PROFILES.map((worker) => (
              <div
                key={worker.userId}
                className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {worker.fullName.charAt(0)}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                      {worker.fullName}
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </h4>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {worker.ratingAverage} ({worker.ratingCount})
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">{worker.bio}</p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {worker.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-white border border-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      Rate: ₹{(worker.hourlyRatePaise / 100).toFixed(0)}/hr
                    </span>
                    <Link
                      href={`/employer/jobs/new?worker=${worker.userId}`}
                      className="text-xs font-bold text-teal-700 hover:text-teal-800"
                    >
                      Request Services &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
