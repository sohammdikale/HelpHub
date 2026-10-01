import { NextResponse } from "next/server";
import { verifyPanCard } from "@/lib/kyc/surepass";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { panNumber, holderName, consent } = body;

    if (!consent) {
      return NextResponse.json(
        { error: "Explicit consent is required for PAN tax ID verification." },
        { status: 400 }
      );
    }

    if (!panNumber || typeof panNumber !== "string") {
      return NextResponse.json({ error: "PAN number is required." }, { status: 400 });
    }

    if (!holderName || typeof holderName !== "string") {
      return NextResponse.json({ error: "Holder name is required." }, { status: 400 });
    }

    const result = await verifyPanCard(panNumber, holderName, consent);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
