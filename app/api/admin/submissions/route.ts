import { google } from "googleapis";

export async function GET() {
  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:E",
    });

    const rows = response.data.values || [];

    // Remove header row and add a stable Google Sheets ROW ID
    const data = rows.slice(1).map((row, index) => ({
      id: index + 2, // row 2 = first entry
      name: row[0] || "",
      email: row[1] || "",
      phone: row[2] || "",
      message: row[3] || "",
      timestamp: row[4] || "",
    }));

    return new Response(JSON.stringify({ entries: data }), { status: 200 });
  } catch (error) {
    console.error("Admin Fetch Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch" }), {
      status: 500,
    });
  }
}
