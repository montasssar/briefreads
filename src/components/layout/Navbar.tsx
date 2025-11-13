"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Feather, X } from "lucide-react";
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
        {/* Brand */}
        <Link
          href="/"
          aria-label="Go to home"
          className="group inline-flex items-center gap-2 rounded-xl px-1.5 py-1"
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

        {/* Right side: icons + author search */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* --- GitHub Button (REAL SVG LOGO) --- */}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              className="h-4 w-4 opacity-90"
              fill="currentColor"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 
              7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49 
              -2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
              -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82
              .72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07
              -1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
              -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82 
              .64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 
              1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 
              2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75 
              -3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 
              1.93-.01 2.19 0 .21.15.46.55.38A8.012 8.012 
              0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>

            <span className="hidden sm:inline">GitHub</span>
          </a>

          {/* --- OpenLibrary Button (REAL SVG LOGO) --- */}
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
            {/* OpenLibrary minimal book logo (custom SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 opacity-90"
            >
              <path d="M3 4v16l9-2 9 2V4l-9 2-9-2zm2 2.3l7 1.6 
              7-1.6v11.4l-7-1.6-7 1.6V6.3z" />
            </svg>

            <span className="hidden sm:inline">Open Library</span>
          </a>

          {/* Author Search */}
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
                aria-label="Clear author"
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

      <div className="h-px w-full bg-linear-to-r from-transparent via-stone-300/70 to-transparent" />
    </motion.header>
  );
}
