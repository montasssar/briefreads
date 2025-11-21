"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Menu, LogOut, ExternalLink, Search, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // adjust path if needed
import { getAuth, signOut as firebaseSignOut } from "firebase/auth";

export default function Navbar() {
  const { user, signInWithGoogle } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [menuOpen, setMenuOpen] = useState(false);
  const [authorQuery, setAuthorQuery] = useState(
    () => searchParams.get("author") ?? ""
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isHome = pathname === "/" || pathname === "/briefreads";

  // Firebase user
  const userName = user?.displayName || user?.email || null;
  const userInitial = userName?.charAt(0).toUpperCase() ?? "M";

  // ---------- Close menu on outside click ----------
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // ---------- URL update for live author search ----------
  const updateAuthorInUrl = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("author", value.trim());
    } else {
      params.delete("author");
    }

    const qs = params.toString();
    const targetPath = pathname || "/";

    // replace() so typing doesn't spam browser history
    router.replace(qs ? `${targetPath}?${qs}` : targetPath);
  };

  const handleAuthorChange = (value: string) => {
    setAuthorQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      updateAuthorInUrl(value);
    }, 300);
  };

  const handleClearAuthor = () => {
    setAuthorQuery("");
    updateAuthorInUrl("");
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Google sign-in failed:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await firebaseSignOut(auth);
      setMenuOpen(false);
    } catch (err) {
      console.error("Sign-out failed:", err);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-[#F8F3E9]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT: Logo + tagline */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-sm">
            <span className="text-lg">💭</span>
          </div>
          <div className="leading-tight">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-neutral-900"
            >
              BriefReads
            </Link>
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-neutral-500">
              Your warm home of words
            </p>
          </div>
        </div>

        {/* MIDDLE: OpenLibrary + author search */}
        <div className="flex flex-1 flex-col gap-2 sm:max-w-xl sm:flex-row sm:items-center sm:justify-center">
          {/* OpenLibrary badge – hidden on very small screens */}
          <a
            href="https://openlibrary.org"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center justify-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-medium text-amber-800 shadow-sm md:inline-flex"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
            OpenLibrary
            <ExternalLink className="h-3 w-3" />
          </a>

          {/* Author-only search – only on home page */}
          {isHome && (
            <div className="w-full flex items-center justify-center">
              <div className="flex w-full max-w-[420px] items-center rounded-full border border-neutral-200 bg-white/90 px-3 shadow-sm focus-within:border-neutral-400 focus-within:ring-1 focus-within:ring-neutral-300">
                <Search className="mr-2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={authorQuery}
                  onChange={(e) => handleAuthorChange(e.target.value)}
                  placeholder="Author… e.g. Rumi"
                  className="flex-1 border-none bg-transparent py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                />
                {authorQuery && (
                  <button
                    type="button"
                    onClick={handleClearAuthor}
                    className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                    aria-label="Clear author"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: user info + auth + menu */}
        <div
          ref={menuRef}
          className="relative flex items-center justify-end gap-2 sm:gap-3"
        >
          {userName ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="hidden text-xs text-neutral-600 sm:inline">
                Signed in as
              </span>
              <span className="hidden text-sm font-medium text-neutral-900 sm:inline">
                {userName}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                {userInitial}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              className="rounded-full border border-neutral-300 bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-800 shadow-sm"
            >
              Sign in
            </button>
          )}

          {userName && (
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1 rounded-full border border-neutral-300 bg-white/90 px-2.5 py-1.5 text-xs font-medium text-neutral-800 shadow-sm"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          )}

          {/* Menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-white/90 shadow-sm"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Dropdown menu with Saved, Poems, About */}
          {menuOpen && (
            <div className="absolute right-0 top-11 w-44 rounded-xl border border-neutral-200 bg-white/95 py-2 text-sm shadow-lg">
              <Link
                href="/saved"
                className="block px-3 py-1.5 text-neutral-800 hover:bg-neutral-100"
                onClick={() => setMenuOpen(false)}
              >
                Saved quotes
              </Link>
              <Link
                href="/poems"
                className="block px-3 py-1.5 text-neutral-800 hover:bg-neutral-100"
                onClick={() => setMenuOpen(false)}
              >
                Poems
              </Link>
              <Link
                href="/about"
                className="block px-3 py-1.5 text-neutral-800 hover:bg-neutral-100"
                onClick={() => setMenuOpen(false)}
              >
                About BriefReads
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
