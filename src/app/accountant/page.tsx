"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPaiseToRupees } from "@/lib/utils";
import {
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle2,
  Lock,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AccountantDashboardPage() {
  const { currentUser, transactions, withdrawals, jobs } = useStore();

  const [typeFilter, setTypeFilter] = useState("all");

  if (!currentUser || (currentUser.role !== "accountant" && currentUser.role !== "admin")) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-md shadow-card">
          <FileSpreadsheet className="w-10 h-10 text-emerald-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Accountant Access Restricted</h2>
          <p className="text-xs text-slate-500">
            Read-only financial records portal. Switch persona to <strong>Ananya (Accountant)</strong> using the role switcher at top right to view accounting ledgers.
          </p>
          <Link href="/login" className="inline-block text-xs font-bold text-emerald-700 underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    return true;
  });

  // Calculate totals in integer paise
  const totalPayoutsPaise = transactions
    .filter((t) => t.type === "job_payout")
    .reduce((sum, t) => sum + t.amountPaise, 0);

  const totalWithdrawalsPaise = transactions
    .filter((t) => t.type === "withdrawal_debit")
    .reduce((sum, t) => sum + t.amountPaise, 0);

  // Platform fee simulated at 5% of captured volume
  const estimatedPlatformFeePaise = Math.round(totalPayoutsPaise * 0.05);

  // CSV Export Generator
  const handleExportCsv = () => {
    const headers = ["Transaction ID", "User ID", "Type", "Amount (Paise)", "Amount (INR)", "Status", "Reference", "Date"];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.userId,
      t.type,
      t.amountPaise,
      (t.amountPaise / 100).toFixed(2),
      t.status,
      t.referenceId,
      t.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `helphun_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">Financial Ledger & Reconciliation</h1>
                <Badge variant="success">Read-Only Financials</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Double-entry integer paise transaction audits, Razorpay settlements, and UPI withdrawal batches.
              </p>
            </div>
          </div>

          <Button variant="accent" size="sm" onClick={handleExportCsv}>
            <Download className="w-4 h-4 mr-1.5" />
            Export Ledger CSV
          </Button>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Gross Worker Payouts
              </span>
              <ArrowDownRight className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700">
              {formatPaiseToRupees(totalPayoutsPaise)}
            </div>
            <span className="text-[10px] text-slate-400 block pt-1">
              Credited to worker wallets upon job approvals
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total UPI Withdrawals
              </span>
              <ArrowUpRight className="w-4 h-4 text-indigo-950" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {formatPaiseToRupees(totalWithdrawalsPaise)}
            </div>
            <span className="text-[10px] text-slate-400 block pt-1">
              Settled to Indian bank accounts via UPI rails
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Platform Commission Pool (5%)
              </span>
              <Building className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-teal-700">
              {formatPaiseToRupees(estimatedPlatformFeePaise)}
            </div>
            <span className="text-[10px] text-slate-400 block pt-1">
              Accrued platform maintenance & verification fees
            </span>
          </div>
        </div>

        {/* Filter & Ledger Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Financial Journal Entries ({filteredTransactions.length})
            </h2>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none bg-slate-50"
              >
                <option value="all">All Transaction Types</option>
                <option value="job_payout">Job Payouts</option>
                <option value="withdrawal_debit">UPI Withdrawals</option>
                <option value="withdrawal_refund">Refunds</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3">Reference ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Amount (INR)</th>
                  <th className="p-3 text-right">Balance After</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-semibold text-slate-700">{tx.referenceId}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          tx.type === "job_payout"
                            ? "success"
                            : tx.type === "withdrawal_debit"
                            ? "teal"
                            : "default"
                        }
                      >
                        {tx.type}
                      </Badge>
                    </td>
                    <td className="p-3 font-mono text-slate-500">{tx.userId}</td>
                    <td className="p-3 text-slate-800">{tx.description}</td>
                    <td
                      className={`p-3 text-right font-bold ${
                        tx.type === "job_payout" ? "text-emerald-700" : "text-slate-900"
                      }`}
                    >
                      {tx.type === "job_payout" ? "+" : "-"}
                      {formatPaiseToRupees(tx.amountPaise)}
                    </td>
                    <td className="p-3 text-right font-semibold text-slate-600">
                      {formatPaiseToRupees(tx.balanceAfterPaise)}
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
