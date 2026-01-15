import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const FILENAME = "about.json";
const CONTENT_DIR = join(process.cwd(), "content");

/**
 * GET — Fetch about.json from local content directory
 */
export async function GET() {
  try {
    const filePath = join(CONTENT_DIR, FILENAME);
    const fileContent = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
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
 * PUT — Update about.json in local content directory
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

    const filePath = join(CONTENT_DIR, FILENAME);
    await writeFile(filePath, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update about.json:", error);
    return NextResponse.json(
      { error: "Unable to update about content." },
      { status: 500 }
    );
  }
}
