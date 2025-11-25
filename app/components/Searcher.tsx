"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import searchIndex from "@/content/search-index.json";

interface Result {
  page: string;
  section: string;
  id: string;
  title: string;
  text: string;
}

export default function Searcher() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const highlight = (text: string, q: string) => {
    const regex = new RegExp(`(${q})`, "gi");
    return text.replace(regex, "<mark class='bg-yellow-200'>$1</mark>");
  };

  useEffect(() => {
    if (!query.trim()) return setResults([]);

    const q = query.toLowerCase();
    const filtered = searchIndex.filter(
      (item: Result) =>
        item.title.toLowerCase().includes(q) ||
        item.text.toLowerCase().includes(q)
    );

    setResults(filtered);
  }, [query]);

  const handleClick = (result: Result) => {
    setOpen(false);
    setQuery("");

    // If already on same page → scroll
    if (pathname === `/${result.page === "home" ? "" : result.page}`) {
      document.getElementById(result.id)?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    } else {
      // Navigate → scroll when loaded
      router.push(`/${result.page === "home" ? "" : result.page}` + `#${result.id}`);
    }
  };

  return (
    <div className="relative">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-200/40 transition"
        >
          <Search className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {open && (
        <div className="absolute right-0 top-0 w-80 bg-white border shadow-xl rounded-xl p-2 z-50">
          <div className="flex items-center gap-2">
            <input
              className="w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              placeholder="Search all pages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
              className="p-1 rounded hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 max-h-64 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-sm text-gray-500 p-2">No results</p>
            ) : (
              results.map((r, i) => (
                <div
                  key={i}
                  onClick={() => handleClick(r)}
                  className="p-2 cursor-pointer rounded hover:bg-gray-100"
                >
                  <p className="text-xs font-semibold text-gray-500">
                    {r.page.toUpperCase()} — {r.section}
                  </p>

                  <p
                    className="text-sm font-medium"
                    dangerouslySetInnerHTML={{ __html: highlight(r.title, query) }}
                  />

                  <p
                    className="text-xs text-gray-600"
                    dangerouslySetInnerHTML={{ __html: highlight(r.text, query) }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
