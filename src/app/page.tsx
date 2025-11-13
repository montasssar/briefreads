"use client";

import { useEffect, useRef, useState } from "react";
import { useFilters } from "@/hooks/useFilters";
import { useQuotesApi } from "@/hooks/useQuotesApi";
import FilterBar from "@/components/filters/FilterBar";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";

export default function Page() {
  const f = useFilters();

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

  // Expanded quotes state
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleExpanded = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  // Infinite scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) loadMore();
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-10">
      {/* 🖋️ Header */}
      <section className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-stone-800 tracking-tight">
          BriefReads
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 font-serif leading-relaxed italic">
          Crafted with care by{" "}
          <span className="font-medium text-stone-800">Montassar Benneji</span>{" "}
          for <span className="font-medium text-stone-800">Thoughts lovers</span>.{" "}
          Choose your favourite author and read their mind, or explore your own
          reflection by selecting a personal tag.
        </p>
      </section>

      {/* 🎚️ Filter */}
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

      {/* ⚠️ Error */}
      {error && <p className="text-sm text-red-600 font-serif">Error: {error}</p>}

      {/* 📝 Quotes Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((q, i) => {
          const cardId = `${q.author}-${q.text.slice(0, 24)}-${i}`;
          const isLong = q.text.length > 240;
          const isOpen = expanded[cardId] === true;

          return (
            <article
              key={cardId}
              className="rounded-2xl border border-stone-300/60 bg-[rgba(250,247,241,.6)] p-4 flex flex-col hover:shadow-md transition-shadow duration-300"
            >
              <p className="font-serif text-[1.05rem] leading-relaxed text-stone-800">
                {isLong && !isOpen ? (
                  <>
                    {q.text.slice(0, 240)}…{" "}
                    <button
                      type="button"
                      onClick={() => toggleExpanded(cardId)}
                      className="align-baseline text-xs underline underline-offset-2 opacity-80 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-sm"
                      aria-expanded={isOpen}
                      aria-controls={`${cardId}-full`}
                    >
                      Read more
                    </button>
                  </>
                ) : (
                  <>
                    <span id={`${cardId}-full`}>{q.text}</span>
                    {isLong && (
                      <>
                        {" "}
                        <button
                          type="button"
                          onClick={() => toggleExpanded(cardId)}
                          className="align-baseline text-xs underline underline-offset-2 opacity-80 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-sm"
                          aria-expanded={isOpen}
                          aria-controls={`${cardId}-full`}
                        >
                          Show less
                        </button>
                      </>
                    )}
                  </>
                )}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-sm font-serif opacity-80">— {q.author}</span>
                {q.tags?.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-stone-300 bg-white/70 font-serif"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>

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
