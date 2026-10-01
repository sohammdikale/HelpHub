import { NextResponse } from "next/server";
import { submitAadhaarOtp } from "@/lib/kyc/surepass";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientId, otp, userId } = body;

    if (!clientId || typeof clientId !== "string") {
      return NextResponse.json(
        { error: "Client ID from OTP dispatch step is required." },
        { status: 400 }
      );
    }

    if (!otp || typeof otp !== "string" || otp.trim().length !== 6) {
      return NextResponse.json(
        { error: "OTP must be exactly 6 digits." },
        { status: 400 }
      );
    }

    const result = await submitAadhaarOtp(clientId, otp.trim(), userId || "anonymous");
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
