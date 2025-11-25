"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  MessageSquare,
  Workflow,
  BrainCircuit,
  PlugZap,
  ShoppingBag,
  Building2,
  HeartPulse,
  Users,
  BookOpen,
  BadgeCheck,
  FileText,
  PanelsTopLeft,
 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Subnav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggle = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="w-full sticky   top-[72px] z-40 border-b border-gray-200/60 backdrop-blur-xl bg-white/70 ">
      
      {/* MAIN SUBNAV BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-4 sm:gap-6 md:gap-10 text-gray-700 font-medium overflow-x-auto">
        
        <SubnavButton
          label="Services"
          open={openMenu === "services"}
          onClick={() => toggle("services")}
         
        />

        <SubnavButton
          label="Industries"
          open={openMenu === "industries"}
          onClick={() => toggle("industries")}
        />

        <SubnavButton
          label="Resources"
          open={openMenu === "resources"}
          onClick={() => toggle("resources")}
        />

        <Link
          href="/pricing"
          className="hover:text-black transition font-semibold whitespace-nowrap text-sm sm:text-base"
        >
          Pricing
        </Link>
      </div>

      {/* ===========================
           DESKTOP DROPDOWN
      ============================ */}
      <AnimatePresence>
        {openMenu && (
          <DropdownWrapper>
            {openMenu === "services" && <ServicesMegaMenu />}
            {openMenu === "industries" && <IndustriesMegaMenu />}
            {openMenu === "resources" && <ResourcesMegaMenu />}
          </DropdownWrapper>
        )}
      </AnimatePresence>

      {/* ===========================
           MOBILE DRAWER
      ============================ */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-xl"
          >
            <div className="p-4 space-y-6">
              {openMenu === "services" && <ServicesMegaMenu mobile />}
              {openMenu === "industries" && <IndustriesMegaMenu mobile />}
              {openMenu === "resources" && <ResourcesMegaMenu mobile />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===========================
   Subnav Button Component
=========================== */
function SubnavButton({
  label,
  open,
  onClick,
}: {
  label: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 hover:text-black transition relative font-semibold whitespace-nowrap text-sm sm:text-base"
    >
      {label}
      <ChevronDown
        className={`h-4 w-4 transition duration-300 ${
          open ? "rotate-180 text-black" : "text-gray-500"
        }`}
      />
    </button>
  );
}

/* ===========================
   Dropdown Wrapper
=========================== */
function DropdownWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="
        hidden md:block absolute left-0 w-full 
        bg-white/80 backdrop-blur-2xl
        border-b border-gray-200/50
        shadow-[0_8px_40px_rgba(0,0,0,0.08)]
        z-30
      "
    >
      <div className="relative">
        {/* Glow Behind Dropdown */}
        <div className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-gray-100/40 to-transparent pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 relative z-20">
        {children}
      </div>
    </motion.div>
  );
}

/* ===========================
   Mega Menu Content
=========================== */

function Item({
  title,
  desc,
  href,
  Icon,
  mobile = false,
}: {
  title: string;
  desc: string;
  href: string;
  Icon: any;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        group block transition-all rounded-xl border border-gray-200
        ${
          mobile
            ? "p-4 bg-white shadow-sm"
            : "p-6 bg-white/50 backdrop-blur-xl shadow-sm hover:bg-white/80 hover:shadow-md"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-indigo-600 group-hover:text-indigo-700 transition" />
        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition">
          {title}
        </h3>
      </div>
      <p className="text-gray-600 text-sm mt-1">{desc}</p>
    </Link>
  );
}

/* ===========================
   Services Mega Menu
=========================== */
function ServicesMegaMenu({ mobile = false }) {
  return (
    <>
    <div className="cursor-pointer">
    <Item
        mobile={mobile}
        title="AI Chatbots"
        desc="Intelligent agents for support, sales & workflows."
        href="/services/chatbots"
        Icon={MessageSquare}
      />
    </div>
   <div className="cursor-pointer">
     
   <Item
        mobile={mobile}
        title="AI Automation"
        desc="Automate repetitive tasks & operations with AI."
        href="/services/automation"
        Icon={Workflow}
      />
   </div>

     <div className="cursor-pointer">
     <Item
        mobile={mobile}
        title="Custom AI Software"
        desc="AI-powered tools tailored for your business."
        href="/services/custom-ai"
        Icon={BrainCircuit}
      />
     </div>

      <div className="cursor-pointer">
      <Item
        mobile={mobile}
        title="AI Integrations"
        desc="Embed OpenAI/Claude models into your apps."
        href="/services/integration"
        Icon={PlugZap}
      />
      </div>
    </>
  );
}

/* ===========================
   Industries Mega Menu
=========================== */
function IndustriesMegaMenu({ mobile = false }) {
  return (
    <>
      <div>
      <Item
        mobile={mobile}
        title="E-Commerce"
        desc="AI for retail, conversions & product insights."
        href="/industries/ecommerce"
        Icon={ShoppingBag}
      />
      </div>

      <Item
        mobile={mobile}
        title="Real Estate"
        desc="Smart lead handling & property automation."
        href="/industries/real-estate"
        Icon={Building2}
      />

      <Item
        mobile={mobile}
        title="Healthcare"
        desc="HIPAA-friendly automations & patient tools."
        href="/industries/healthcare"
        Icon={HeartPulse}
      />

      <Item
        mobile={mobile}
        title="Agencies"
        desc="Scale client delivery & operations instantly."
        href="/industries/agencies"
        Icon={Users}
      />
    </>
  );
}

/* ===========================
   Resources Mega Menu
=========================== */
function ResourcesMegaMenu({ mobile = false }) {
  return (
    <>
      <Item
        mobile={mobile}
        title="Blog"
        desc="AI insights & articles for businesses."
        href="/blog"
        Icon={BookOpen}
      />

      <Item
        mobile={mobile}
        title="Case Studies"
        desc="See real results from WebAIGen clients."
        href="/case-studies"
        Icon={BadgeCheck}
      />

      <Item
        mobile={mobile}
        title="Guides"
        desc="Implementation guides & best practices."
        href="/guides"
        Icon={FileText}
      />

      <Item
        mobile={mobile}
        title="Documentation"
        desc="Technical docs & integrations."
        href="/docs"
        Icon={PanelsTopLeft}
      />
    </>
  );
}
