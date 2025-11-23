"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Workflow,
  BrainCircuit,
  PlugZap,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "AI Chatbots",
    description: "Custom-trained AI chatbots for support, sales, onboarding & more.",
    icon: MessageSquare,
    href: "/services/chatbots",
  },
  {
    title: "AI Automation",
    description: "Automate time-consuming tasks and business workflows.",
    icon: Workflow,
    href: "/services/automation",
  },
  {
    title: "Custom AI Software",
    description: "Intelligent dashboards, tools, and internal systems built for scale.",
    icon: BrainCircuit,
    href: "/services/custom-ai",
  },
  {
    title: "AI Integration",
    description: "Integrate AI models into your website, mobile app, or platform.",
    icon: PlugZap,
    href: "/services/integration",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 sm:py-20 md:py-28 bg-white relative">
      {/* Background Tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 px-2"
        >
          AI Services Crafted for Modern Businesses
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2"
        >
          Transform your website, automate your workflows, and boost your performance 
          with powerful AI-driven solutions.
        </motion.p>

        {/* Services Grid */}
        <div className="mt-10 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="group bg-white/70 backdrop-blur-xl shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:-translate-y-2 transition-all"
            >
              {/* Icon */}
              <div className="h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-xl bg-gray-100 group-hover:bg-indigo-100 transition">
                <service.icon className="text-indigo-600 h-6 w-6 sm:h-7 sm:w-7" />
              </div>

              {/* Title */}
              <h3 className="mt-4 sm:mt-6 text-lg sm:text-xl font-semibold text-gray-900">
                {service.title}
              </h3>

              {/* Description */}
              <p className="mt-2 sm:mt-3 text-gray-600 text-xs sm:text-sm leading-relaxed">
                {service.description}
              </p>

              {/* Learn More */}
              <Link
                href={service.href}
                className="mt-4 sm:mt-6 inline-flex items-center text-indigo-600 font-medium group-hover:text-indigo-700 transition text-sm"
              >
                Learn more
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
