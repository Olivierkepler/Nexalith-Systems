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
    <section id="pricing" className="py-16 sm:py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 px-2"
        >
          Simple, Transparent Pricing
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2"
        >
          Choose the plan that fits your needs — upgrade anytime.
        </motion.p>

        {/* Billing Toggle */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                billing === "monthly" ? "bg-white shadow" : "text-gray-500"
              }`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>

            <button
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                billing === "yearly" ? "bg-white shadow" : "text-gray-500"
              }`}
              onClick={() => setBilling("yearly")}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="mt-10 sm:mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {activePlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                rounded-xl sm:rounded-2xl border p-6 sm:p-8 bg-white/70 backdrop-blur-xl shadow-sm transition 
                ${
                  plan.highlight
                    ? "border-indigo-500 shadow-xl md:scale-[1.03]"
                    : "border-gray-200"
                }
              `}
            >
              {/* Plan Name */}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">{plan.description}</p>

              {/* Price */}
              <div className="mt-4 sm:mt-6 flex items-end justify-center gap-1">
                <p className="text-4xl sm:text-5xl font-bold text-gray-900">
                  {plan.price}
                </p>
                <span className="text-gray-500 mb-1 sm:mb-2 text-sm sm:text-base">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="mt-6 sm:mt-8 space-y-2 sm:space-y-3 text-left">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-gray-700 text-xs sm:text-sm">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="mt-6 sm:mt-8">
                <button
                  onClick={() =>
                    plan.name === "Enterprise"
                      ? openConsultation()
                      : null
                  }
                  className={`
                    w-full py-2.5 sm:py-3 rounded-xl font-semibold flex justify-center items-center gap-1 text-sm sm:text-base
                    ${
                      plan.highlight
                        ? "bg-indigo-600 text-white hover:bg-indigo-500"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }
                  `}
                >
                  {plan.buttonText}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
