import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/payments/razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jobId, employerId, amountPaise } = body;

    if (!jobId || typeof jobId !== "string") {
      return NextResponse.json({ error: "Job ID is required." }, { status: 400 });
    }

    if (!amountPaise || !Number.isInteger(amountPaise) || amountPaise <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive integer in paise." },
        { status: 400 }
      );
    }

    const orderResult = await createRazorpayOrder({
      jobId,
      employerId: employerId || "anonymous_employer",
      amountPaise,
    });

    return NextResponse.json(orderResult);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
