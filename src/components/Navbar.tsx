"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import {
  Bell,
  Briefcase,
  Wrench,
  Shield,
  Menu,
  X,
  LogOut,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const { currentUser, logout, notifications, markNotificationAsRead } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const userNotifications = notifications.filter(
    (n) => !currentUser || n.recipientId === currentUser.id
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const getDashboardHref = () => {
    if (!currentUser) return "/login";
    switch (currentUser.role) {
      case "worker":
        return "/worker";
      case "employer":
        return "/employer";
      case "admin":
        return "/admin";
      case "accountant":
        return "/accountant";
      default:
        return "/";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-950 to-indigo-900 text-white shadow-md shadow-indigo-950/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-indigo-950">
                  Help<span className="text-teal-600">Hub</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-teal-50 text-teal-700 border border-teal-200/60 rounded">
                  IN 🇮🇳
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">
                Find Help Nearby
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/find-work"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-950 hover:bg-slate-100/80 rounded-lg transition-colors"
            >
              <Wrench className="w-3.5 h-3.5 text-teal-600" />
              Find Work
            </Link>
            <Link
              href="/find-services"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-950 hover:bg-slate-100/80 rounded-lg transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              Find Services
            </Link>
            <Link
              href="/how-it-works"
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-950 hover:bg-slate-100/80 rounded-lg transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/safety"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-950 hover:bg-slate-100/80 rounded-lg transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              Trust & Safety
            </Link>
          </nav>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Persona / Role Switcher for seamless testing */}
          <RoleSwitcher />

          {/* In-App Notifications Tray */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                    <span className="text-xs font-bold uppercase text-slate-500">Notifications</span>
                    <span className="text-[11px] text-teal-600 font-semibold">
                      {unreadCount} unread
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 py-1">
                    {userNotifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      userNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                            notif.read ? "bg-white opacity-70" : "bg-teal-50/60 hover:bg-teal-50"
                          }`}
                        >
                          <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                          <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>
                          <span className="text-[9px] text-slate-400 mt-1 block">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Direct CTA depending on Auth status */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href={getDashboardHref()}
                className="hidden sm:inline-flex items-center justify-center rounded-xl bg-indigo-950 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-900 transition-colors"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={logout}
                title="Log out"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-700 hover:text-indigo-950 px-3 py-1.5"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition-colors"
              >
                Join Now
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top duration-200">
          <Link
            href="/find-work"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50"
          >
            👷 Find Work
          </Link>
          <Link
            href="/find-services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50"
          >
            💼 Find Services
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50"
          >
            📖 How It Works
          </Link>
          <Link
            href="/safety"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50"
          >
            🛡️ Trust & Safety
          </Link>
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <Link
              href={getDashboardHref()}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 bg-indigo-950 text-white font-bold rounded-xl text-xs"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
