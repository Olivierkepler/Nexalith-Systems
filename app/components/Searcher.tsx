"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import content from "@/content/home.json";

interface SearchResult {
  section: string;
  title: string;
  snippet: string;
  id: string; // used to scroll into view
}

export default function Searcher() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  // highlight helper
  const highlight = (text: string, q: string) => {
    if (!q) return text;

    const regex = new RegExp(`(${q})`, "gi");
    return text.replace(regex, "<mark class='bg-yellow-200'>$1</mark>");
  };

  // SEARCH LOGIC
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const found: SearchResult[] = [];

    // HERO
    if (
      content.hero.title.toLowerCase().includes(q) ||
      content.hero.subtitle.toLowerCase().includes(q)
    ) {
      found.push({
        section: "Hero",
        title: content.hero.title,
        snippet: content.hero.subtitle,
        id: "hero-section",
      });
    }

    // FEATURES
    content.features.forEach((f, index) => {
      if (
        f.title.toLowerCase().includes(q) ||
        f.text.toLowerCase().includes(q)
      ) {
        found.push({
          section: `Feature ${index + 1}`,
          title: f.title,
          snippet: f.text,
          id: `feature-${index}`,
        });
      }
    });

    // CENTERPIECE
    if (
      content.centerpiece.title.toLowerCase().includes(q) ||
      content.centerpiece.text.toLowerCase().includes(q)
    ) {
      found.push({
        section: "Centerpiece",
        title: content.centerpiece.title,
        snippet: content.centerpiece.text,
        id: "centerpiece-section",
      });
    }

    // GRID BLOCKS
    content.grid.forEach((g, index) => {
      if (
        g.title.toLowerCase().includes(q) ||
        g.text.toLowerCase().includes(q)
      ) {
        found.push({
          section: `Grid Block ${index + 1}`,
          title: g.title,
          snippet: g.text,
          id: `grid-${index}`,
        });
      }
    });

    // FOOTER
    if (content.footer.text.toLowerCase().includes(q)) {
      found.push({
        section: "Footer",
        title: "Footer",
        snippet: content.footer.text,
        id: "footer-section",
      });
    }

    setResults(found);
  }, [query]);

  // scroll handler
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setOpen(false);
    setQuery("");
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
        <div className="absolute right-0 top-0 bg-white shadow-xl rounded-xl border border-gray-200 p-2 w-72 sm:w-80 z-50">
          {/* SEARCH INPUT */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500"
              placeholder="Search website content..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />

            <button
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
              className="p-1 rounded-full hover:bg-gray-200/50 transition"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* RESULTS LIST */}
          {query && (
            <div className="mt-2 max-h-60 overflow-y-auto">
              {results.length > 0 ? (
                results.map((r, idx) => (
                  <div
                    key={idx}
                    onClick={() => scrollToSection(r.id)}
                    className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    <p className="text-xs font-semibold text-gray-500">
                      {r.section}
                    </p>

                    <p
                      className="text-sm font-medium text-gray-900"
                      dangerouslySetInnerHTML={{
                        __html: highlight(r.title, query),
                      }}
                    />

                    <p
                      className="text-xs text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: highlight(r.snippet, query),
                      }}
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 p-2">No results found</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
