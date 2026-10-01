import React from "react";
import { HeartHandshake, Shield, AlertCircle } from "lucide-react";

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/80 shadow-subtle space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div className="border-b border-slate-200 pb-4 space-y-1">
          <div className="flex items-center gap-1.5 text-teal-600 font-bold text-xs uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Community Standards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Community Guidelines
          </h1>
          <p className="text-xs text-slate-400">Respect, Dignity & Fair Play for India&apos;s Workforce</p>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Mutual Respect & Dignity</h2>
          <p>
            Every participant—whether a household employer, small business owner, electrician, plumber, or cleaning helper—deserves courtesy, dignity, and fair treatment. Discrimination based on caste, religion, gender, region, or language is strictly prohibited and results in immediate account suspension.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Fair Pay & Safe Working Environments</h2>
          <p>
            Employers must provide safe working conditions, access to water and necessary utilities, and adhere to agreed budgets without arbitrary post-work deductions. Workers must execute tasks diligently, punctually, and notify employers immediately of unforeseen complications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Honest Feedback & Dispute Cooperation</h2>
          <p>
            Star ratings and reviews must reflect genuine first-hand experiences. Retaliatory or abusive reviews will be removed by platform moderators upon investigation. In the event of a dispute, both parties agree to communicate respectfully and provide accurate photographic evidence.
          </p>
        </section>
      </div>
    </div>
  );
}
