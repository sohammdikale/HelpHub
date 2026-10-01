import Link from "react";
import LinkComponent from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-md shadow-card">
        <div className="w-12 h-12 rounded-2xl bg-indigo-950 text-white flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-6 h-6 text-teal-400" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">404 — Page Not Found</h1>
        <p className="text-xs text-slate-500">
          The requested page could not be located on HelpHub.
        </p>
        <LinkComponent
          href="/"
          className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return to HelpHub Home
        </LinkComponent>
      </div>
    </div>
  );
}
