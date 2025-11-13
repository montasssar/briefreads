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
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 border-b supports-backdrop-filter:bg-white/55 backdrop-blur"
    >
      <div className="mx-auto max-w-6xl h-16 px-4 flex items-center justify-between gap-4">
        {/* Brand + Title */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-xl px-2 py-1"
          aria-label="Go to home"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 bg-[rgba(250,247,241,.85)] group-hover:bg-[rgba(250,247,241,.95)] transition">
            <Feather className="h-4 w-4 text-stone-700" />
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight">
            YOUR WARM HOME OF WORDS
          </span>
        </Link>

        {/* Right side: Links + Author filter */}
        <div className="flex items-center gap-2">
          {/* Links */}
          <a
            href="https://github.com/montasssar"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-3 py-1.5 text-sm font-serif opacity-90 hover:opacity-100 hover:bg-white transition"
          >
            <BookOpen className="h-4 w-4 opacity-70" />
            GitHub
          </a>
          <a
            href="https://openlibrary.org/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-3 py-1.5 text-sm font-serif opacity-90 hover:opacity-100 hover:bg-white transition"
          >
            <BookOpen className="h-4 w-4 opacity-70" />
            Open Library
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
              className="w-44 md:w-56 rounded-full border border-stone-300 bg-[rgba(255,255,255,.9)] px-3 pr-8 py-1.5 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-stone-400/40"
            />
            {f.author && (
              <button
                onClick={() => f.setAuthor("")}
                aria-label="Clear author input"
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full ${
                  focused
                    ? "opacity-100 bg-stone-100 hover:bg-stone-200"
                    : "opacity-80 hover:opacity-100"
                } transition`}
              >
                <X className="h-4 w-4 text-stone-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subtle parchment underline */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-stone-300/60 to-transparent" />
    </motion.header>
  );
}
