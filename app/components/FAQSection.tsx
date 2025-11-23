"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What services does WebAIGen offer?",
    a: "We provide AI chatbots, custom AI software, workflow automation, integrations, and end-to-end AI systems built for businesses of all sizes.",
  },
  {
    q: "How long does it take to build a custom AI solution?",
    a: "Most AI implementations take between 1–4 weeks depending on complexity. Full enterprise systems may take 4–8 weeks.",
  },
  {
    q: "Do I need technical knowledge to use your AI tools?",
    a: "No. We design everything to be simple and intuitive. Our team handles all the technical setup, deployment, and optimization.",
  },
  {
    q: "Can you integrate AI into my existing website or software?",
    a: "Absolutely. We can integrate AI with any website, CRM, dashboard, or custom platform — including React, Next.js, WordPress, Shopify, and more.",
  },
  {
    q: "Do you offer ongoing support or maintenance?",
    a: "Yes. All plans include support, and enterprise clients receive dedicated support, monitoring, updates, and optimization.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-28 bg-white">
      {/* Soft Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-indigo-200 opacity-20 blur-[180px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center px-2"
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-500 text-center max-w-2xl mx-auto px-2"
        >
          Everything you need to know about our AI solutions and services.
        </motion.p>

        {/* FAQ Accordion */}
        <div className="mt-10 sm:mt-12 md:mt-16 space-y-3 sm:space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl bg-white/70 backdrop-blur-xl shadow-sm"
            >
              {/* Question Button */}
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center cursor-pointer justify-between px-4 sm:px-6 py-4 sm:py-5 text-left gap-3 sm:gap-4"
              >
                <span className="text-gray-900 font-medium text-base sm:text-lg pr-2">
                  {item.q}
                </span>

                <ChevronDown
                  className={`
                    h-4 w-4 sm:h-5 sm:w-5 text-gray-600 transition-transform flex-shrink-0
                    ${openIndex === index ? "rotate-180" : ""}
                  `}
                />
              </button>

              {/* Animated Answer */}
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
