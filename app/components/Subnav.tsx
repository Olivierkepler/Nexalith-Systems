"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Subnav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="w-full backdrop-blur-xl bg-white/60 border-b border-white/40 shadow-sm relative z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-10">
        
        {/* Services */}
        <button
          onClick={() => toggleMenu("services")}
          className="flex items-center gap-1 text-gray-700 hover:text-black font-medium transition"
        >
          Services
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Industries */}
        <button
          onClick={() => toggleMenu("industries")}
          className="flex items-center gap-1 text-gray-700 hover:text-black font-medium transition"
        >
          Industries
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Resources */}
        <button
          onClick={() => toggleMenu("resources")}
          className="flex items-center gap-1 text-gray-700 hover:text-black font-medium transition"
        >
          Resources
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Pricing (no dropdown) */}
        <Link
          href="/pricing"
          className="text-gray-700 hover:text-black font-medium transition"
        >
          Pricing
        </Link>
      </div>

      {/* =======================
          DROPDOWNS
      ======================== */}

      <AnimatePresence>
        {openMenu === "services" && (
          <Dropdown>
            <DropdownItem title="AI Chatbots" desc="Custom-trained chatbots for support & sales." href="/services/chatbots" />
            <DropdownItem title="AI Automation" desc="Automate workflows and business processes." href="/services/automation" />
            <DropdownItem title="Custom AI Software" desc="Intelligent tools designed for your business." href="/services/custom-ai" />
            <DropdownItem title="AI Integration" desc="Integrate AI into your website or app." href="/services/integration" />
          </Dropdown>
        )}

        {openMenu === "industries" && (
          <Dropdown>
            <DropdownItem title="E-Commerce" desc="AI for online stores & customer cycles." href="/industries/ecommerce" />
            <DropdownItem title="Real Estate" desc="Automation for agents & listings." href="/industries/real-estate" />
            <DropdownItem title="Healthcare" desc="HIPAA-friendly AI tools & automation." href="/industries/healthcare" />
            <DropdownItem title="Agencies" desc="AI systems to scale client work." href="/industries/agencies" />
          </Dropdown>
        )}

        {openMenu === "resources" && (
          <Dropdown>
            <DropdownItem title="Blog" desc="Insights on AI trends & software." href="/blog" />
            <DropdownItem title="Case Studies" desc="Real results from real clients." href="/case-studies" />
            <DropdownItem title="Guides" desc="Learn to implement AI the right way." href="/guides" />
            <DropdownItem title="Documentation" desc="Learn how our systems work." href="/docs" />
          </Dropdown>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =======================
   DROPDOWN COMPONENT
======================= */

function Dropdown({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="
        absolute left-0 w-full bg-white/70 backdrop-blur-xl 
        shadow-lg border-b border-gray-300/30 z-30
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {children}
      </div>
    </motion.div>
  );
}

function DropdownItem({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link href={href} className="group block p-4 rounded-xl bg-white/40 hover:bg-white/60 shadow-sm hover:shadow-md border border-gray-200 transition-all">
      <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-indigo-600 transition">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </Link>
  );
}
