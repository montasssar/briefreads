// src/app/layout.tsx
import type { ReactNode } from "react";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

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
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="pb-10">{children}</main>
      </body>
    </html>
  );
}
