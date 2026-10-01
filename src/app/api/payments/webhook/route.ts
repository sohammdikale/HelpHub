import { NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature } from "@/lib/payments/razorpay";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const webhookSignature = req.headers.get("x-razorpay-signature") || "";

    const isValid = verifyRazorpayWebhookSignature(rawBody, webhookSignature);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    // Acknowledge receipt idempotently
    return NextResponse.json({
      received: true,
      event: eventType,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
