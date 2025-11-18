"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Quote } from "@/types/quote";

interface QuoteCardProps {
  quote: Quote;
  index?: number;
  activeTags: string[];
  onToggleTag: (tag: string) => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

const MAX_CHARS = 220;

export default function QuoteCard({
  quote,
  index = 0,
  activeTags,
  onToggleTag,
  isSaved,
  onToggleSave,
}: QuoteCardProps) {
  const [expanded, setExpanded] = useState(false);

  const delay = Math.min(0.02 * index, 0.4);

  const isLong = (quote.text ?? "").length > MAX_CHARS;

  const displayText =
    expanded || !isLong
      ? quote.text
      : `${quote.text.slice(0, MAX_CHARS).trimEnd()}…`;

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave();
  };

  const handleToggleTag = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    onToggleTag(tag);
  };

  return (
    <motion.article
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, delay }}
      className="
        group relative h-full
        rounded-2xl border border-stone-200/80
        bg-[radial-gradient(circle_at_top,#fffbf5,#f5efe6)]
        p-4 sm:p-5
        shadow-[0_12px_30px_rgba(15,23,42,0.06)]
        hover:shadow-[0_16px_40px_rgba(15,23,42,0.11)]
        transition-shadow
      "
    >
      {/* Save button */}
      <button
        type="button"
        onClick={handleToggleSave}
        className={`
          absolute right-3 top-3
          inline-flex h-8 w-8 items-center justify-center
          rounded-full border text-xs font-medium
          transition
          ${
            isSaved
              ? "bg-amber-500 border-amber-500 text-white shadow-sm"
              : "bg-white/80 border-stone-200 text-stone-600 hover:bg-amber-50"
          }
        `}
        aria-pressed={isSaved}
        aria-label={isSaved ? "Unsave quote" : "Save quote"}
      >
        {isSaved ? "★" : "☆"}
      </button>

      {/* Quote text */}
      <p className="text-[0.98rem] sm:text-[1.02rem] leading-relaxed font-serif text-stone-900">
        <span className="text-lg mr-0.5 align-top text-stone-400">“</span>
        {displayText}
        <span className="text-lg ml-0.5 align-bottom text-stone-400">”</span>
      </p>

      {/* Read more / less */}
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs font-medium text-stone-600 hover:text-stone-900 underline-offset-2 hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {/* Author + Tags */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-stone-600">
          — {quote.author || "Unknown"}
        </span>

        {quote.tags && quote.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-end">
            {quote.tags.slice(0, 3).map((tag) => {
              const active = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={(e) => handleToggleTag(e, tag)}
                  className={`
                    rounded-full border px-2.5 py-0.5 text-[0.7rem] sm:text-[0.72rem]
                    font-medium tracking-wide transition
                    ${
                      active
                        ? "bg-emerald-600 border-emerald-600 text-emerald-50"
                        : "bg-white/80 border-stone-200 text-stone-600 hover:bg-stone-50"
                    }
                  `}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.article>
  );
}
