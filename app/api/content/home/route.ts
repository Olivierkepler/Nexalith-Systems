import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const HOME_PATH = path.join(process.cwd(), "content", "home.json");

export async function GET() {
  try {
    const raw = fs.readFileSync(HOME_PATH, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error reading home.json", err);
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // Very light validation
    if (!body.hero || !body.hero.title) {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    fs.writeFileSync(HOME_PATH, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error writing home.json", err);
    return NextResponse.json({ error: "Failed to write content" }, { status: 500 });
  }
}
