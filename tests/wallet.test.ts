import { describe, it, expect } from "vitest";
import { validateWithdrawalEligibility, processUpiWithdrawal } from "../src/lib/wallet/ledger";
import { WalletAccount, WithdrawalRequest } from "../src/types";

describe("Worker Wallet & UPI Withdrawal Tests", () => {
  const sampleWallet: WalletAccount = {
    userId: "usr_worker_test",
    availableBalancePaise: 50000, // ₹500.00
    pendingBalancePaise: 0,
    lockedBalancePaise: 0,
    totalEarnedPaise: 100000,
    totalWithdrawnPaise: 50000,
    updatedAt: new Date().toISOString(),
  };

  it("permits withdrawal when balance, KYC, and UPI ID are valid", () => {
    const res = validateWithdrawalEligibility(
      sampleWallet,
      25000, // ₹250.00
      true,  // KYC verified
      "ramesh@okhdfcbank"
    );

    expect(res.eligible).toBe(true);
  });

  it("REJECTS withdrawal when worker has not completed KYC", () => {
    const res = validateWithdrawalEligibility(
      sampleWallet,
      25000,
      false, // KYC NOT verified
      "ramesh@okhdfcbank"
    );

    expect(res.eligible).toBe(false);
    expect(res.error).toContain("KYC identity verification is required");
  });

  it("REJECTS withdrawal amounts below the ₹100 threshold", () => {
    const res = validateWithdrawalEligibility(
      sampleWallet,
      5000, // ₹50 (below ₹100 threshold)
      true,
      "ramesh@okhdfcbank"
    );

    expect(res.eligible).toBe(false);
    expect(res.error).toContain("Minimum withdrawal threshold is ₹100.00");
  });

  it("REJECTS withdrawal when requested amount exceeds available balance", () => {
    const res = validateWithdrawalEligibility(
      sampleWallet,
      75000, // ₹750 (wallet only has ₹500)
      true,
      "ramesh@okhdfcbank"
    );

    expect(res.eligible).toBe(false);
    expect(res.error).toContain("Insufficient available balance");
  });

  it("REJECTS invalid UPI VPA format", () => {
    const res = validateWithdrawalEligibility(
      sampleWallet,
      25000,
      true,
      "invalid_upi_string_without_at_symbol"
    );

    expect(res.eligible).toBe(false);
    expect(res.error).toContain("Invalid UPI Virtual Payment Address");
  });

  it("processes simulated UPI payout successfully in sandbox mode", async () => {
    const withdrawal: WithdrawalRequest = {
      id: "wth_test_101",
      userId: "usr_worker_test",
      userName: "Ramesh Sharma",
      amountPaise: 25000,
      upiId: "ramesh@okhdfcbank",
      status: "processing",
      createdAt: new Date().toISOString(),
    };

    const payout = await processUpiWithdrawal(withdrawal);
    expect(payout.success).toBe(true);
    expect(payout.status).toBe("completed");
    expect(payout.referenceId).toBeTruthy();
  });
});
