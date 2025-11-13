// src/components/filters/AuthorSearch.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useFilters } from "@/hooks/useFilters";
import { X } from "lucide-react";

/** Compact author filter that lives in the navbar. */
export default function AuthorSearch() {
  const { author, setAuthor } = useFilters();
  const [val, setVal] = useState(author);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local input when URL/back/forward updates author.
  useEffect(() => {
    setVal(author);
  }, [author]);

  // Debounced write-back to global filters
  useEffect(() => {
    const id = setTimeout(() => {
      if (val !== author) setAuthor(val);
    }, 250);
    return () => clearTimeout(id);
  }, [val, author, setAuthor]);

  const onClear = () => {
    setVal("");
    setAuthor("");
    inputRef.current?.focus();
  };

  return (
    <div className="group/nav relative" role="search" aria-label="Filter by author">
      <input
        ref={inputRef}
        type="text"
        inputMode="search"
        placeholder="Author..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="
          h-9 w-44 md:w-56 rounded-xl px-3 pr-8 text-sm
          outline-none ring-1 ring-neutral-900/10
          bg-white/70 backdrop-blur
          placeholder:text-neutral-400
          focus:ring-neutral-900/20
        "
        aria-label="Author"
      />
      {val && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear author"
          className="
            absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center
            rounded-md text-neutral-500 hover:text-neutral-800
            hover:bg-neutral-900/5 transition
          "
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
