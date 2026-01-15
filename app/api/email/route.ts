import { NextResponse } from "next/server";

// Placeholder email route - not currently implemented
export async function POST() {
  return NextResponse.json(
    { error: "Email route not implemented" },
    { status: 501 }
  );
}

export async function GET() {
  return NextResponse.json(
    { message: "Email API endpoint" },
    { status: 200 }
  );
}
