// src/app/page.tsx
import { Suspense } from "react";
import { HomePageClient } from "@/components/home/HomePageClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-sm opacity-70 font-serif">
            Loading BriefReads…
          </p>
        </main>
      }
    >
      <HomePageClient />
    </Suspense>
  );
}
