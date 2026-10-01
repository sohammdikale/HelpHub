import React from "react";
import { Sparkles, Users, Target, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            About HelpHub
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Find Help Nearby 🇮🇳
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Empowering India&apos;s skilled and semi-skilled workers through transparent hyperlocal connections and dignified, fast earnings.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Our Mission</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In urban and semi-urban India, millions of households struggle daily to find reliable electricians, plumbers, painters, cleaners, and helpers within a 5-kilometer radius. Concurrently, thousands of hardworking technicians, tradespeople, and daily-wage earners search for dignified, predictable local income.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            HelpHub eliminates middlemen agencies and exorbitant contractor fees. We offer an open, peer-to-peer marketplace with AI-assisted categorization, fair pricing standards, and instant UPI withdrawals directly to workers&apos; bank accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-2">
            <Target className="w-6 h-6 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Hyperlocal Focus</h3>
            <p className="text-xs text-slate-500">
              Connecting participants within a tight 1 to 25 km radius to reduce travel time and carbon footprint.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-2">
            <ShieldCheck className="w-6 h-6 text-indigo-950" />
            <h3 className="text-sm font-bold text-slate-900">Verified Trust</h3>
            <p className="text-xs text-slate-500">
              Surepass Aadhaar/PAN authentication paired with genuine customer reviews and mutual escrow payments.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-2">
            <Heart className="w-6 h-6 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">Worker Dignity</h3>
            <p className="text-xs text-slate-500">
              Zero commission cuts on everyday micro-jobs, enabling workers to keep 100% of their agreed wage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
