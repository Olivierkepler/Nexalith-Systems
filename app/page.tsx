"use client";

import { useEffect, useState } from "react";
import Chatbot from "./components/Chatbot";
import { motion } from "framer-motion";
import CommandPalette, { SearchItem } from "./components/CommandPalette";
import { SearchIcon } from "lucide-react";

export default function HomePage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔍 Command Palette State
  const [index, setIndex] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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

  // 🔍 Load search index for Command Palette
  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data: SearchItem[]) => setIndex(data))
      .catch(console.error);
  }, []);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
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
<header className="lg:hidden px-4 py-3 flex justify-center">

<motion.button
  onClick={() => setIsOpen(true)}
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  whileTap={{ scale: 0.97 }}
  className="
    relative
    w-full max-w-sm
    flex items-center justify-between
    px-4 py-2.5
    rounded-2xl
    bg-white/60 dark:bg-zinc-900/60
    backdrop-blur-xl
    border border-zinc-300/70 dark:border-zinc-700/70
    shadow-[0_2px_10px_rgba(0,0,0,0.10)]
    dark:shadow-[0_2px_10px_rgba(0,0,0,0.55)]
    overflow-hidden
  "
>

  {/* Magical Animated Glow */}
  <motion.div
    className="absolute inset-0 rounded-2xl pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0.15, 0.45, 0.15],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      repeatType: "mirror",
    }}
    style={{
      background:
        "radial-gradient(120% 150% at 50% -20%, rgba(255,255,255,0.45), rgba(0,0,0,0) 70%)",
    }}
  />

  {/* Shimmer beam */}
  <motion.div
    className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
    animate={{
      x: ["-150%", "150%"],
    }}
    transition={{
      duration: 3.5,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    }}
  />

  {/* Left side: icon + text */}
  <div className="flex items-center gap-2 z-10">
    <SearchIcon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
      Search the universe…
    </span>
  </div>

  {/* Shortcut badge */}
  <kbd
    className="
      hidden xs:flex z-10
      items-center gap-1
      px-2 py-0.5
      rounded-md
      text-[10px]
      font-medium
      border border-zinc-300/80 dark:border-zinc-700/80
      bg-white/30 dark:bg-zinc-800/40
      text-zinc-500 dark:text-zinc-400
    "
  >
    ⌘K
  </kbd>

</motion.button>
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

        {/* 🔍 Command Palette Modal (global) */}
        <CommandPalette
          index={index}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </div>
  );
}
