"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [index, setIndex] = useState([]);

  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data) => setIndex(data));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = index.filter((item: any) =>
      item.text.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query, index]);

  return (
    <div className="min-h-screen bg-gray-50 p-10 mt-16">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-10"
        >
          <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </motion.div>

        <div className="space-y-4">
          {results.map((item: any, i: number) => (
            <motion.a
              key={i}
              href={`/${item.page}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="block p-5 rounded-2xl bg-white shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{item.text}</p>
            </motion.a>
          ))}

          {query.trim() && results.length === 0 && (
            <p className="text-gray-500 text-center">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
