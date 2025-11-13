// src/components/home/HomePageClient.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useFilters } from "@/hooks/useFilters";
import { useQuotesApi } from "@/hooks/useQuotesApi";
import FilterBar from "@/components/filters/FilterBar";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";

export function HomePageClient() {
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

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleExpanded = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

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
            {items.map((q, i) => {
              const cardId = `${q.author}-${q.text.slice(0, 24)}-${i}`;
              const isLong = q.text.length > 240;
              const isOpen = expanded[cardId] === true;

              return (
                <motion.article
                  key={cardId}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20% 0px" }}
                  transition={{ duration: 0.2, delay: i * 0.015 }}
                  className="
                    group
                    rounded-2xl border border-stone-200/80
                    bg-[rgba(250,247,241,.92)]
                    p-4 sm:p-5
                    flex flex-col
                    shadow-[0_8px_18px_rgba(15,23,42,0.04)]
                    hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)]
                    hover:-translate-y-0.5
                    transition-all duration-200
                  "
                >
                  <p
                    className="
                      font-serif text-[0.98rem] sm:text-[1.05rem]
                      leading-relaxed text-stone-800
                    "
                  >
                    {isLong && !isOpen ? (
                      <>
                        {q.text.slice(0, 240)}…{" "}
                        <button
                          type="button"
                          onClick={() => toggleExpanded(cardId)}
                          className="
                            align-baseline text-[11px]
                            underline underline-offset-2
                            opacity-80 hover:opacity-100
                            focus:outline-none focus-visible:ring-2
                            focus-visible:ring-stone-400 rounded-sm
                          "
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
                              className="
                                align-baseline text-[11px]
                                underline underline-offset-2
                                opacity-80 hover:opacity-100
                                focus:outline-none focus-visible:ring-2
                                focus-visible:ring-stone-400 rounded-sm
                              "
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
                    <span className="text-xs sm:text-sm font-serif opacity-80">
                      — {q.author}
                    </span>
                    {q.tags?.slice(0, 4).map((t) => {
                      const isActive = f.tags.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => f.toggleTag(t)}
                          className={`
                            text-[10px] sm:text-[11px]
                            px-2 py-0.5 rounded-full font-serif border
                            transition
                            ${
                              isActive
                                ? "border-stone-700 bg-stone-800 text-amber-50"
                                : "border-stone-300 bg-white/80 text-stone-800 hover:border-stone-400"
                            }
                          `}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      )}

      {/* ⏳ Loading / End */}
      <div ref={sentinelRef} className="h-10" />
      {loading && (
        <p className="text-center text-sm font-serif opacity-70">
          Loading…
        </p>
      )}
      {!hasMore && !loading && items.length > 0 && (
        <p className="text-center text-sm font-serif opacity-60">— end —</p>
      )}

      {/* 🡅 Scroll-to-top button */}
      <ScrollToTopButton />
    </main>
  );
}
