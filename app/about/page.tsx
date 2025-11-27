"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Layers, Orbit } from "lucide-react";

type AboutContent = {
  title: string;
  description: string;
  secondary: string;
  vision: {
    title: string;
    text: string;
  };
};

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/content/about", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load about content");
        const data = (await res.json()) as AboutContent;
        setContent(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message ?? "Failed to load about content");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const title = content?.title ?? "About";
  const description =
    content?.description ??
    "Welcome to Nexalith — a refined digital environment built with purpose.";
  const secondary =
    content?.secondary ??
    "Nexalith continuously evolves with intelligent search, semantic indexing, adaptive UI components, real-time interactions, and deeply immersive user flows.";
  const visionTitle = content?.vision?.title ?? "Our Vision";
  const visionText =
    content?.vision?.text ??
    "We aim to create digital experiences that feel effortless, elevated, and emotionally resonant.";

  return (
    <div className="relative max-w-7xl mx-auto py-32 px-6 transition-colors duration-300 bg-white dark:bg-gray-950 overflow-hidden">
      {/* Background Gradient Layers */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black" />
      <div className="absolute top-[-5rem] right-[-5rem] w-[28rem] h-[28rem] bg-gradient-to-br from-indigo-300/40 to-purple-300/40 dark:from-indigo-600/20 dark:to-purple-600/20 blur-3xl rounded-full -z-10" />
      <div className="absolute bottom-[-6rem] left-[-6rem] w-[32rem] h-[32rem] bg-gradient-to-tr from-pink-200/40 to-rose-300/40 dark:from-pink-600/20 dark:to-rose-600/20 blur-3xl rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-16"
      >
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-5 drop-shadow-sm"
        >
          {title}
        </motion.h1>

        {/* Loading / Error State */}
        {loading && (
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Loading about page…
          </p>
        )}
        {error && !loading && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Main Description */}
        {!loading && (
          <>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-700 dark:text-gray-300 leading-relaxed text-2xl max-w-4xl"
            >
              {description}
            </motion.p>

            {/* Secondary Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-700 dark:text-gray-300 leading-relaxed text-2xl max-w-4xl"
            >
              {secondary}
            </motion.p>

            {/* Vision Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-20 p-14 rounded-3xl bg-white dark:bg-gray-900 shadow-2xl shadow-gray-300/30 dark:shadow-black/50 border border-gray-200 dark:border-gray-800 backdrop-blur-xl"
            >
              <h2 className="text-4xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-4">
                <Globe className="w-9 h-9 text-indigo-600 dark:text-indigo-300" />
                {visionTitle}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-xl leading-relaxed max-w-3xl">
                {visionText}
              </p>
            </motion.div>

            {/* Hero Graphic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-24 flex justify-center"
            >
              <div className="relative w-full max-w-4xl h-80 rounded-3xl overflow-hidden shadow-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700">
                <Orbit className="absolute bottom-10 right-10 w-20 h-20 text-white/70" />
                <Layers className="absolute top-10 left-10 w-20 h-20 text-white/40" />
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
