import { NextResponse } from "next/server";
import { generateAadhaarOtp } from "@/lib/kyc/surepass";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { aadhaarNumber, consent } = body;

    if (!consent) {
      return NextResponse.json(
        { error: "Explicit user consent is mandatory under Indian data protection law." },
        { status: 400 }
      );
    }

    if (!aadhaarNumber || typeof aadhaarNumber !== "string") {
      return NextResponse.json(
        { error: "Aadhaar number is required." },
        { status: 400 }
      );
    }

    const clean = aadhaarNumber.replace(/\D/g, "");
    if (clean.length !== 12) {
      return NextResponse.json(
        { error: "Aadhaar number must be exactly 12 numeric digits." },
        { status: 400 }
      );
    }

    const result = await generateAadhaarOtp(clean, consent);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
