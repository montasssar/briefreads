"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFilters } from "@/hooks/useFilters";
import { useQuotesApi } from "@/hooks/useQuotesApi";
import FilterBar from "@/components/filters/FilterBar";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import QuoteCard from "@/components/quotes/QuoteCard";
import type { Quote } from "@/types/quote";

type SavedQuoteRow = {
  text: string;
};

export function HomePageClient() {
  const f = useFilters();
  const { user } = useAuth();

  // Stable “randomness per visit”
  const [seed] = useState<number>(() => {
    if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
      const b = new Uint32Array(1);
      crypto.getRandomValues(b);
      return b[0] || Date.now();
    }
    return Date.now();
  });

  const { items, loading, error, hasMore, loadMore } = useQuotesApi({
    q: f.q,
    author: f.author,
    tags: f.tags,
    mode: f.mode,
    page: 1,
    limit: 36,
    seed,
  });

  // map: quote.text -> saved?
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});

  // preload saved quotes for logged-in user
  useEffect(() => {
    if (!user) {
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/saved-quotes", {
          headers: {
            "x-user-id": user.uid,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        const rows: SavedQuoteRow[] = data.quotes ?? [];

        const next: Record<string, boolean> = {};
        for (const row of rows) {
          if (row.text) {
            next[row.text] = true;
          }
        }
        setSavedMap(next);
      } catch (err) {
        console.error("Failed to preload saved quotes", err);
      }
    })();
  }, [user]);

  const toggleSave = async (quote: Quote) => {
    if (!user) {
      console.warn("Must be signed in to save quotes.");
      return;
    }

    const key = quote.text;
    const currentlySaved = !!savedMap[key];

    const applySaved = (saved: boolean) => {
      setSavedMap((prev) => {
        const next = { ...prev };
        if (saved) {
          next[key] = true;
        } else {
          delete next[key];
        }
        return next;
      });
    };

    try {
      if (!currentlySaved) {
        applySaved(true);

        const res = await fetch("/api/saved-quotes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.uid,
          },
          body: JSON.stringify({
            author: quote.author,
            text: quote.text,
            tags: quote.tags ?? [],
          }),
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          console.error("Failed to save quote", res.status, payload);
          applySaved(false);
        }
      } else {
        applySaved(false);

        const res = await fetch("/api/saved-quotes", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.uid,
          },
          body: JSON.stringify({ text: quote.text }),
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          console.error("Failed to remove saved quote", res.status, payload);
          applySaved(true);
        }
      }
    } catch (err) {
      console.error("toggleSave error", err);
      applySaved(currentlySaved);
    }
  };

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            loadMore();
          }
        }
      },
      { rootMargin: "600px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  return (
    <main
      className="
        mx-auto max-w-6xl
        px-3 sm:px-4
        pt-4 sm:pt-6 md:pt-8
        space-y-8 sm:space-y-10 md:space-y-12
      "
    >
      {/* 🖋️ Header */}
      <section className="text-center space-y-3 sm:space-y-4">
        <h1
          className="
            text-3xl sm:text-4xl md:text-5xl
            font-serif font-semibold
            text-stone-800 tracking-tight
          "
        >
          BriefReads
        </h1>
        <p
          className="
            max-w-2xl mx-auto
            text-sm sm:text-base md:text-lg
            text-stone-700 font-serif
            leading-relaxed italic
          "
        >
          Crafted with care by{" "}
          <span className="font-medium text-stone-900">Montassar Benneji</span>{" "}
          for <span className="font-medium text-stone-900">Thoughts lovers</span>.
          Choose your favourite author and read their mind, or explore your own
          reflection by selecting a personal tag.
        </p>
      </section>

      {/* 🎚️ Filter */}
      <section
        className="
          rounded-2xl border border-stone-200/80
          bg-[rgba(255,253,248,0.9)]
          px-3 sm:px-4 py-3 sm:py-4
          shadow-[0_12px_24px_rgba(15,23,42,0.04)]
        "
      >
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

      {/* ⚠️ Error */}
      {error && (
        <p className="text-sm text-red-600 font-serif text-center">
          Error: {error}
        </p>
      )}

      {/* 📝 Quotes Grid */}
      {items.length > 0 && (
        <section aria-label="Quotes list">
          <div
            className="
              grid gap-4 sm:gap-5
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
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

      {/* ⏳ Loading / End */}
      <div ref={sentinelRef} className="h-10" />
      {loading && (
        <p className="text-center text-sm font-serif opacity-70">Loading…</p>
      )}
      {!hasMore && !loading && items.length > 0 && (
        <p className="text-center text-sm font-serif opacity-60">— end —</p>
      )}

      {/* 🡅 Scroll-to-top button */}
      <ScrollToTopButton />
    </main>
  );
}
