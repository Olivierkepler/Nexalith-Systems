"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Workflow,
  BarChart3,
  ShieldCheck,
  Cpu,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "Smart AI Chatbots",
    description:
      "Intelligent conversational agents trained on your data to automate support, sales, onboarding, and more.",
    icon: Bot,
  },
  {
    title: "Workflow Automation",
    description:
      "Automate repetitive business processes with AI-driven workflows and event-based triggers.",
    icon: Workflow,
  },
  {
    title: "Advanced Analytics",
    description:
      "Use AI to extract insights from customer data, uncover patterns, and drive smarter decisions.",
    icon: BarChart3,
  },
  {
    title: "Enterprise-Grade Security",
    description:
      "Your data stays encrypted, protected, and fully compliant with enterprise standards.",
    icon: ShieldCheck,
  },
  {
    title: "Custom AI Systems",
    description:
      "We build AI tools tailored to your specific business workflows and industry requirements.",
    icon: Cpu,
  },
  {
    title: "Lightning-Fast Deployment",
    description:
      "Launch AI-powered features faster than ever with our optimized integration pipeline.",
    icon: Zap,
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-16 sm:py-20 md:py-28 bg-white">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-indigo-200 opacity-20 blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 px-2"
        >
          Powerful Features for Modern AI Experiences
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2"
        >
          WebAIGen equips your business with advanced automation, intelligent chat systems, and custom AI integrations — built for performance and scale.
        </motion.p>

        {/* Features Grid */}
        <div className="mt-10 sm:mt-12 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="
                p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-200 
                bg-white/70 backdrop-blur-xl 
                shadow-sm hover:shadow-xl 
                transition-all hover:-translate-y-2
              "
            >
              {/* Icon */}
              <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-600 mb-4 sm:mb-6" />

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-2 sm:mt-3 text-gray-600 leading-relaxed text-xs sm:text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
