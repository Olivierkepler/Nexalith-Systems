"use client";

import Chatbot from "./components/Chatbot";
import { motion } from "framer-motion";
import content from "@/content/home.json";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-black dark:to-zinc-950 font-sans p-4">
      <div className="w-full mt-16 max-w-7xl flex flex-col gap-10">

        {/* Hero Section */}
        <motion.section
          id="hero-section"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-72 sm:h-80 md:h-96 rounded-3xl bg-white/70 dark:bg-zinc-900/70 shadow-xl backdrop-blur-xl border border-zinc-300/40 dark:border-zinc-700/40 hover:shadow-2xl transition-all duration-500"
        >
          <div className="absolute inset-0 p-6 flex flex-col justify-center">
            <h1 className="text-2xl md:text-4xl font-bold text-zinc-900 dark:text-white">
              {content.hero.title}
            </h1>
            <p className="mt-2 text-zinc-700 dark:text-zinc-300">
              {content.hero.subtitle}
            </p>
          </div>
        </motion.section>

        {/* Feature Grid Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.features.map((feature, i) => (
            <motion.div
              id={`feature-${i}`}
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative h-40 sm:h-44 md:h-48 rounded-3xl bg-white/70 dark:bg-zinc-900/70 shadow-lg backdrop-blur-xl border border-zinc-300/40 dark:border-zinc-700/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
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

        {/* Wide Centerpiece Section */}
        <motion.section
          id="centerpiece-section"
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

        {/* Additional Grid Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.grid.map((item, i) => (
            <motion.div
              id={`grid-${i}`}
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative h-56 sm:h-60 md:h-64 rounded-3xl bg-white/70 dark:bg-zinc-900/70 shadow-lg backdrop-blur-xl border border-zinc-300/40 dark:border-zinc-700/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
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

        {/* Chatbot Floating */}
        <div className="fixed bottom-0 right-6 z-50">
          <Chatbot />
        </div>

        {/* Footer Section */}
        <motion.footer
          id="footer-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-20 sm:h-24 rounded-3xl bg-white/70 dark:bg-zinc-900/70 shadow-xl backdrop-blur-xl border border-zinc-300/40 dark:border-zinc-700/40"
        >
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <p className="text-center text-sm text-zinc-700 dark:text-zinc-300">
              {content.footer.text}
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
