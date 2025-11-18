/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import QuoteCard from "@/components/quotes/QuoteCard";
import type { Quote } from "@/types/quote";

type SavedQuoteRow = {
  id: string;
  text: string;
  author: string;
  tags: string; // comma-separated in DB
};

type Status = "idle" | "loading" | "error";

export default function SavedQuotesPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<SavedQuoteRow[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  // Load saved quotes whenever the user changes
  useEffect(() => {
    // if user logs out → clear list
    if (!user) {
      setRows([]);
      setStatus("idle");
      return;
    }

    let cancelled = false;

    const load = async () => {
      setStatus("loading");
      try {
        const res = await fetch(
          `/api/saved-quotes?userId=${encodeURIComponent(user.uid)}`
        );

        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          console.error("Failed to load saved quotes", res.status, payload);
          if (!cancelled) setStatus("error");
          return;
        }

        const data = await res.json();
        const quotes: SavedQuoteRow[] = data.quotes ?? [];

        if (!cancelled) {
          setRows(quotes);
          setStatus("idle");
        }
      } catch (err) {
        console.error("Failed to load saved quotes", err);
        if (!cancelled) setStatus("error");
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Toggle save/unsave from Saved page (unsave = remove)
  const handleToggleSave = async (row: SavedQuoteRow) => {
    if (!user) {
      console.warn("Must be signed in to modify saved quotes.");
      return;
    }

    const quote: Quote = {
      text: row.text,
      author: row.author,
      tags: row.tags
        ? row.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };

    // optimistic remove
    const prevRows = rows;
    setRows((current) => current.filter((r) => r.id !== row.id));

    try {
      const res = await fetch("/api/saved-quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          text: quote.text,
          author: quote.author,
          tags: quote.tags ?? [],
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        console.error("Failed to toggle saved quote", res.status, payload);
        // rollback on failure
        setRows(prevRows);
      }
    } catch (err) {
      console.error("toggleSave from /saved error", err);
      setRows(prevRows);
    }
  };

  // --------- RENDER ---------

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 pt-10 pb-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-stone-800">
          Saved Quotes
        </h1>
        <p className="mt-4 text-sm sm:text-base text-stone-700">
          Sign in to see the lines you’ve kept close.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 pt-10 pb-16 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-stone-800">
          Saved Quotes
        </h1>
        <p className="text-sm sm:text-base text-stone-600">
          All the words you tapped <span className="font-semibold">Save</span>{" "}
          on.
        </p>
      </header>

      {status === "loading" && (
        <p className="text-center text-sm text-stone-600 font-serif">
          Loading your saved lines…
        </p>
      )}

      {status === "error" && (
        <p className="text-center text-sm text-red-600 font-serif">
          Couldn’t load saved quotes. Please try again in a moment.
        </p>
      )}

      {rows.length === 0 && status === "idle" && (
        <p className="text-center text-sm text-stone-700 font-serif mt-6">
          You don’t have any saved quotes yet. Tap{" "}
          <span className="font-semibold">Save</span> on a quote you like and it
          will appear here.
        </p>
      )}

      {rows.length > 0 && (
        <section
          aria-label="Saved quotes"
          className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2"
        >
          {rows.map((row, index) => {
            const quote: Quote = {
              text: row.text,
              author: row.author,
              tags: row.tags
                ? row.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : [],
            };

            return (
              <QuoteCard
                key={row.id}
                quote={quote}
                index={index}
                activeTags={[]}
                onToggleTag={() => {}}
                isSaved={true}
                onToggleSave={() => handleToggleSave(row)}
              />
            );
          })}
        </section>
      )}
    </main>
  );
}
