"use client";

import { motion } from "framer-motion";
import { Feather, Github, Instagram, Facebook } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fdf7ec] text-stone-800 pb-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto pt-20 px-6 text-center"
      >
        <div className="flex justify-center mb-4">
          <Feather className="h-8 w-8 text-stone-700" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">
          YOUR WARM HOME OF WORDS
        </h1>

      </motion.div>

      {/* Crafted by */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl mx-auto mt-16 px-6 text-center"
      >
        <h2 className="font-serif text-xl sm:text-2xl tracking-tight mb-3">
          Crafted with care for thoughts lovers
        </h2>

        <p className="font-serif text-sm sm:text-base opacity-85 leading-relaxed">
          By <span className="font-semibold">Montassar Benneji</span> —  
          someone who believes that the right words arrive at the right moment…  
          and that a small, peaceful space can make a big difference in a noisy world.
        </p>
      </motion.div>

      {/* Tech Stack + Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="max-w-3xl mx-auto mt-16 px-6"
      >
        <div className="bg-white/70 border border-stone-300 rounded-2xl shadow-sm p-6 sm:p-8 font-serif">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">
            How BriefReads Was Built
          </h3>

          <p className="text-sm sm:text-base opacity-85 leading-relaxed">
            BriefReads blends simplicity with modern craftsmanship.  
            Built using <span className="font-semibold">Next.js</span> for a fast and elegant experience,  
            styled with <span className="font-semibold">Tailwind & Framer Motion</span> for expressive motion,  
            powered by <span className="font-semibold">Firebase Authentication</span> for effortless sign-in,  
            and connected with <span className="font-semibold">Prisma + Supabase</span> for data flow.  
            Quotes, moods, books, and reflections harmonize into one warm reading atmosphere.
          </p>


        </div>
      </motion.div>

      {/* Socials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="max-w-xl mx-auto mt-16 px-6 text-center"
      >
        <h3 className="font-serif text-lg sm:text-xl mb-4">Connect With Me</h3>

        <div className="flex items-center justify-center gap-6">
          <a
            href="https://github.com/montasssar"
            target="_blank"
            className="p-3 rounded-full border border-stone-300 bg-white/80 hover:bg-white transition"
          >
            <Github className="h-5 w-5 text-stone-800" />
          </a>

          <a
            href="https://www.facebook.com/"
            target="_blank"
            className="p-3 rounded-full border border-stone-300 bg-white/80 hover:bg-white transition"
          >
            <Facebook className="h-5 w-5 text-stone-800" />
          </a>

          <a
            href="https://www.instagram.com/"
            target="_blank"
            className="p-3 rounded-full border border-stone-300 bg-white/80 hover:bg-white transition"
          >
            <Instagram className="h-5 w-5 text-stone-800" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
