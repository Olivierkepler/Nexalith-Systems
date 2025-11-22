"use client";

import { motion } from "framer-motion";
import NeuralNetworkScene from "./NeuralNetwork";

export default function Hero3D({ openConsultation }: { openConsultation: () => void }) {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">

      {/* 3D Neural Network */}
      <NeuralNetworkScene />

      {/* Soft overlay for readability */}
      <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px] z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center px-6">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-white/80 text-sm text-gray-600 shadow-sm"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Powering the next generation of AI-driven software
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900"
        >
          Transform Your Business With{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-orange-500 bg-clip-text text-transparent">
            Neural AI Systems
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto"
        >
          WebAIGen designs powerful AI architectures — from intelligent chatbots to deeply connected neural networks that automate, optimize, and scale your operations.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={openConsultation}
            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
          >
            Request Consultation
          </button>

          <button
            onClick={() =>
              document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 border border-gray-300 text-gray-800 rounded-xl font-semibold text-lg hover:bg-gray-100 transition"
          >
            Explore Services
          </button>
        </motion.div>
      </div>
    </section>
  );
}
