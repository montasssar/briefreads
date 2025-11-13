"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";

export type MatchMode = "any" | "all";
export type Quote = { text: string; author: string; tags?: string[] };

type FetchParams = {
  q: string;
  author: string;
  tags: string[];
  mode: MatchMode;
  page: number;        // always 1 on reset
  limit?: number;      // default 36
  seed: number;        // stable per visit
};

type ApiResp = { results: Quote[]; page: number; hasMore: boolean };

// tiny debounce
function useDebounced<T>(value: T, delay = 200): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function useQuotesApi(params: FetchParams) {
  const { q, author, tags, mode, seed } = params;

  const [items, setItems] = useState<Quote[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();

  // stable keys to keep deps simple
  const dq = useDebounced(q, 200);
  const da = useDebounced(author, 200);
  const tagsKey = useMemo(() => tags.join(","), [tags]);

  // refs to avoid re-creating callbacks on state changes
  const inFlight = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);

  // update ref whenever loading changes
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const fetchPage = useCallback(
    async (nextPage: number) => {
      // use ref to guard without depending on loading state identity
      if (loadingRef.current) return;

      setLoading(true);
      setError(null);

      try {
        inFlight.current?.abort();
        const ac = new AbortController();
        inFlight.current = ac;

        const sp = new URLSearchParams();
        if (dq) sp.set("q", dq);
        if (da) sp.set("author", da);
        if (tagsKey) sp.set("tags", tagsKey);
        sp.set("mode", mode);
        sp.set("page", String(nextPage));
        sp.set("limit", String(params.limit ?? 36));
        sp.set("seed", String(seed));

        const res = await fetch(`/api/quotes?${sp.toString()}`, {
          cache: "no-store",
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(String(res.status));

        const json = (await res.json()) as ApiResp;

        startTransition(() => {
          setItems((prev) => (nextPage === 1 ? json.results : [...prev, ...json.results]));
          setHasMore(Boolean(json.hasMore));
          setPage(nextPage);
        });
      } catch (e: unknown) {
        if ((e as { name?: string })?.name !== "AbortError") {
          setError((e as { message?: string })?.message ?? "Failed to load quotes");
        }
      } finally {
        setLoading(false);
      }
    },
    // IMPORTANT: no `loading` in deps; use loadingRef instead
    [dq, da, tagsKey, mode, params.limit, seed, startTransition]
  );

  // reset when filters change (no dependency on `loading` or any stateful value that changes every fetch)
  useEffect(() => {
    setItems([]);
    setHasMore(true);
    setPage(1);
    fetchPage(1);
  }, [dq, da, tagsKey, mode, seed, fetchPage]);

  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) fetchPage(page + 1);
  }, [fetchPage, page, hasMore]);

  return { items, page, loading: loading || isPending, error, hasMore, loadMore };
}
