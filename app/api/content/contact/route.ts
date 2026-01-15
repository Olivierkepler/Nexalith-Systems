import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const FILENAME = "contact.json";
const CONTENT_DIR = join(process.cwd(), "content");

export async function GET() {
  try {
    const filePath = join(CONTENT_DIR, FILENAME);
    const fileContent = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
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
    const filePath = join(CONTENT_DIR, FILENAME);
    await writeFile(filePath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PUT /api/content/contact error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to save contact content" },
      { status: 500 }
    );
  }
}
