"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

export type MatchMode = "any" | "all";

export interface FiltersState {
  q: string;       // free-text across text/author/tags
  author: string;  // author only (wired in Navbar)
  tags: string[];  // selected tag slugs
  mode: MatchMode; // "any" | "all"
}

function parseFromURL(sp: URLSearchParams): FiltersState {
  const q = sp.get("q") ?? "";
  const author = sp.get("author") ?? "";
  const tags = (sp.get("tags") ?? "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);
  const mode = (sp.get("mode") as MatchMode) === "all" ? "all" : "any";
  return { q, author, tags, mode };
}

function buildSearchParams(state: FiltersState): string {
  const sp = new URLSearchParams();
  if (state.q) sp.set("q", state.q);
  if (state.author) sp.set("author", state.author);
  if (state.tags.length) sp.set("tags", state.tags.join(","));
  if (state.mode !== "any") sp.set("mode", state.mode);
  return sp.toString();
}

export function useFilters(initial?: Partial<FiltersState>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Seed from URL (only once)
  const seeded = useMemo(() => {
    const fromUrl = parseFromURL(searchParams);
    return {
      q: initial?.q ?? fromUrl.q,
      author: initial?.author ?? fromUrl.author,
      tags: initial?.tags ?? fromUrl.tags,
      mode: initial?.mode ?? fromUrl.mode,
    } as FiltersState;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [q, setQ] = useState(seeded.q);
  const [author, setAuthor] = useState(seeded.author);
  const [tags, setTags] = useState<string[]>(seeded.tags);
  const [mode, setMode] = useState<MatchMode>(seeded.mode);

  const toggleTag = (t: string) =>
    setTags(prev => (prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]));

  const clear = () => {
    setQ("");
    setAuthor("");
    setTags([]);
    setMode("any");
  };

  // Debounced values for fetch + URL updates
  const dq = useDebounce(q, 250);
  const dauthor = useDebounce(author, 250);

  // ----- URL <-> state sync without echo loops -----
  const lastWrittenRef = useRef<string>(""); // the last querystring we wrote
  const writeRaf = useRef<number | null>(null);

  // Write: local (debounced) state -> URL (replace)
  useEffect(() => {
    const next: FiltersState = { q: dq, author: dauthor, tags, mode };
    const qs = buildSearchParams(next);
    if (qs === lastWrittenRef.current) return;

    const href = qs ? `${pathname}?${qs}` : pathname;

    if (writeRaf.current) cancelAnimationFrame(writeRaf.current);
    writeRaf.current = requestAnimationFrame(() => {
      lastWrittenRef.current = qs;
      router.replace(href, { scroll: false });
    });

    return () => {
      if (writeRaf.current) cancelAnimationFrame(writeRaf.current);
    };
  }, [dq, dauthor, tags, mode, pathname, router]);

  // Read: URL -> local state (only if it’s an external change)
  useEffect(() => {
    const currentQs = searchParams.toString();
    if (currentQs === lastWrittenRef.current) return; // change originated from us

    const fromUrl = parseFromURL(searchParams);
    // Only update pieces that actually differ to avoid cursor jumps
    setQ(prev => (prev !== fromUrl.q ? fromUrl.q : prev));
    setAuthor(prev => (prev !== fromUrl.author ? fromUrl.author : prev));
    setTags(prev => {
      const a = prev.join(",");
      const b = fromUrl.tags.join(",");
      return a !== b ? fromUrl.tags : prev;
    });
    setMode(prev => (prev !== fromUrl.mode ? fromUrl.mode : prev));
  }, [searchParams]);

  return {
    // state
    q,
    author,
    tags,
    mode,
    // debounced
    dq,
    dauthor,
    // actions
    setQ,
    setAuthor,
    setMode,
    toggleTag,
    clear,
  };
}
