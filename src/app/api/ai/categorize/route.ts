import { NextResponse } from "next/server";
import { categorizeJobDescription } from "@/lib/ai/categorizer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required and must be a string." },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required and must be a string." },
        { status: 400 }
      );
    }

    // Sanitize input length
    const cleanTitle = title.trim().slice(0, 200);
    const cleanDesc = description.trim().slice(0, 3000);

    const result = await categorizeJobDescription(cleanTitle, cleanDesc);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
