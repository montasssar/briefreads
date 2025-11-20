"use client";

import { useState } from "react";
import type { Quote } from "@/types/quote";

interface Props {
  quote: Quote;
  isSaved: boolean;
  onToggleSave: (quote: Quote) => void;
}

export default function QuoteCard({
  quote,
  isSaved,
  onToggleSave,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const handleSaveClick = () => {
    onToggleSave(quote);

    // Trigger micro animation only when going from unsaved → saved
    if (!isSaved) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 600); // match shortPing duration
    }
  };

  const displayedText =
    quote.text.length > 220 && !expanded
      ? quote.text.slice(0, 220) + "…"
      : quote.text;

  return (
    <article
      className="
        relative rounded-xl border border-gray-200 
        bg-[#faf5ef] p-5 shadow-sm 
        transition-all
      "
    >
      {/* STAR SAVE BUTTON (smaller bubble + short pulse + spin) */}
      <button
        onClick={handleSaveClick}
        aria-label={isSaved ? "Unsave quote" : "Save quote"}
        className="
          absolute top-3 right-3
          flex items-center justify-center
          w-6 h-6 rounded-full
          bg-white/40 backdrop-blur-sm
          text-gray-600 hover:text-yellow-600
          shadow-sm hover:shadow 
          transition-all transform hover:scale-110
        "
      >
        {/* Short pulse ring */}
        {justSaved && (
          <span
            className="
              absolute inline-flex h-full w-full rounded-full
              border border-yellow-400/70
              opacity-70
              animate-shortPing
            "
          />
        )}

        {/* Star (spins briefly when justSaved is true) */}
        <span
          className={
            "relative text-sm leading-none " +
            (justSaved ? "animate-starSpin" : "")
          }
        >
          {isSaved ? "★" : "☆"}
        </span>
      </button>

      {/* QUOTE TEXT */}
      <p className="text-base leading-relaxed mb-3">
        “{displayedText}”
      </p>

      {/* READ MORE */}
      {quote.text.length > 220 && (
        <button
          onClick={toggleExpanded}
          className="text-sm text-gray-500 hover:text-gray-700 transition-all"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {/* AUTHOR */}
      <p className="mt-4 text-sm font-medium text-gray-800 uppercase tracking-wide">
        — {quote.author}
      </p>

      {/* TAGS */}
      <div className="mt-3 flex flex-wrap gap-2">
        {quote.tags?.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="
              px-3 py-1 rounded-full
              text-xs font-medium
              bg-white/60 backdrop-blur
              text-gray-700 border border-gray-300
              shadow-sm
            "
          >
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}
