"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import QuoteCard from "@/components/quotes/QuoteCard";
import type { Quote } from "@/types/quote";

type SavedQuoteRow = {
  id: number;
  userId: string;
  author: string;
  text: string;
  tags: string;
  createdAt: string;
};

export default function SavedQuotesPage() {
  const { user, loading } = useAuth();
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  // Load saved quotes once the user is known
  useEffect(() => {
    if (!user) return;

    setStatus("loading");

    (async () => {
      try {
        const res = await fetch("/api/saved-quotes", {
          headers: {
            "x-user-id": user.uid,
          },
        });

        if (!res.ok) throw new Error("Failed to load saved quotes");

        const data = await res.json();
        const rows: SavedQuoteRow[] = data.quotes ?? [];

        const normalized: Quote[] = rows.map((row) => ({
          author: row.author,
          text: row.text,
          tags: row.tags
            ? row.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
        }));

        setSavedQuotes(normalized);
        setStatus("idle");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    })();
  }, [user]);

  // Unsave from this page: simple & friendly
  const handleUnsave = async (quote: Quote) => {
    if (!user) return;

    // Remove from UI right away
    setSavedQuotes((prev) => prev.filter((q) => q.text !== quote.text));

    try {
      const res = await fetch("/api/saved-quotes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.uid,
        },
        body: JSON.stringify({ text: quote.text }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        console.error("Failed to unsave quote", res.status, payload);
      }
    } catch (err) {
      console.error("handleUnsave error", err);
    }
  };

  if (!user && !loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-stone-900">
          Saved Quotes
        </h1>
        <p className="mt-3 text-sm text-stone-700">
          Sign in to see the lines you’ve kept close.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-serif text-2xl font-semibold tracking-tight text-stone-900">
        Saved Quotes
      </h1>

      {status === "loading" && (
        <p className="mt-4 text-sm text-stone-600">
          Collecting your favourite lines…
        </p>
      )}

      {status === "error" && (
        <p className="mt-4 text-sm text-rose-600">
          Couldn’t load your saved quotes. Please try again in a little while.
        </p>
      )}

      {status === "idle" && savedQuotes.length === 0 && (
        <p className="mt-4 text-sm text-stone-600">
          You don’t have any saved quotes yet.  
          Tap <span className="font-semibold">Save</span> on a quote you like and it will appear here.
        </p>
      )}

      <section className="mt-6 space-y-4">
        {savedQuotes.map((q, i) => (
          <QuoteCard
            key={`${q.text}-${i}`}
            quote={q}
            index={i}
            activeTags={[]}
            onToggleTag={() => {
              /* no tag filters here */
            }}
            isSaved
            saveLabel="Unsave"            // 👈 clearer on this page
            onToggleSave={() => handleUnsave(q)}
          />
        ))}
      </section>
    </main>
  );
}
