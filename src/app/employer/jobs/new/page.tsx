"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { APPROVED_CATEGORIES, JobCategory, JobPostSchema } from "@/types";
import { rupeesToPaise } from "@/lib/utils";
import { INDIAN_CITIES_COORDINATES } from "@/lib/location/distance";
import {
  Briefcase,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  AlertCircle,
  CheckCircle2,
  Wrench,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PostNewJobPage() {
  const router = useRouter();
  const { currentUser, postJob } = useStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Plumbing" as JobCategory,
    skillsRequired: ["Pipe Fitting", "Tap Repair"],
    budgetAmountRupees: 500,
    budgetType: "fixed" as "fixed" | "hourly",
    workersNeeded: 1,
    workDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), // tomorrow
    startTime: "10:00",
    estimatedDurationHours: 2,
    specialInstructions: "",
    address: "Block C, Connaught Place",
    city: "New Delhi",
    pincode: "110001",
  });

  const [newSkillInput, setNewSkillInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trigger Gemini AI Categorization
  const handleAiCategorize = async () => {
    if (!formData.title && !formData.description) {
      setAiMessage("Please enter a title or description first.");
      return;
    }

    setIsAiLoading(true);
    setAiMessage("");

    try {
      const res = await fetch("/api/ai/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
        }),
      });

      const data = await res.json();
      setIsAiLoading(false);

      if (res.ok && data.category) {
        setFormData((prev) => ({
          ...prev,
          category: data.category as JobCategory,
          skillsRequired: Array.isArray(data.skills) && data.skills.length > 0 ? data.skills : prev.skillsRequired,
          budgetAmountRupees: Math.round(data.suggestedBudgetMinPaise / 100),
        }));
        setAiMessage(
          `AI Identified: "${data.category}" (Confidence: ${Math.round(data.confidence * 100)}% via ${data.source === "gemini" ? "Google Gemini" : "Marketplace Heuristics"}). Skills and wage bounds updated.`
        );
      }
    } catch {
      setIsAiLoading(false);
      setAiMessage("Failed to reach AI service. You can select category manually.");
    }
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !formData.skillsRequired.includes(newSkillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, newSkillInput.trim()],
      }));
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const cityCoords = INDIAN_CITIES_COORDINATES[formData.city] || {
      lat: 28.6139,
      lng: 77.2090,
    };

    const validation = JobPostSchema.safeParse({
      ...formData,
      approxLat: cityCoords.lat,
      approxLng: cityCoords.lng,
    });

    if (!validation.success) {
      setIsSubmitting(false);
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
      postJob({
        employerId: currentUser?.id || "usr_employer_1",
        employerName: currentUser?.fullName || "Priya Sundaram",
        employerRating: 4.9,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        skillsRequired: formData.skillsRequired,
        budgetPaise: rupeesToPaise(formData.budgetAmountRupees),
        budgetType: formData.budgetType,
        workersNeeded: formData.workersNeeded,
        workDate: formData.workDate,
        startTime: formData.startTime,
        estimatedDurationHours: formData.estimatedDurationHours,
        specialInstructions: formData.specialInstructions,
        location: {
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          approxLat: cityCoords.lat,
          approxLng: cityCoords.lng,
        },
      });

      setIsSubmitting(false);
      router.push("/employer");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-950" />
              Post a New Micro-Job
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Connect with nearby verified workers in your locality.
            </p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            AI Enabled
          </span>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Task Headline / Job Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kitchen Mixer Tap Leakage Repair"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
              />
              {errors.title && <p className="text-[10px] text-rose-600 mt-0.5">{errors.title}</p>}
            </div>

            {/* Description & AI Assistant */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Detailed Description *</label>
                <button
                  type="button"
                  onClick={handleAiCategorize}
                  disabled={isAiLoading}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Bot className="w-3.5 h-3.5" />
                  {isAiLoading ? "AI Analyzing..." : "AI Auto-Categorize"}
                </button>
              </div>

              <textarea
                rows={4}
                required
                placeholder="Describe what needs to be done, specific appliances, tools available, or special instructions..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
              />
              {errors.description && <p className="text-[10px] text-rose-600 mt-0.5">{errors.description}</p>}

              {aiMessage && (
                <div className="mt-2 p-2.5 rounded-xl bg-teal-50/80 border border-teal-200 text-teal-900 text-xs flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{aiMessage}</span>
                </div>
              )}
            </div>

            {/* Category & Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Approved Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as JobCategory })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  {APPROVED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Workers Needed
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.workersNeeded}
                  onChange={(e) => setFormData({ ...formData, workersNeeded: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Skills Tag Management */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Required Skills / Tags
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-600 text-xs font-bold ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Geyser Repair)"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddSkill}>
                  Add Skill
                </Button>
              </div>
              {errors.skillsRequired && <p className="text-[10px] text-rose-600 mt-0.5">{errors.skillsRequired}</p>}
            </div>

            {/* Budget & Payment Terms */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Budget (₹ Rupees) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    min={50}
                    step={25}
                    required
                    value={formData.budgetAmountRupees}
                    onChange={(e) => setFormData({ ...formData, budgetAmountRupees: Number(e.target.value) })}
                    className="w-full pl-7 pr-3 py-2 text-sm font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
                {errors.budgetAmountRupees && (
                  <p className="text-[10px] text-rose-600 mt-0.5">{errors.budgetAmountRupees}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Rate Type
                </label>
                <select
                  value={formData.budgetType}
                  onChange={(e) => setFormData({ ...formData, budgetType: e.target.value as "fixed" | "hourly" })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Est. Duration (Hours)
                </label>
                <input
                  type="number"
                  min={0.5}
                  max={24}
                  step={0.5}
                  value={formData.estimatedDurationHours}
                  onChange={(e) => setFormData({ ...formData, estimatedDurationHours: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
              </div>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Work Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.workDate}
                  onChange={(e) => setFormData({ ...formData, workDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.workDate && <p className="text-[10px] text-rose-600 mt-0.5">{errors.workDate}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Start Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.startTime && <p className="text-[10px] text-rose-600 mt-0.5">{errors.startTime}</p>}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Task Location
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-500 block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.address && <p className="text-[10px] text-rose-600 mt-0.5">{errors.address}</p>}
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    {Object.keys(INDIAN_CITIES_COORDINATES).map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Please bring pipe wrench and teflon tape. Ring bell on arrival."
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full">
              Publish Micro-Job Listing
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
