import { NextResponse } from "next/server";

const GIST_ID = process.env.GIST_ID!;
const TOKEN = process.env.GITHUB_GIST_TOKEN!;
const FILE_NAME = "home.json";

const GITHUB_API = `https://api.github.com/gists/${GIST_ID}`;

export async function GET() {
  try {
    const res = await fetch(GITHUB_API, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-cache", // always fetch latest gist data
    });

    if (!res.ok) {
      console.error("🔥 Error fetching Gist:", await res.text());
      return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
    }

    const data = await res.json();
    const file = data.files?.[FILE_NAME];

    if (!file) {
      console.error("⚠️ home.json not found in gist");
      return NextResponse.json({ error: "home.json missing in gist" }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(file.content));
  } catch (err) {
    console.error("🔥 Exception while reading Gist:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const newContent = await req.json();

    const body = {
      files: {
        [FILE_NAME]: {
          content: JSON.stringify(newContent, null, 2),
        },
      },
    };

    const res = await fetch(GITHUB_API, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("🔥 Error updating Gist:", await res.text());
      return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("🔥 Exception while writing to Gist:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
