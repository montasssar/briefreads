"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Quote } from "@/types/quote";

interface QuoteCardProps {
  quote: Quote;
  index?: number;
  activeTags: string[];
  onToggleTag: (tag: string) => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  saveLabel?: string; // 👈 new (optional)
}

function QuoteCard({
  quote,
  index = 0,
  activeTags,
  onToggleTag,
  isSaved,
  onToggleSave,
  saveLabel,
}: QuoteCardProps) {
  const delay = Math.min(0.02 * index, 0.4);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleExpanded = () => setIsOpen((prev) => !prev);

  const isLong = quote.text.length > 240;
  const cardId = `${quote.author}-${quote.text.slice(0, 24)}-${index}`;

  // Default labels if no custom label is given
  const buttonLabel =
    saveLabel ?? (isSaved ? "Saved" : "Save");

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20% 0px" }}
      transition={{ duration: 0.2, delay }}
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
            {quote.text.slice(0, 240)}…{" "}
            <button
              type="button"
              onClick={toggleExpanded}
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
            <span id={`${cardId}-full`}>{quote.text}</span>
            {isLong && (
              <>
                {" "}
                <button
                  type="button"
                  onClick={toggleExpanded}
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
          — {quote.author}
        </span>

        {quote.tags?.slice(0, 4).map((t) => {
          const isActive = activeTags.includes(t);

          return (
            <button
              key={t}
              type="button"
              onClick={() => onToggleTag(t)}
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

        {onToggleSave && (
          <button
            type="button"
            onClick={onToggleSave}
            aria-pressed={!!isSaved}
            className="
              ml-auto inline-flex items-center justify-center
              rounded-full border border-stone-300
              px-2 py-1 text-[11px] font-serif
              bg-white/80 hover:bg-stone-800 hover:text-amber-50
              transition
            "
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </motion.article>
  );
}

export default QuoteCard;
export { QuoteCard };
