import { NextResponse } from "next/server";
import { readJsonFile, updateJsonFile } from "@/lib/gist";

/**
 * GET — Fetch about.json from your Gist
 */
export async function GET() {
  try {
    const data = await readJsonFile("about.json");
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to load about.json:", error);
    return NextResponse.json(
      { error: "Unable to load about content." },
      { status: 500 }
    );
  }
}

/**
 * PUT — Update about.json in your Gist
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Validate shape (optional but safe)
    if (
      !body ||
      typeof body.title !== "string" ||
      typeof body.description !== "string" ||
      typeof body.secondary !== "string" ||
      !body.vision ||
      typeof body.vision.title !== "string" ||
      typeof body.vision.text !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid about.json structure." },
        { status: 400 }
      );
    }

    await updateJsonFile("about.json", body);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update about.json:", error);
    return NextResponse.json(
      { error: "Unable to update about content." },
      { status: 500 }
    );
  }
}
