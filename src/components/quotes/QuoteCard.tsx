"use client";
import { motion } from "framer-motion";
import type { Quote } from "@/types/quote";


interface Props { quote: Quote; index?: number }


export default function QuoteCard({ quote, index = 0 }: Props) {
const delay = Math.min(0.02 * index, 0.4);
return (
<motion.article
initial={{ y: 8, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ duration: 0.35, delay }}
className="rounded-xl border bg-white/90 p-4 shadow-soft"
>
<p className="text-base leading-relaxed">“{quote.text}”</p>
<div className="mt-3 flex items-center justify-between">
<span className="text-sm font-medium opacity-80">— {quote.author}</span>
<div className="flex flex-wrap gap-1">
{quote.tags?.slice(0, 3).map((t) => (
<span key={t} className="text-[10px] px-2 py-0.5 rounded-full border opacity-70">
{t}
</span>
))}
</div>
</div>
</motion.article>
);
}