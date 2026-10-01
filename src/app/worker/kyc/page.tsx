"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Send,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function WorkerKycPage() {
  const { currentUser, updateUserKyc } = useStore();

  const [documentType, setDocumentType] = useState<"aadhaar" | "pan">("aadhaar");
  const [aadhaarNumber, setAadhaarNumber] = useState("987654321012");
  const [otp, setOtp] = useState("");
  const [clientId, setClientId] = useState("");
  const [step, setStep] = useState<"input" | "otp" | "verified">(
    currentUser?.isKycVerified ? "verified" : "input"
  );

  const [panNumber, setPanNumber] = useState("ABCDE1234F");
  const [panName, setPanName] = useState(currentUser?.fullName || "Ramesh Sharma");

  const [consent, setConsent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successInfo, setSuccessInfo] = useState<{ maskedId: string; provider: string } | null>(null);

  if (!currentUser) {
    return <div className="p-8 text-center text-xs text-slate-500">Please sign in to access KYC.</div>;
  }

  // Step 1: Generate OTP for Aadhaar
  const handleGenerateAadhaarOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/kyc/generate-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaarNumber, consent }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (res.ok && data.success) {
        setClientId(data.clientId || "client_sbx_demo");
        setStep("otp");
      } else {
        setError(data.error || data.message || "Failed to generate OTP.");
      }
    } catch {
      setIsLoading(false);
      setError("Network error while connecting to Surepass gateway.");
    }
  };

  // Step 2: Submit OTP for Aadhaar
  const handleSubmitAadhaarOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/kyc/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, otp, userId: currentUser.id }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (res.ok && data.success) {
        updateUserKyc("verified");
        setSuccessInfo({
          maskedId: data.maskedAadhaar || "•••• •••• " + aadhaarNumber.slice(-4),
          provider: data.isSandbox ? "Surepass Sandbox Mode" : "UIDAI Surepass Production",
        });
        setStep("verified");
      } else {
        setError(data.message || data.error || "OTP verification failed. Tip: Use 123456 in Sandbox.");
      }
    } catch {
      setIsLoading(false);
      setError("Network error validating OTP.");
    }
  };

  // PAN Verification
  const handleVerifyPan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/kyc/verify-pan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panNumber, holderName: panName, consent }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (res.ok && data.success) {
        updateUserKyc("verified");
        setSuccessInfo({
          maskedId: data.maskedPan || "AB••••••4F",
          provider: data.isSandbox ? "Surepass Tax Sandbox" : "NSDL/ITD Surepass Production",
        });
        setStep("verified");
      } else {
        setError(data.message || data.error || "PAN verification failed.");
      }
    } catch {
      setIsLoading(false);
      setError("Network error verifying PAN.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              Surepass Identity Verification (KYC)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Indian regulatory identity authentication adhering to the Digital Personal Data Protection Act, 2023.
            </p>
          </div>
          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Sandbox Enabled
          </span>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* VERIFIED STATE */}
        {step === "verified" || currentUser.isKycVerified ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-card text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Identity Successfully Verified</h2>
              <p className="text-xs text-slate-500 mt-1">
                Your government identity credentials have been authenticated via Surepass.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Document Type:</span>
                <strong className="text-slate-900 uppercase">{documentType}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Masked Identifier:</span>
                <strong className="text-slate-900">{successInfo?.maskedId || "•••• •••• 9012"}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verification Engine:</span>
                <span className="font-semibold text-teal-700">{successInfo?.provider || "Surepass Gateway"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-700">VERIFIED</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Your profile now features the Verified Worker badge across employer job feeds.
            </p>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-card space-y-6">
            {/* Document Type Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setDocumentType("aadhaar");
                  setStep("input");
                }}
                className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                  documentType === "aadhaar"
                    ? "border-teal-500 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Aadhaar Card (OTP Flow)
              </button>

              <button
                type="button"
                onClick={() => {
                  setDocumentType("pan");
                  setStep("input");
                }}
                className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                  documentType === "pan"
                    ? "border-teal-500 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                PAN Card (Instant Tax Record)
              </button>
            </div>

            {/* Aadhaar Flow */}
            {documentType === "aadhaar" && (
              <>
                {step === "input" && (
                  <form onSubmit={handleGenerateAadhaarOtp} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        12-Digit Aadhaar Number
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        required
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ""))}
                        placeholder="e.g. 987654321012"
                        className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 tracking-wider"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        We send an OTP to your Aadhaar-linked mobile. Raw number is never retained.
                      </span>
                    </div>

                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="aadhaarConsent"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 accent-teal-600 rounded"
                      />
                      <label htmlFor="aadhaarConsent" className="text-[11px] text-slate-600 leading-normal">
                        I hereby provide informed consent to HelpHun and its licensed verification partner (Surepass) to verify my identity via UIDAI authentication rails under the DPDP Act 2023.
                      </label>
                    </div>

                    <Button type="submit" variant="accent" size="md" isLoading={isLoading} className="w-full">
                      Generate Aadhaar OTP
                    </Button>
                  </form>
                )}

                {step === "otp" && (
                  <form onSubmit={handleSubmitAadhaarOtp} className="space-y-4">
                    <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800">
                      OTP has been dispatched. (In Sandbox Mode, enter <strong>123456</strong>)
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full px-3 py-2 text-base font-mono text-center tracking-widest rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={() => setStep("input")}
                      >
                        Back
                      </Button>
                      <Button type="submit" variant="accent" size="md" isLoading={isLoading} className="flex-1">
                        Submit & Verify
                      </Button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* PAN Flow */}
            {documentType === "pan" && (
              <form onSubmit={handleVerifyPan} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Permanent Account Number (PAN)
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    required
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 text-sm font-mono uppercase rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Name as per PAN Card
                  </label>
                  <input
                    type="text"
                    required
                    value={panName}
                    onChange={(e) => setPanName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="panConsent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 accent-teal-600 rounded"
                  />
                  <label htmlFor="panConsent" className="text-[11px] text-slate-600 leading-normal">
                    I authorize HelpHun and Surepass to validate this PAN against official tax records.
                  </label>
                </div>

                <Button type="submit" variant="accent" size="md" isLoading={isLoading} className="w-full">
                  Verify PAN Authenticity
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
