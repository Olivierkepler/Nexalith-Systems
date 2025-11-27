"use client";

import { useEffect, useState, useCallback } from "react";
import Fuse from "fuse.js";
import { AnimatePresence, motion } from "framer-motion";
import { Search as SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";

// Types
export type SearchItem = {
  title: string;
  slug: string;
  content: string;
};

type CommandPaletteProps = {
  index: SearchItem[];
  isOpen: boolean;
  onClose: () => void;
};

export default function CommandPalette({ index, isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const router = useRouter();

  // Fuse instance
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);

  useEffect(() => {
    if (!index.length) return;

    const f = new Fuse(index, {
      keys: ["title", "content"],
      threshold: 0.35,
      ignoreLocation: true,
    });

    setFuse(f);
  }, [index]);

  // Search on query change
  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      return;
    }

    const fuseResults = fuse.search(query.trim());
    setResults(fuseResults.map((r) => r.item));
  }, [query, fuse]);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      onClose();
      setQuery("");
      router.push(item.slug);
    },
    [router, onClose]
  );

  // Basic highlight
  const highlight = (text: string, q: string) => {
    if (!text) return "";
    if (!q.trim()) return text;

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "ig");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 rounded px-0.5">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24 dark:bg-zinc-900/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-xl rounded-2xl bg-white shadow-xl border border-gray-200 overflow-hidden dark:bg-zinc-900 dark:shadow-zinc-800 dark:border-zinc-700"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search bar */}
            <div className="flex items-center border-b px-4 py-2 gap-2">
              <SearchIcon className="w-4 h-4 text-gray-400 dark:text-zinc-400" />
              <input
                autoFocus
                className="flex-1 bg-transparent outline-none text-sm py-2 dark:text-zinc-400"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full dark:hover:text-zinc-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {!query.trim() && (
                <div className="px-4 py-6 text-center text-xs text-gray-400 dark:text-zinc-400">
                  Start typing to search. Use ↑ ↓ to move, Enter to open.
                </div>
              )}

              {query.trim() && results.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-zinc-400">
                  No results found.
                </div>
              )}

              {results.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex flex-col gap-1 dark:hover:bg-zinc-800"
                >
                  <span className="text-sm font-medium">
                    {highlight(item.title, query)}
                  </span>
                  <span className="text-xs text-gray-600 line-clamp-2 dark:text-zinc-400">
                    {highlight(item.content, query)}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
