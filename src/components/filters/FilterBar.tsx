"use client";

type MatchMode = "any" | "all";

type Props = {
  q: string;
  author: string;
  tags: string[];
  mode: MatchMode;
  onQ: (v: string) => void;
  onAuthor: (v: string) => void;
  onToggleTag: (t: string) => void;
  onMode: (m: MatchMode) => void;
  onClear: () => void;
};

const TAGS = [
  "love","life","wisdom","motivation","success","friendship","happiness","change","courage",
  "time","freedom","education","faith","hope","art","philosophy","leadership","mindfulness","peace"
];

export default function FilterBar({
  q, author, tags, mode, onQ, onAuthor, onToggleTag, onMode, onClear,
}: Props) {
  return (
    <div className="rounded-2xl border border-stone-300/60 bg-[rgba(250,247,241,.6)] backdrop-blur p-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={q}
          onChange={(e) => onQ(e.target.value)}
          placeholder="Search quotes, tags, or author…"
          className="w-full rounded-xl border border-stone-300 px-3 py-2 bg-white/70 font-serif"
        />
        <div className="relative">
          <input
            value={author}
            onChange={(e) => onAuthor(e.target.value)}
            placeholder="Author only"
            className="w-full rounded-xl border border-stone-300 px-3 py-2 bg-white/70 font-serif pr-8"
          />
          {author && (
            <button
              aria-label="Clear author"
              onClick={() => onAuthor("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border border-stone-300/80 bg-white/80 hover:bg-white"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TAGS.map((t) => {
          const active = tags.includes(t);
          return (
            <button
              key={t}
              onClick={() => onToggleTag(t)}
              className={`px-3 py-1 rounded-full border text-sm font-serif tracking-wide ${
                active
                  ? "bg-stone-900 text-stone-50 border-stone-900"
                  : "border-stone-300 hover:bg-stone-100"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm opacity-80 font-serif">Match</span>
        <select
          value={mode}
          onChange={(e) => onMode(e.target.value as MatchMode)}
          className="rounded-xl border border-stone-300 px-3 py-1 text-sm bg-white/80 font-serif"
        >
          <option value="any">any</option>
          <option value="all">all</option>
        </select>
        <button
          onClick={onClear}
          className="ml-auto rounded-xl border border-stone-300 px-3 py-1 text-sm hover:bg-stone-100 font-serif"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
