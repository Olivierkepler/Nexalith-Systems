// app/api/contact/route.ts
import { google } from 'googleapis';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, phone, message, company } = body || {};

    // Basic anti-spam + validation
    if (company) {
      // honeypot filled => spam
      return new Response(JSON.stringify({ ok: false, error: 'Spam detected' }), {
        status: 400,
      });
    }

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Authenticate with Google using service account
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Append a new row
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:E', // columns A to E
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            name,
            email,
            phone || '',
            message,
            new Date().toISOString(),
          ],
        ],
      },
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error('Sheets API Error:', error);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
    });
  }
}

// Optional: you can also handle GET to verify the route is alive
export async function GET() {
  return new Response('Contact API is working', { status: 200 });
}
