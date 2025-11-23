"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero({ openConsultation }: { openConsultation: () => void }) {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-white text-gray-900">
      
      {/* Soft background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-indigo-300/20 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-300/15 blur-[160px]" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-5xl text-center px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200 bg-white shadow-sm text-xs sm:text-sm text-gray-600"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Powering modern AI software
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 px-2"
        >
          Build the Future with{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-orange-500 bg-clip-text text-transparent">
            Intelligent Software
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-2"
        >
          WebAIGen helps businesses integrate cutting-edge AI into their apps,
          automate workflows, create chatbots, and build intelligent systems designed for growth.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-2"
        >
          <button
            onClick={openConsultation}
            className="px-6 sm:px-8 py-2.5 sm:py-4 bg-gray-900 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto"
          >
            Request Consultation
          </button>

          <Link
            href="#services"
            className="px-6 sm:px-8 py-2.5 sm:py-4 border border-gray-300 text-gray-700 text-base sm:text-lg font-semibold rounded-xl hover:bg-gray-100 transition w-full sm:w-auto text-center"
          >
            Explore Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
