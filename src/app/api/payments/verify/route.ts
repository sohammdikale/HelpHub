import { NextResponse } from "next/server";
import { verifyRazorpayPaymentSignature } from "@/lib/payments/razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, paymentId, signature, jobId } = body;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: "orderId, paymentId, and signature are strictly required." },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpayPaymentSignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Cryptographic HMAC signature verification failed." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      jobId,
      orderId,
      paymentId,
      status: "authorized",
      verifiedAt: new Date().toISOString(),
      message: "Payment successfully validated and authorized.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
