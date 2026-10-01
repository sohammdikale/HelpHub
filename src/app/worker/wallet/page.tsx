"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPaiseToRupees, rupeesToPaise } from "@/lib/utils";
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";

export default function WorkerWalletPage() {
  const {
    currentUser,
    wallet,
    transactions,
    withdrawals,
    requestWithdrawal,
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawalAmountRupees, setWithdrawalAmountRupees] = useState<number>(500);
  const [upiId, setUpiId] = useState("ramesh@okhdfcbank");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!currentUser || currentUser.role !== "worker") {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Please log in or switch persona to a Worker to manage your wallet.
      </div>
    );
  }

  const myTransactions = transactions.filter((t) => t.userId === currentUser.id);
  const myWithdrawals = withdrawals.filter((w) => w.userId === currentUser.id);

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsProcessing(true);

    const amountPaise = rupeesToPaise(withdrawalAmountRupees);
    const res = await requestWithdrawal(amountPaise, upiId);

    setIsProcessing(false);
    if (res.success) {
      setStatusMessage({ text: res.message, isError: false });
      setTimeout(() => {
        setIsModalOpen(false);
        setStatusMessage(null);
      }, 2000);
    } else {
      setStatusMessage({ text: res.message, isError: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-teal-600" />
              Digital Earnings Wallet & UPI Payouts
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Auditable double-entry ledger. All balances stored mathematically in integer paise.
            </p>
          </div>

          <Button
            variant="accent"
            size="md"
            onClick={() => {
              setIsModalOpen(true);
              setStatusMessage(null);
            }}
          >
            <ArrowUpRight className="w-4 h-4 mr-1.5" />
            Request UPI Withdrawal
          </Button>
        </div>

        {/* KYC Verification Notice */}
        {!currentUser.isKycVerified && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Aadhaar/PAN KYC Required:</strong> To prevent money laundering and adhere to RBI payment rules, identity verification is mandatory prior to initiating payouts.
              </span>
            </div>
            <Link href="/worker/kyc" className="font-bold underline text-amber-950 shrink-0">
              Verify KYC &rarr;
            </Link>
          </div>
        )}

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Available Balance
            </span>
            <div className="text-2xl font-black text-indigo-950">
              {formatPaiseToRupees(wallet?.availableBalancePaise || 0)}
            </div>
            <span className="text-[10px] text-teal-700 font-semibold block pt-1">
              Ready for UPI withdrawal
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pending Escrow
            </span>
            <div className="text-2xl font-black text-amber-600">
              {formatPaiseToRupees(wallet?.pendingBalancePaise || 0)}
            </div>
            <span className="text-[10px] text-slate-400 block pt-1">Locked in active jobs</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Withdrawn
            </span>
            <div className="text-2xl font-black text-slate-800">
              {formatPaiseToRupees(wallet?.totalWithdrawnPaise || 0)}
            </div>
            <span className="text-[10px] text-slate-400 block pt-1">Dispatched to bank/UPI</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Lifetime Earned
            </span>
            <div className="text-2xl font-black text-emerald-700">
              {formatPaiseToRupees(wallet?.totalEarnedPaise || 0)}
            </div>
            <span className="text-[10px] text-slate-400 block pt-1">Gross job completions</span>
          </div>
        </div>

        {/* Ledger & Transactions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Transaction Ledger */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Immutable Ledger Entries</h2>
              <span className="text-[11px] text-slate-400">Sorted by newest</span>
            </div>

            {myTransactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No ledger transactions recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myTransactions.map((tx) => (
                  <div key={tx.id} className="py-3.5 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{tx.description}</span>
                        <Badge
                          variant={
                            tx.type === "job_payout"
                              ? "success"
                              : tx.type === "withdrawal_debit"
                              ? "teal"
                              : "default"
                          }
                        >
                          {tx.type.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>Ref: {tx.referenceId}</span>
                        <span>{new Date(tx.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-sm font-bold block ${
                          tx.type === "job_payout" || tx.type === "withdrawal_refund"
                            ? "text-emerald-700"
                            : "text-slate-900"
                        }`}
                      >
                        {tx.type === "job_payout" || tx.type === "withdrawal_refund" ? "+" : "-"}
                        {formatPaiseToRupees(tx.amountPaise)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Bal after: {formatPaiseToRupees(tx.balanceAfterPaise)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Withdrawal Batches */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              UPI Withdrawal Batches
            </h2>

            {myWithdrawals.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No withdrawal requests submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {myWithdrawals.map((w) => (
                  <div key={w.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {formatPaiseToRupees(w.amountPaise)}
                      </span>
                      <Badge variant={w.status === "completed" ? "success" : w.status === "failed" ? "danger" : "warning"}>
                        {w.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      VPA: <strong>{w.upiId}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Requested: {new Date(w.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UPI Withdrawal Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Request Instant UPI Withdrawal"
        >
          {statusMessage ? (
            <div className="text-center py-6 space-y-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                  statusMessage.isError ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                }`}
              >
                {statusMessage.isError ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {statusMessage.isError ? "Withdrawal Notice" : "Withdrawal Processed"}
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">{statusMessage.text}</p>
            </div>
          ) : (
            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Available Balance:</span>
                  <strong className="text-slate-900">
                    {formatPaiseToRupees(wallet?.availableBalancePaise || 0)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Minimum Threshold:</span>
                  <span>₹100.00 (10,000 paise)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payout Mode:</span>
                  <span className="font-semibold text-teal-700">Sandbox Simulated Payout</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Withdrawal Amount (₹ Rupees)
                </label>
                <input
                  type="number"
                  min={100}
                  step={50}
                  required
                  value={withdrawalAmountRupees}
                  onChange={(e) => setWithdrawalAmountRupees(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  UPI VPA Address (Google Pay / PhonePe / BHIM)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ramesh@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="accent" size="sm" isLoading={isProcessing}>
                  Confirm UPI Payout
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
