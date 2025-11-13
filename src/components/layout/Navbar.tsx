// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Feather, BookOpen, X } from "lucide-react";
import { useFilters } from "@/hooks/useFilters";
import { useState } from "react";

export default function Navbar() {
  const f = useFilters();
  const [focused, setFocused] = useState(false);

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="
        sticky top-0 z-50
        border-b border-stone-200/80
        bg-[rgba(253,247,236,0.9)]
        backdrop-blur
        shadow-[0_6px_12px_rgba(15,23,42,0.06)]
      "
    >
      <div
        className="
          mx-auto max-w-6xl
          h-14 sm:h-16
          px-3 sm:px-4
          flex items-center justify-between gap-3 sm:gap-4
        "
      >
        {/* Brand + Title */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-xl px-1.5 py-1"
          aria-label="Go to home"
        >
          <span
            className="
              inline-flex h-8 w-8 items-center justify-center
              rounded-full border border-stone-300
              bg-[rgba(250,247,241,.95)]
              group-hover:bg-[rgba(250,247,241,1)]
              transition
            "
          >
            <Feather className="h-4 w-4 text-stone-700" />
          </span>
          <span
            className="
              hidden xs:inline-block
              font-serif font-semibold tracking-tight
              text-sm sm:text-base text-stone-800
            "
          >
            YOUR WARM HOME OF WORDS
          </span>
        </Link>

        {/* Right side: Links + Author filter */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* GitHub */}
          <a
            href="https://github.com/montasssar"
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex items-center gap-1 sm:gap-2
              rounded-full border border-stone-300
              bg-white/80 px-2.5 sm:px-3 py-1.5
              text-[11px] sm:text-sm font-serif
              opacity-90 hover:opacity-100 hover:bg-white
              transition
            "
          >
            <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-70" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          {/* Open Library */}
          <a
            href="https://openlibrary.org/"
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex items-center gap-1 sm:gap-2
              rounded-full border border-stone-300
              bg-white/80 px-2.5 sm:px-3 py-1.5
              text-[11px] sm:text-sm font-serif
              opacity-90 hover:opacity-100 hover:bg-white
              transition
            "
          >
            <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-70" />
            <span className="hidden sm:inline">Open Library</span>
          </a>

          {/* Author search with Clear (X) button */}
          <div className="relative">
            <input
              value={f.author}
              onChange={(e) => f.setAuthor(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Author…"
              aria-label="Filter quotes by author"
              className="
                w-28 xs:w-32 sm:w-40 md:w-56
                rounded-full border border-stone-300
                bg-[rgba(255,255,255,.96)]
                px-3 pr-8 py-1.5
                text-xs sm:text-sm font-serif
                focus:outline-none focus:ring-2 focus:ring-stone-400/40
              "
            />
            {f.author && (
              <button
                onClick={() => f.setAuthor("")}
                aria-label="Clear author input"
                className={`
                  absolute right-2 top-1/2 -translate-y-1/2
                  p-0.5 rounded-full
                  ${
                    focused
                      ? "opacity-100 bg-stone-100 hover:bg-stone-200"
                      : "opacity-80 hover:opacity-100"
                  }
                  transition
                `}
              >
                <X className="h-3.5 w-3.5 text-stone-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subtle underline */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-stone-300/70 to-transparent" />
    </motion.header>
  );
}
