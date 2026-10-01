import { describe, it, expect } from "vitest";
import { formatPaiseToRupees, rupeesToPaise } from "../src/lib/utils";
import {
  createRazorpayOrder,
  verifyRazorpayPaymentSignature,
} from "../src/lib/payments/razorpay";

describe("Payment & Razorpay Security Tests", () => {
  it("converts rupees to integer paise without floating point errors", () => {
    expect(rupeesToPaise(500)).toBe(50000);
    expect(rupeesToPaise(500.5)).toBe(50050);
    expect(rupeesToPaise(1250.75)).toBe(125075);
  });

  it("formats integer paise accurately into Indian Rupee currency strings", () => {
    expect(formatPaiseToRupees(50000)).toBe("₹500");
    expect(formatPaiseToRupees(15050)).toBe("₹150.50");
  });

  it("creates a valid Razorpay order structure in integer paise", async () => {
    const order = await createRazorpayOrder({
      jobId: "job_test_001",
      employerId: "usr_employer_test",
      amountPaise: 75000,
    });

    expect(order.success).toBe(true);
    expect(order.amountPaise).toBe(75000);
    expect(order.currency).toBe("INR");
    expect(order.orderId).toBeTruthy();
  });

  it("rejects non-positive and non-integer order amounts", async () => {
    const negativeOrder = await createRazorpayOrder({
      jobId: "job_test_001",
      employerId: "usr_employer_test",
      amountPaise: -500,
    });
    expect(negativeOrder.success).toBe(false);

    const fractionalOrder = await createRazorpayOrder({
      jobId: "job_test_001",
      employerId: "usr_employer_test",
      amountPaise: 50.75, // Fractional paise is forbidden
    });
    expect(fractionalOrder.success).toBe(false);
  });

  it("validates payment signatures in sandbox/test mode correctly", () => {
    const orderId = "order_sbx_12345";
    const paymentId = "pay_sbx_99887";
    const validSignature = `sbx_sig_${orderId}`;

    const isValid = verifyRazorpayPaymentSignature({
      orderId,
      paymentId,
      signature: validSignature,
    });
    expect(isValid).toBe(true);
  });

  it("rejects empty or forged payment signatures", () => {
    const isValid = verifyRazorpayPaymentSignature({
      orderId: "order_123",
      paymentId: "pay_456",
      signature: "", // Empty signature
    });
    expect(isValid).toBe(false);
  });
});
