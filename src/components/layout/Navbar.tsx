"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Feather, X, LogIn, LogOut, Menu } from "lucide-react";
import { useFilters } from "@/hooks/useFilters";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const f = useFilters();
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const userInitial =
    user?.displayName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase();

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

        {/* Right side: OpenLibrary + author search + auth + menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* OpenLibrary button */}
          <a
            href="https://openlibrary.org/"
            target="_blank"
            rel="noreferrer"
            className="
              hidden xs:inline-flex items-center gap-1 sm:gap-2
              rounded-full border border-stone-300
              bg-white/80 px-2.5 sm:px-3 py-1.5
              text-[11px] sm:text-sm font-serif
              opacity-90 hover:opacity-100 hover:bg-white
              transition
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 opacity-90"
            >
              <path d="M3 4v16l9-2 9 2V4l-9 2-9-2zm2 2.3l7 1.6 7-1.6v11.4l-7-1.6-7 1.6V6.3z" />
            </svg>
            <span className="hidden sm:inline">Open Library</span>
          </a>

          {/* Author Search */}
          <div className="relative">
            <input
              value={f.author}
              onChange={(e) => f.setAuthor(e.target.value)}
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
                className="
                  absolute right-2 top-1/2 -translate-y-1/2
                  p-0.5 rounded-full
                  opacity-80 hover:opacity-100
                  bg-transparent hover:bg-stone-100
                  transition
                "
              >
                <X className="h-3.5 w-3.5 text-stone-600" />
              </button>
            )}
          </div>

          {/* Auth controls */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* Text info only on sm+ */}
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-[10px] font-serif opacity-60">
                  Signed in as
                </span>
                <span className="text-[11px] font-serif font-medium truncate max-w-[130px]">
                  {user.displayName ?? user.email}
                </span>
              </div>

              <div className="inline-flex items-center gap-1">
                {/* Avatar */}
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-xs font-semibold text-stone-50 shadow-sm">
                  {userInitial}
                </span>

                {/* Mobile: icon-only sign out (always visible on small screens) */}
                <button
                  type="button"
                  onClick={signOutUser}
                  disabled={loading}
                  aria-label="Sign out"
                  className="
                    inline-flex sm:hidden items-center justify-center
                    h-8 w-8 rounded-full
                    border border-stone-300
                    bg-white/80 text-stone-700
                    hover:bg-white transition
                    disabled:opacity-60
                  "
                >
                  <LogOut className="h-4 w-4" />
                </button>

                {/* Desktop: text button */}
                <button
                  type="button"
                  onClick={signOutUser}
                  disabled={loading}
                  className="
                    hidden sm:inline-flex items-center gap-1
                    rounded-full border border-stone-300
                    bg-white/80 px-3 py-1
                    text-[11px] font-serif
                    hover:bg-white transition
                    disabled:opacity-60
                  "
                >
                  <LogOut className="h-3 w-3" />
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={loading}
              className="
                inline-flex items-center gap-1
                rounded-full border border-stone-300
                bg-stone-900 text-stone-50
                px-3 py-1.5
                text-[11px] sm:text-sm font-serif
                shadow-sm hover:bg-stone-800
                transition disabled:opacity-60
              "
            >
              <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{loading ? "Connecting…" : "Sign in"}</span>
            </button>
          )}

          {/* Menu icon (About / My Poems / Saved Quotes) */}
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="
              inline-flex items-center justify-center
              h-8 w-8 rounded-full
              border border-stone-300 bg-white/80
              hover:bg-white transition
            "
          >
            <Menu className="h-4 w-4 text-stone-700" />
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <nav className="border-t border-stone-200/80 bg-[rgba(253,247,236,0.96)] backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-3 sm:px-4 py-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
            <Link
              href="/about"
              className="text-sm font-serif text-stone-800 hover:underline underline-offset-4"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/poems"
              className="text-sm font-serif text-stone-800 hover:underline underline-offset-4"
              onClick={() => setMenuOpen(false)}
            >
              My Poems
            </Link>
            <Link
              href="/saved"
              className="text-sm font-serif text-stone-800 hover:underline underline-offset-4"
              onClick={() => setMenuOpen(false)}
            >
              Saved quotes
            </Link>
          </div>
        </nav>
      )}

      <div className="h-px w-full bg-linear-to-r from-transparent via-stone-300/70 to-transparent" />
    </motion.header>
  );
}
