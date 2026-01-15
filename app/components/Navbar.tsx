"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, SearchIcon, X } from "lucide-react";


export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Docs", href: "/docs" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-black/40 border-b border-transparent">
      {/* Gradient Border */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-black/20 to-transparent" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        
        {/* Brand Section (Like Your Hero Nav) */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-all duration-300"
        >
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden flex items-center justify-center shadow-sm bg-white dark:bg-zinc-900 transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.06]">
            <span >
              <img src="/logo1.png" alt="Nexalith Logo" width={40} height={40} className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden flex items-center justify-center shadow-sm bg-white  transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.06]" />
            </span>
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Explore · Create · Search
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-3 py-1.5 rounded-full border border-zinc-300/70 dark:border-zinc-700/70 bg-white/60 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}

          {/* Search button like original */}
          <Link
            href="/search"
            className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-zinc-300/70 dark:border-zinc-700/70 bg-white/60 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-sm"
          >
           <SearchIcon className="h-5 w-5 text-gray-700" />
            <span>Search</span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 border border-zinc-300/70 dark:border-zinc-700/70 rounded px-1 py-0.5">
              ⌘K / Ctrl+K
            </span>
          </Link>

         
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-md cursor-pointer border border-gray-300 hover:border-black transition"
          aria-label="Toggle Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white/90 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex flex-col px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-700 dark:text-zinc-200 text-base font-medium hover:text-black dark:hover:text-white transition"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Search shortcut link */}
            <Link
              href="/search"
              className="flex items-center gap-2 text-gray-700 dark:text-zinc-200 text-base hover:text-black dark:hover:text-white transition"
              onClick={() => setOpen(false)}
            >
              Search
              <span className="text-[10px] border border-zinc-300/70 dark:border-zinc-700/70 rounded px-1 py-0.5 text-zinc-500 dark:text-zinc-400">
                ⌘K / Ctrl+K
              </span>
            </Link>

          
          </div>
        </div>
      )}
    </header>
  );
}
