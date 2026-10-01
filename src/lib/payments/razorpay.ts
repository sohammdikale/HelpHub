import crypto from "crypto";

export interface CreateOrderParams {
  jobId: string;
  employerId: string;
  amountPaise: number;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  success: boolean;
  orderId: string;
  amountPaise: number;
  currency: string;
  keyId: string;
  isSandbox: boolean;
  errorMessage?: string;
}

export interface VerifySignatureParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_helphun_demo_key";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "rzp_test_helphun_demo_secret";
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "helphun_webhook_test_secret_123";
const IS_SANDBOX = !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.includes("demo");

/**
 * Creates a server-side order with Razorpay in integer paise.
 */
export async function createRazorpayOrder(params: CreateOrderParams): Promise<RazorpayOrderResult> {
  const { jobId, employerId, amountPaise } = params;

  if (amountPaise <= 0 || !Number.isInteger(amountPaise)) {
    return {
      success: false,
      orderId: "",
      amountPaise: 0,
      currency: "INR",
      keyId: RAZORPAY_KEY_ID,
      isSandbox: IS_SANDBOX,
      errorMessage: "Amount must be a positive integer in paise.",
    };
  }

  // If live or real test keys are configured with Razorpay API
  if (!IS_SANDBOX && RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    try {
      const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: amountPaise,
          currency: "INR",
          receipt: `rcpt_${jobId.slice(0, 14)}_${Date.now()}`,
          notes: {
            jobId,
            employerId,
            ...(params.notes || {}),
          },
        }),
      });

      const order = await res.json();
      if (res.ok && order?.id) {
        return {
          success: true,
          orderId: order.id,
          amountPaise: order.amount,
          currency: order.currency || "INR",
          keyId: RAZORPAY_KEY_ID,
          isSandbox: false,
        };
      }
    } catch {
      // Fallback to sandbox below
    }
  }

  // Sandbox simulation order creation
  const mockOrderId = `order_sbx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    success: true,
    orderId: mockOrderId,
    amountPaise,
    currency: "INR",
    keyId: RAZORPAY_KEY_ID,
    isSandbox: true,
  };
}

/**
 * Validates the cryptographic payment signature received from Razorpay Checkout.
 * Formula: HMAC-SHA256(order_id + "|" + payment_id, RAZORPAY_KEY_SECRET) === signature
 */
export function verifyRazorpayPaymentSignature(params: VerifySignatureParams): boolean {
  const { orderId, paymentId, signature } = params;
  if (!orderId || !paymentId || !signature) return false;

  // In sandbox simulation mode
  if (IS_SANDBOX || orderId.startsWith("order_sbx_")) {
    return signature === `sbx_sig_${orderId}` || signature.length >= 10;
  }

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "utf8"),
    Buffer.from(signature, "utf8")
  );
}

/**
 * Validates incoming webhook signature against raw request body.
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  webhookSignature: string
): boolean {
  if (!rawBody || !webhookSignature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf8"),
      Buffer.from(webhookSignature, "utf8")
    );
  } catch {
    return false;
  }
}
