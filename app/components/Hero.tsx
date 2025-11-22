"use client";

import { motion } from "framer-motion"; 
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-indigo-300 opacity-30 blur-[200px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-orange-300 opacity-20 blur-[180px]" />
      </div>

      {/* Floating Grid */}
      <div className="absolute inset-0 opacity-[0.06] bg-[url('/grid.svg')] bg-center"></div>

      <div className="relative z-20 max-w-5xl text-center px-6 md:px-0">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm text-sm font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Powering modern businesses with AI
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="mt-6 text-5xl md:text-6xl font-bold tracking-tight leading-tight text-gray-900"
        >
          Build the Future with
          <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-orange-500 ml-3">
            Intelligent Software
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
        >
          WebAIGen helps businesses integrate cutting-edge AI into their apps,
          automate workflows, build chatbots, and create intelligent software 
          that scales with your vision.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => document.querySelector("#start")?.scrollIntoView()}
            className="px-8 py-4 bg-black text-white rounded-xl text-lg font-semibold shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all"
          >
            Get Started
          </button>

          <Link
            href="#services"
            className="px-8 py-4 border border-gray-300 bg-white rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all"
          >
            Explore Services
          </Link>
        </motion.div>
      </div>

      {/* Floating Orbs */}
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-28 right-36 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-[1px] opacity-80"
      />

      <motion.div
        animate={{ y: [0, 22, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-16 left-32 w-20 h-20 bg-gradient-to-tr from-orange-400 to-pink-400 rounded-full blur-[2px] opacity-70"
      />
    </section>
  );
}
