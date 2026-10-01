import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Heart, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-slate-950 font-black">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Help<span className="text-teal-400">Hun</span>
              </span>
            </Link>
            <p className="text-sm font-semibold text-teal-400">
              Find Help Nearby. 🇮🇳
            </p>
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              HelpHun is India&apos;s trusted hyperlocal micro-job and everyday services marketplace.
              Connecting everyday households and small businesses with verified, skilled, and semi-skilled local workers.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Serving Delhi NCR, Bengaluru, Mumbai, Pune, Hyderabad & more</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Marketplace</h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/find-work" className="hover:text-teal-400 transition-colors">
                  Find Work Nearby
                </Link>
              </li>
              <li>
                <Link href="/find-services" className="hover:text-teal-400 transition-colors">
                  Hire Local Workers
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-teal-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-teal-400 transition-colors">
                  Worker KYC & Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Support & Info</h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-teal-400 transition-colors">
                  About HelpHun
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-teal-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-teal-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal & Compliance</h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-teal-400 transition-colors">
                  Privacy Policy (DPDP)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-teal-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/community-guidelines" className="hover:text-teal-400 transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-teal-400 transition-colors">
                  Trust & Verification Notice
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Trust Disclaimer required by Prompt */}
        <div className="mt-8 rounded-xl bg-slate-800/80 p-4 border border-slate-700/60 text-[11px] text-slate-400 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300">Identity Verification Disclaimer:</strong> HelpHun integrates
              licensed third-party verification providers (Surepass) for Aadhaar and PAN authentication.
              Identity verification confirms government-registered records and masks sensitive identifiers under the
              Digital Personal Data Protection (DPDP) Act, 2023. Identity verification does not constitute an endorsement,
              guarantee of trustworthiness, or certification of quality of workmanship. All users are encouraged to
              review ratings, clarify job requirements upfront, and adhere to community standards.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 pt-6 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} HelpHun Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for India&apos;s hardworking workforce.
          </p>
        </div>
      </div>
    </footer>
  );
}
