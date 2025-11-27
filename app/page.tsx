"use client";

import { useEffect, useState } from "react";
import Chatbot from "./components/Chatbot";
import { motion } from "framer-motion";
import Searcher from "./components/Searcher";

export default function HomePage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load CMS from Gist via API route
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/content/home", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch home content");
        setContent(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-600 dark:text-zinc-300">
        Loading content…
      </div>
    );

  if (!content)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Could not load content from CMS (home.json)
      </div>
    );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-black dark:to-zinc-950 font-sans p-4">
      <div className="w-full max-w-7xl flex flex-col gap-10">

        {/* Top Navigation */}
        <header className="flex items-center justify-between px-2 sm:px-1">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-xs font-bold text-white dark:text-zinc-900">
              W
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                WebAIGen
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Explore · Create · Search
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-2 text-xs sm:text-sm">
            <Searcher />
          </nav>
        </header>

        {/* Hero Section */}
        <motion.section
          id="hero-section"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-72 sm:h-80 md:h-96 rounded-3xl bg-white/70 dark:bg-zinc-900/70 shadow-xl backdrop-blur-xl border border-zinc-300/40 dark:border-zinc-700/40 hover:shadow-2xl transition-all duration-500"
        >
          <div className="absolute inset-0 p-6 flex flex-col justify-center gap-2">
            <h1 className="text-2xl md:text-4xl font-bold text-zinc-900 dark:text-white">
              {content.hero.title}
            </h1>
            <p className="mt-1 text-zinc-700 dark:text-zinc-300">
              {content.hero.subtitle}
            </p>
            <p className="mt-3 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Press <span className="border rounded px-1 py-0.5 text-[11px]">⌘K</span> or{" "}
              <span className="border rounded px-1 py-0.5 text-[11px]">Ctrl+K</span> anytime to search.
            </p>
          </div>
        </motion.section>

        {/* Feature Grid Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.features.map((feature: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative h-40 sm:h-44 md:h-48 rounded-3xl bg-white/70 dark:bg-zinc-900/70 shadow-lg backdrop-blur-xl border border-zinc-300/40 dark:border-zinc-700/40 hover:scale-[1.03] transition-all duration-300"
            >
              <div className="absolute inset-0 p-4">
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  {feature.text}
                </p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Centerpiece */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-64 sm:h-72 md:h-80 rounded-3xl bg-white/70 dark:bg-zinc-900/70 shadow-xl backdrop-blur-xl border border-zinc-300/40 dark:border-zinc-700/40 hover:shadow-2xl transition-all duration-500"
        >
          <div className="absolute inset-0 p-6 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900 dark:text-white">
              {content.centerpiece.title}
            </h2>
            <p className="mt-2 text-zinc-700 dark:text-zinc-300">
              {content.centerpiece.text}
            </p>
          </div>
        </motion.section>

        {/* Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.grid.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative h-56 sm:h-60 md:h-64 rounded-3xl bg-white/70 dark:bg-zinc-900/70 shadow-lg backdrop-blur-xl border border-zinc-300/40 dark:border-zinc-700/40 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 p-4 flex flex-col">
                <h3 className="font-semibold text-xl text-zinc-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Chatbot */}
        <div className="fixed bottom-0 right-6 z-50">
          <Chatbot />
        </div>
      </div>
    </div>
  );
}
