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

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        
     {/* Brand Logo */}
<Link
  href="/"
  className="
    flex items-center gap-2 sm:gap-3 group
    transition-all duration-300
  "
>
  {/* Logo Image */}
  <div
    className="
      h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden flex items-center justify-center
      shadow-sm bg-white
      transition-all duration-300
      group-hover:shadow-md group-hover:scale-[1.06]
    "
  >
    <img
      src="/logo1.png"
      alt="WebAIGen Logo"
      width={48}
      height={48}
      className="object-contain"
    />
  </div>

  {/* Text */}
  <span
    className="
      text-xl sm:text-2xl font-semibold tracking-tight 
      flex items-center gap-1
      transition-all duration-300 
      group-hover:text-black
    "
  >
      Web<span className="text-orange-500 group-hover:text-orange-600 transition">AI</span>Gen</span>
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
