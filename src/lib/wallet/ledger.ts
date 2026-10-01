import { WalletAccount, WalletTransaction, WithdrawalRequest } from "@/types";

export interface PayoutResult {
  success: boolean;
  withdrawalId: string;
  amountPaise: number;
  upiId: string;
  status: "completed" | "processing" | "failed";
  referenceId: string;
  isSandbox: boolean;
  message: string;
}

const MIN_WITHDRAWAL_PAISE = 10000; // ₹100.00
const IS_SANDBOX_PAYOUT = process.env.RAZORPAYX_SANDBOX_MODE !== "false";

/**
 * Validates a worker's withdrawal request against their wallet balance.
 */
export function validateWithdrawalEligibility(
  wallet: WalletAccount,
  requestedAmountPaise: number,
  isKycVerified: boolean,
  upiId: string
): { eligible: boolean; error?: string } {
  if (!isKycVerified) {
    return {
      eligible: false,
      error: "Indian KYC identity verification is required before initiating UPI withdrawals.",
    };
  }

  if (!Number.isInteger(requestedAmountPaise) || requestedAmountPaise <= 0) {
    return {
      eligible: false,
      error: "Withdrawal amount must be a positive integer in paise.",
    };
  }

  if (requestedAmountPaise < MIN_WITHDRAWAL_PAISE) {
    return {
      eligible: false,
      error: "Minimum withdrawal threshold is ₹100.00 (10,000 paise).",
    };
  }

  if (wallet.availableBalancePaise < requestedAmountPaise) {
    return {
      eligible: false,
      error: `Insufficient available balance. You have ₹${(wallet.availableBalancePaise / 100).toFixed(2)}, requested ₹${(requestedAmountPaise / 100).toFixed(2)}.`,
    };
  }

  const vpaRegex = /^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z._]{2,49}$/;
  if (!vpaRegex.test(upiId.trim())) {
    return {
      eligible: false,
      error: "Invalid UPI Virtual Payment Address (e.g. yourname@okhdfcbank).",
    };
  }

  return { eligible: true };
}

/**
 * Execute atomic payout via RazorpayX or Sandbox UPI Simulator
 */
export async function processUpiWithdrawal(
  withdrawal: WithdrawalRequest
): Promise<PayoutResult> {
  const { id, amountPaise, upiId } = withdrawal;

  // In Sandbox mode
  if (IS_SANDBOX_PAYOUT) {
    // Simulate instant payout execution for valid sandbox UPI IDs
    const mockRef = `payout_sbx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    return {
      success: true,
      withdrawalId: id,
      amountPaise,
      upiId,
      status: "completed",
      referenceId: mockRef,
      isSandbox: true,
      message: "Sandbox Payout Complete: Simulated fund transfer dispatched to UPI address.",
    };
  }

  // Real RazorpayX Payout flow would execute here with secret keys
  return {
    success: false,
    withdrawalId: id,
    amountPaise,
    upiId,
    status: "failed",
    referenceId: "",
    isSandbox: false,
    message: "Live RazorpayX credentials not yet provisioned. Switch to sandbox mode for testing.",
  };
}
