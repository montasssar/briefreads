"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Feather,
  Menu,
  X,
  LogIn,
  LogOut,
  ExternalLink,
  XCircle,
} from "lucide-react";
import { useFilters } from "@/hooks/useFilters";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { author, setAuthor } = useFilters();
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const userInitial =
    user?.displayName?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "";

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Sign in failed", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

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
      {/* Main bar */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:-translate-y-px transition"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white/90 shadow-sm">
            <Feather className="h-4 w-4 text-stone-800" />
          </span>

          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-serif text-sm sm:text-base font-semibold tracking-tight text-stone-900">
              BriefReads
            </span>
            <span className="text-[11px] text-stone-600 font-serif">
              YOUR WARM HOME OF WORDS
            </span>
          </span>
        </Link>

        {/* Right side cluster */}
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">

          {/* OpenLibrary */}
          <a
            href="https://openlibrary.org/"
            target="_blank"
            rel="noreferrer"
            className="
              hidden sm:inline-flex items-center gap-1.5
              rounded-full border border-stone-300
              bg-white/90 px-3 py-1.5
              text-[11px] sm:text-xs font-serif text-stone-800
              shadow-sm hover:bg-white hover:-translate-y-px
              transition
            "
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_0_2px_rgba(251,191,36,0.3)]" />
            <span>OpenLibrary</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>

          {/* Author Filter */}
          <div className="hidden sm:block flex-1 max-w-xs lg:max-w-sm">
            <div className="relative">
              <input
                value={author ?? ""}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author..."
                className="
                  w-full rounded-full border border-stone-300/90
                  bg-white/90 px-3.5 py-1.5 pr-8
                  text-xs sm:text-sm font-serif text-stone-800
                  placeholder:text-stone-400
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-400/40
                "
              />

              {author && (
                <button
                  type="button"
                  onClick={() => setAuthor("")}
                  className="
                    absolute right-2 top-1/2 -translate-y-1/2
                    inline-flex h-5 w-5 items-center justify-center
                    rounded-full bg-stone-100 text-stone-500
                    hover:bg-stone-200 hover:text-stone-800
                    transition
                  "
                >
                  <XCircle className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-[11px] font-serif text-stone-500">
                  Signed in as
                </span>
                <span className="text-xs font-serif text-stone-800">
                  {user.displayName ?? user.email}
                </span>
              </div>

              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-stone-50 shadow-sm">
                {userInitial}
              </span>

              <button
                onClick={handleSignOut}
                className="
                  hidden sm:inline-flex items-center gap-1.5
                  rounded-full border border-stone-300
                  bg-white/90 px-3 py-1.5
                  text-[11px] sm:text-xs font-serif text-stone-900
                  shadow-sm hover:bg-stone-900 hover:text-stone-50
                  hover:-translate-y-px transition
                "
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              className="
                inline-flex items-center gap-1.5
                rounded-full border border-stone-800
                bg-stone-900 px-3.5 py-1.5
                text-[11px] sm:text-xs font-serif text-stone-50
                shadow-sm hover:bg-stone-800 hover:-translate-y-px
                transition
              "
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign in</span>
            </button>
          )}

          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              inline-flex h-9 w-9 items-center justify-center
              rounded-full border border-stone-300 bg-white/90
              text-stone-800 shadow-sm hover:bg-white hover:-translate-y-px
              transition
            "
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="border-t border-stone-200/80 bg-[rgba(253,247,236,0.96)] backdrop-blur-sm"
          >
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-4 px-3 py-3 sm:px-4">
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-serif text-stone-800 hover:underline underline-offset-4"
              >
                About
              </Link>

              <Link
                href="/poems"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-serif text-stone-800 hover:underline underline-offset-4"
              >
                Poems
              </Link>

              <Link
                href="/saved-quotes"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-serif text-stone-800 hover:underline underline-offset-4"
              >
                Saved quotes
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Soft separator */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-stone-300/70 to-transparent" />
    </motion.header>
  );
}
