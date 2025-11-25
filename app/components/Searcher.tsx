"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearcherProps {
  onSearch?: (query: string) => void;
}

export default function Searcher({ onSearch }: SearcherProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="relative">
      {/* Search Icon Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-200/40 transition"
          aria-label="Open Search"
        >
          <Search className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {/* Search Box */}
      {open && (
        <div className="absolute right-0 top-0 bg-white shadow-lg rounded-xl border border-gray-200 p-2 flex items-center gap-2 w-64 sm:w-72 z-50">
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="Search website..."
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              onSearch?.(v);
            }}
          />

          <button
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
            className="p-1 rounded-full hover:bg-gray-200/50 transition"
            aria-label="Close Search"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
}
