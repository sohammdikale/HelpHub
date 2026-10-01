"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { UserCheck, Shield, Briefcase, Wrench, ChevronDown, Check } from "lucide-react";
import Link from "next/link";

export function RoleSwitcher() {
  const { currentUser, switchUser, users } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "worker":
        return <Wrench className="w-3.5 h-3.5 text-teal-600" />;
      case "employer":
        return <Briefcase className="w-3.5 h-3.5 text-indigo-600" />;
      case "admin":
        return <Shield className="w-3.5 h-3.5 text-amber-600" />;
      case "accountant":
        return <UserCheck className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return null;
    }
  };

  const getDashboardHref = (role?: string) => {
    switch (role) {
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
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 rounded-full px-3 py-1 text-xs transition-colors">
        <span className="flex items-center gap-1 font-medium text-slate-700">
          {getRoleIcon(currentUser?.role)}
          <span className="font-semibold capitalize text-slate-900">{currentUser?.role || "Guest"}</span>:
          <span className="truncate max-w-[110px] hidden sm:inline">{currentUser?.fullName}</span>
        </span>

        {currentUser && (
          <Link
            href={getDashboardHref(currentUser.role)}
            className="ml-1 text-[11px] font-bold text-teal-700 hover:text-teal-800 bg-teal-100/70 hover:bg-teal-200/80 px-2 py-0.5 rounded-full transition-colors"
          >
            Dashboard
          </Link>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Switch test persona"
          className="text-slate-500 hover:text-slate-800 ml-0.5 p-0.5"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Switch Test Persona (End-to-End Testing)
              </p>
            </div>
            <div className="py-1">
              {users.map((u) => {
                const isActive = u.id === currentUser?.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                      isActive ? "bg-indigo-50/80 text-indigo-950 font-bold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100">
                        {getRoleIcon(u.role)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{u.fullName}</div>
                        <div className="text-[11px] capitalize text-slate-500">{u.role} &bull; {u.city}</div>
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
            <div className="border-t border-slate-100 pt-1 mt-1">
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full py-1.5 text-center text-xs font-semibold text-teal-700 hover:text-teal-800 rounded-lg hover:bg-teal-50"
              >
                + Register New Account
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
