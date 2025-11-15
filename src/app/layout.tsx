import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "BriefReads – Curated Quotes for Thoughts Lovers",
  description:
    "Browse curated quotes by author, tags and mood. BriefReads is a warm home of words for readers, inspired writers and thinkers.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className="
          min-h-screen
          bg-linear-to-b from-[#fdf7ec] to-[#f1ebdd]
          text-stone-900
          antialiased
        "
      >
        <AuthProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <main className="pb-10">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
