"use client";

import { motion } from "framer-motion";
import {
  Feather,
  Github,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#fdf3df] via-[#fff8ee] to-[#fdf7ec] text-stone-800 pb-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 pt-20 sm:pt-24 lg:flex-row lg:items-start lg:gap-14">

        {/* LEFT SECTION */}
        <div className="flex-1 space-y-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start">
              <span className="inline-flex items-center justify-center rounded-full bg-stone-900 text-stone-50 p-2 shadow-md">
                <Feather className="h-5 w-5" />
              </span>
            </div>

            <h1 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-stone-900">
              YOUR WARM HOME OF WORDS
            </h1>

            <p className="mt-3 max-w-xl font-serif text-sm sm:text-base leading-relaxed text-stone-700">
              A quiet corner on the internet, where quotes, moods, and reflections gather for those who love to read between the lines.
            </p>
          </motion.div>

          {/* Crafted with care */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="rounded-2xl border border-stone-200/80 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur"
          >
            <h2 className="font-serif text-lg sm:text-xl tracking-tight mb-2">
              Crafted with care for thoughts lovers
            </h2>

            <p className="font-serif text-sm sm:text-base leading-relaxed text-stone-800">
              By <span className="font-semibold">Montassar Benneji</span> — someone who believes that the right words arrive at the right moment… and that a small, peaceful space can make a big difference in a noisy world.
            </p>

            <div className="mt-4 rounded-xl bg-stone-900 text-stone-50 px-4 py-3 text-sm font-serif italic shadow-inner">
              “Sometimes all you need is a single line that feels like it was written just for you.”
            </div>
          </motion.div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex-1 space-y-8">
          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 sm:p-7 shadow-[0_16px_35px_rgba(15,23,42,0.06)] backdrop-blur"
          >
            <h3 className="text-center font-serif text-lg sm:text-xl font-semibold mb-4 text-stone-900">
              How BriefReads Was Built
            </h3>

            <p className="font-serif text-sm sm:text-base leading-relaxed text-stone-800">
              Built using <span className="font-semibold">Next.js</span> for a fast experience, styled with <span className="font-semibold">Tailwind & Framer Motion</span>, powered by <span className="font-semibold">Firebase Authentication</span>, and connected to a robust <span className="font-semibold">Prisma + Supabase PostgreSQL</span> backend.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs sm:text-sm font-medium text-stone-800">
                <span className="block text-[0.7rem] uppercase tracking-[0.12em] text-stone-500">
                  Frontend
                </span>
                Next.js • React • Framer Motion
              </div>

              <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs sm:text-sm font-medium text-stone-800">
                <span className="block text-[0.7rem] uppercase tracking-[0.12em] text-stone-500">
                  Styling
                </span>
                Tailwind CSS
              </div>

              <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs sm:text-sm font-medium text-stone-800">
                <span className="block text-[0.7rem] uppercase tracking-[0.12em] text-stone-500">
                  Auth
                </span>
                Firebase Google Sign-in
              </div>

              <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs sm:text-sm font-medium text-stone-800">
                <span className="block text-[0.7rem] uppercase tracking-[0.12em] text-stone-500">
                  Data
                </span>
                Prisma ORM • Supabase PostgreSQL
              </div>
            </div>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="rounded-2xl border border-stone-200/80 bg-white/80 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)] backdrop-blur"
          >
            <h3 className="text-center font-serif text-lg sm:text-xl mb-3 text-stone-900">
              Connect With Me
            </h3>

            <p className="mb-4 text-center text-sm text-stone-700 font-serif">
              If you enjoy this space or want to collaborate, you can always reach out here:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">

              <a
                href="https://github.com/montasssar"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 rounded-full border border-stone-300 bg-white/90 px-3 py-2 text-xs font-medium text-stone-800 shadow-sm transition hover:-translate-y-px hover:border-stone-400 hover:shadow-md"
              >
                <Github className="h-4 w-4 opacity-80 group-hover:opacity-100" />
                <span>GitHub</span>
              </a>

              <a
                href="https://www.facebook.com/benneji.montasar/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 rounded-full border border-stone-300 bg-white/90 px-3 py-2 text-xs font-medium text-stone-800 shadow-sm transition hover:-translate-y-px hover:border-stone-400 hover:shadow-md"
              >
                <Facebook className="h-4 w-4 opacity-80 group-hover:opacity-100" />
                <span>Facebook</span>
              </a>

              <a
                href="https://www.instagram.com/montabenneji/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 rounded-full border border-stone-300 bg-white/90 px-3 py-2 text-xs font-medium text-stone-800 shadow-sm transition hover:-translate-y-px hover:border-stone-400 hover:shadow-md"
              >
                <Instagram className="h-4 w-4 opacity-80 group-hover:opacity-100" />
                <span>Instagram</span>
              </a>

              <a
                href="https://www.linkedin.com/in/montassar-benneji-932514256/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 rounded-full border border-stone-300 bg-white/90 px-3 py-2 text-xs font-medium text-stone-800 shadow-sm transition hover:-translate-y-px hover:border-stone-400 hover:shadow-md"
              >
                <Linkedin className="h-4 w-4 opacity-80 group-hover:opacity-100" />
                <span>LinkedIn</span>
              </a>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
