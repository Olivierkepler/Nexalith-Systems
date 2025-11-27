import { NextResponse } from "next/server";
import { readJsonFile, updateJsonFile } from "@/lib/gist";

const FILENAME = "contact.json";

export async function GET() {
  try {
    const data = await readJsonFile(FILENAME);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("GET /api/content/contact error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load contact content" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await updateJsonFile(FILENAME, body);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PUT /api/content/contact error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to save contact content" },
      { status: 500 }
    );
  }
}
