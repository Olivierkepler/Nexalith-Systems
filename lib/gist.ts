const GIST_ID = process.env.GIST_ID!;
const TOKEN = process.env.GITHUB_GIST_TOKEN!;

if (!GIST_ID) {
  throw new Error("GIST_ID is not set in environment variables.");
}
if (!TOKEN) {
  throw new Error("GITHUB_GIST_TOKEN is not set in environment variables.");
}

const GIST_API_URL = `https://api.github.com/gists/${GIST_ID}`;

interface GistFileResponse {
  files?: {
    [filename: string]: {
      filename: string;
      content?: string;
    };
  };
}

/**
 * Reads a JSON file from the configured Gist.
 */
export async function readJsonFile<T = any>(filename: string): Promise<T> {
  const res = await fetch(GIST_API_URL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error fetching Gist:", text);
    throw new Error(`Failed to fetch Gist (${res.status})`);
  }

  const data = (await res.json()) as GistFileResponse;
  const file = data.files?.[filename];

  if (!file || !file.content) {
    throw new Error(`File "${filename}" not found or empty in Gist`);
  }

  return JSON.parse(file.content) as T;
}

/**
 * Updates (or creates) a JSON file in the configured Gist.
 */
export async function updateJsonFile(filename: string, content: any) {
  const body = {
    files: {
      [filename]: {
        content: JSON.stringify(content, null, 2),
      },
    },
  };

  const res = await fetch(GIST_API_URL, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error updating Gist:", text);
    throw new Error(`Failed to update Gist file "${filename}"`);
  }

  return true;
}
