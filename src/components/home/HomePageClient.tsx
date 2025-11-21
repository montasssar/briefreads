"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useFilters } from "@/hooks/useFilters";
import { useQuotesApi } from "@/hooks/useQuotesApi";
import FilterBar from "@/components/filters/FilterBar";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import QuoteCard from "@/components/quotes/QuoteCard";
import type { Quote } from "@/types/quote";

type SavedQuoteRow = {
  id: string;
  text: string;
  author: string;
  tags: string;
};

export default function HomePageClient() {
  const router = useRouter();
  const f = useFilters();
  const { user, signInWithGoogle } = useAuth();

  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [showSignInToast, setShowSignInToast] = useState(false);

  // store the quote a guest tried to save, so we can save it after sign-in
  const pendingQuoteRef = useRef<Quote | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable random seed per visit
  const [seed] = useState(() => {
    if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
      const b = new Uint32Array(1);
      crypto.getRandomValues(b);
      return b[0] || Date.now();
    }
    return Date.now();
  });

  const { items, loading, hasMore, loadMore } = useQuotesApi({
    q: f.q,
    author: f.author,
    tags: f.tags,
    mode: f.mode,
    page: 1,
    limit: 36,
    seed,
  });

  // Clear any pending toast timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Helper: show toast and auto-hide
  const triggerSignInToast = () => {
    setShowSignInToast(true);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setShowSignInToast(false);
    }, 4000);
  };

  // Load saved quotes when user logs in, and clear when user logs out
  useEffect(() => {
    if (!user) {
      // When auth user becomes null, reset local saved state
      // to drop saved quotes that belonged to the previous user.
      setSavedMap({});
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(
          `/api/saved-quotes?userId=${encodeURIComponent(user.uid)}`
        );

        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          console.error("Failed to load saved quotes", res.status, payload);
          return;
        }

        const data = await res.json();
        const rows: SavedQuoteRow[] = data.quotes ?? [];

        const next: Record<string, boolean> = {};
        for (const q of rows) next[q.text] = true;

        setSavedMap(next);
      } catch (err) {
        console.error("Failed to preload saved quotes", err);
      }
    };

    void load();
  }, [user]);

  // Core save/unsave logic
  const toggleSave = async (quote: Quote) => {
    if (!user) {
      // guest: remember the quote and show toast
      pendingQuoteRef.current = quote;
      triggerSignInToast();
      return;
    }

    const key = quote.text;
    const currentlySaved = !!savedMap[key];

    const applySaved = (saved: boolean) => {
      setSavedMap((prev) => {
        const next = { ...prev };
        if (saved) next[key] = true;
        else delete next[key];
        return next;
      });
    };

    try {
      // optimistic UI
      applySaved(!currentlySaved);

      const res = await fetch("/api/saved-quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          text: quote.text,
          author: quote.author,
          tags: quote.tags ?? [],
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        console.error("Failed to save quote", res.status, payload);
        applySaved(currentlySaved); // rollback
      }
    } catch (err) {
      console.error("toggleSave error", err);
      applySaved(currentlySaved);
    }
  };

  // After user signs in, if there was a pending quote, auto-save it
  useEffect(() => {
    if (!user) return;
    const quoteToSave = pendingQuoteRef.current;
    if (!quoteToSave) return;

    (async () => {
      await toggleSave(quoteToSave);
      pendingQuoteRef.current = null;
    })();
    // we only care about user changing, not toggleSave reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Called when user clicks "Sign in" in the toast
  const handleToastSignIn = async () => {
    setShowSignInToast(false);

    try {
      if (signInWithGoogle) {
        await signInWithGoogle();
      } else {
        // Fallback: go to /signin page if Google method isn't available here
        router.push("/signin");
        return;
      }
    } catch (err) {
      console.error("Google sign-in failed", err);
      return;
    }

    // toggleSave for the pending quote is handled by the effect above
    // once `user` has actually updated.
  };

  // Infinite scroll watcher
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { rootMargin: "600px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  return (
    <main className="mx-auto max-w-6xl px-3 sm:px-4 pt-4 sm:pt-6 md:pt-8 space-y-8 sm:space-y-10 md:space-y-12">
      {/* Header */}
      <section className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-stone-800 tracking-tight">
          BriefReads
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-stone-700 font-serif leading-relaxed italic">
          Choose your favourite author and read their mind, or explore your own
          reflection by selecting a personal tag.
        </p>
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-stone-200/80 bg-[rgba(255,253,248,0.9)] px-3 sm:px-4 py-3 sm:py-4 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
        <FilterBar
          q={f.q}
          author={f.author}
          tags={f.tags}
          mode={f.mode}
          onQ={f.setQ}
          onAuthor={f.setAuthor}
          onToggleTag={f.toggleTag}
          onMode={f.setMode}
          onClear={f.clear}
        />
      </section>

      {/* Feed */}
      {items.length > 0 && (
        <section>
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((q, i) => (
              <QuoteCard
                key={`${q.author}-${q.text.slice(0, 24)}-${i}`}
                quote={q}
                index={i}
                activeTags={f.tags}
                onToggleTag={f.toggleTag}
                isSaved={!!user && !!savedMap[q.text]}
                onToggleSave={() => toggleSave(q)}
              />
            ))}
          </div>
        </section>
      )}

      <div ref={sentinelRef} className="h-10" />
      {loading && (
        <p className="text-center text-sm font-serif opacity-70">Loading…</p>
      )}
      {!hasMore && !loading && items.length > 0 && (
        <p className="text-center text-sm font-serif opacity-60">— end —</p>
      )}

      <ScrollToTopButton />

      {/* 🔔 Sign-in toast (bottom-right) */}
      <div
        className={`fixed bottom-4 right-4 z-50 transform transition-all duration-300 ${
          showSignInToast
            ? "translate-y-0 opacity-100"
            : "translate-y-3 opacity-0 pointer-events-none"
        }`}
      >
        <div className="rounded-xl border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 shadow-lg max-w-xs flex items-start gap-3">
          <div className="mt-0.5 text-lg">⭐</div>
          <div className="flex-1">
            <p className="text-sm">
              Sign in to save your favourite quotes and find them later.
            </p>
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowSignInToast(false)}
                className="text-xs text-amber-700 hover:text-amber-900"
              >
                Dismiss
              </button>
              <button
                onClick={handleToastSignIn}
                className="text-xs bg-amber-800 text-white rounded-full px-3 py-1 hover:bg-amber-900"
              >
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
