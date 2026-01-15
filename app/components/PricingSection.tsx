"use client";

import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const plans = {
  monthly: [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      highlight: false,
      description: "Perfect for small projects and testing AI features.",
      features: [
        "Basic AI chatbot",
        "Up to 200 messages/month",
        "Email support",
        "Community resources",
      ],
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "$49",
      period: "/month",
      highlight: true,
      description: "Grow your business with advanced AI automation tools.",
      features: [
        "Advanced AI chatbot",
        "Unlimited conversations",
        "Workflow automation",
        "Analytics dashboard",
        "Priority support",
      ],
      buttonText: "Upgrade to Pro",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      highlight: false,
      description: "Custom AI systems built for large organizations.",
      features: [
        "Full AI ecosystem",
        "Custom integrations",
        "Dedicated infrastructure",
        "Onboarding & team training",
        "24/7 priority support",
      ],
      buttonText: "Request Consultation",
    },
  ],
  yearly: [
    {
      name: "Starter",
      price: "$0",
      period: "/year",
      highlight: false,
      description: "Great for learning AI capabilities.",
      features: [
        "Basic AI chatbot",
        "Up to 200 messages/month",
        "Email support",
        "Community resources",
      ],
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "$499",
      period: "/year",
      highlight: true,
      description: "Save 15% when paid yearly.",
      features: [
        "Advanced AI chatbot",
        "Unlimited conversations",
        "Workflow automation",
        "Analytics dashboard",
        "Priority support",
      ],
      buttonText: "Upgrade to Pro",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      highlight: false,
      description: "Tailored solutions for enterprise needs.",
      features: [
        "Full AI ecosystem",
        "Custom integrations",
        "Dedicated infrastructure",
        "Team training & onboarding",
        "24/7 priority support",
      ],
      buttonText: "Request Consultation",
    },
  ],
};

export default function PricingSection({ openConsultation }: { openConsultation: () => void }) {
  const [billing, setBilling] = useState("monthly");

  const activePlans = plans[billing as keyof typeof plans];

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 rounded-3xl shadow-lg dark:shadow-zinc-800/50 text-gray-900 dark:text-white">

      {/* Background mesh gradient */}
      <div className="  absolute inset-0 bg-white dark:bg-zinc-900 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white"
        >
          Simple, Transparent Pricing
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-gray-600 text-sm sm:text-base max-w-2xl mx-auto dark:text-zinc-400"
        >
          Choose the plan that fits your workflow. No hidden fees. Cancel anytime.
        </motion.p>

        {/* Billing Toggle */}
        <div className="mt-10 flex justify-center">
          <div className="flex items-center bg-gray-200/60 backdrop-blur-lg rounded-2xl p-1 shadow-inner border border-gray-300/40 dark:bg-zinc-800/60 dark:border-zinc-700/40">
            <button
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                billing === "monthly"
                  ? "bg-white shadow-md text-gray-900 dark:bg-zinc-900 dark:text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>

            <button
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                billing === "yearly"
                  ? "bg-white shadow-md text-gray-900 dark:bg-zinc-900 dark:text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setBilling("yearly")}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {activePlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`
                rounded-2xl p-8 bg-white shadow-lg border
                backdrop-blur-xl transition-all duration-300
                hover:shadow-2xl hover:-translate-y-1 dark:hover:shadow-zinc-800/50 dark:hover:-translate-y-1
                ${
                  plan.highlight
                    ? "border-gray-200 shadow-lg scale-[1.04] dark:shadow-zinc-800/50"
                    : "border-gray-200 dark:border-zinc-700/40"
                }
              `}
            >
              {/* Plan Name */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{plan.description}</p>

              {/* Price */}
              <div className="mt-6 flex items-end justify-center gap-1">
                <p
                  className={`${
                    plan.highlight ? "text-indigo-600" : "text-gray-900"
                  } text-5xl font-extrabold`}
                >
                  {plan.price}
                </p>
                <span className="text-gray-500 text-sm mb-1 dark:text-zinc-400">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="mt-8 space-y-3 text-left">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-gray-700 text-sm dark:text-zinc-400"
                  >
                    <Check className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="mt-8">
                <button
                  onClick={() =>
                    plan.name === "Enterprise" ? openConsultation() : null
                  }
                  className={`
                    w-full py-3 rounded-xl font-semibold flex justify-center cursor-pointer
                    items-center gap-2 text-sm transition-all
                    ${
                      plan.highlight
                        ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-zinc-800/60 dark:hover:bg-zinc-700/60 dark:text-zinc-200 dark:hover:text-white"
                    }
                  `}
                >
                  {plan.buttonText}
                  <ChevronRight className="h-4 w-4 dark:text-zinc-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
