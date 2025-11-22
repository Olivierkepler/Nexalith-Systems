"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
   
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-transparent">
      {/* Gradient Border */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-black/20 to-transparent" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          {/* YourBrand */}
          <img src="/logo1.png" alt="Nexalith Logo" width={60} height={60} />
          <span className="text-xl font-semibold tracking-tight">WebAIGen</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative text-sm font-medium text-gray-700 hover:text-black transition"
            >
              {item.label}

              {/* Hover Underline */}
              <span className="absolute left-0 -bottom-1 h-[1.5px] w-0 bg-black transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-md cursor-pointer border border-gray-300 hover:border-black transition"
          aria-label="Toggle Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
          <div className="flex flex-col px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-700 text-base font-medium hover:text-black transition"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
