"use client";
import { useState } from "react";

type Quote = { text: string; author: string; tags?: string[] };

function Card({ q, idx }: { q: Quote; idx: number }) {
  const [open, setOpen] = useState(false);
  const limit = 220;
  const long = q.text.length > limit;
  const preview = long ? q.text.slice(0, limit) + "…" : q.text;

  return (
    <article className="rounded-2xl border border-stone-300 bg-[rgba(252,249,244,.85)] p-4 shadow-sm">
      <p className="text-[15px] leading-relaxed font-serif italic text-stone-900">
        “{open ? q.text : preview}”
      </p>

      {long && (
        <button
          className="mt-2 text-xs underline decoration-dotted underline-offset-4 text-stone-700 hover:text-stone-900"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? "Show less" : "Learn more"}
        </button>
      )}

      <div className="mt-2 text-xs text-stone-600 font-serif">— {q.author || "Unknown"}</div>

      {q.tags?.length ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {q.tags.slice(0, 6).map((t, j) => (
            <span key={`${idx}-${j}`} className="text-[11px] rounded-full border border-stone-300 bg-white/60 px-2 py-0.5 text-stone-700 font-serif">
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default function QuoteFeed({ data }: { data: Quote[] }) {
  if (!data.length) {
    return <div className="rounded-xl border border-stone-300 p-6 text-sm opacity-70 font-serif">No quotes found for these filters.</div>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((q, i) => <Card key={`${i}-${q.author}-${q.text.slice(0,24)}`} q={q} idx={i} />)}
    </div>
  );
}
