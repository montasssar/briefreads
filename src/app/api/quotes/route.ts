import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import readline from "node:readline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Mode = "any" | "all";
export type Quote = { text: string; author: string; tags?: string[] };

const GZ_PATH = path.join(process.cwd(), "src", "lib", "quotes.jsonl.gz");

// ----------------- Canonical tags -----------------
const CANON = [
  "love","life","wisdom","motivation","success","friendship","happiness","change","courage",
  "time","freedom","education","faith","hope","art","philosophy","leadership","mindfulness","peace"
];

const TAG_HINTS: Record<string, RegExp> = {
  love: /\b(love|heart|beloved|romance)\b/i,
  life: /\b(life|living|alive|existence)\b/i,
  wisdom: /\b(wisdom|wise|insight|truth|mindset|patience|discipline)\b/i,
  motivation: /\b(motivat|inspir|drive|ambition|grind|discipline)\b/i,
  success: /\b(success|succeed|achievement|accomplish|win)\b/i,
  friendship: /\b(friend|friendship)\b/i,
  happiness: /\b(happy|happiness|joy|joyful|glad)\b/i,
  change: /\b(change|transform|transformation|evolve)\b/i,
  courage: /\b(courage|brave|bravery|fearless)\b/i,
  time: /\b(time|moment|minutes|hours|days|years)\b/i,
  freedom: /\b(free|freedom|liberty)\b/i,
  education: /\b(learn|learning|education|study|knowledge)\b/i,
  faith: /\b(faith|belief|believe|god|divine)\b/i,
  hope: /\b(hope|hopeful|optimism)\b/i,
  art: /\b(art|artist|poetry|poem|music|painting)\b/i,
  philosophy: /\b(philosophy|philosopher|stoic|stoicism|existential)\b/i,
  leadership: /\b(lead|leader|leadership|guide|influence)\b/i,
  mindfulness: /\b(mindful|mindfulness|meditat|awareness)\b/i,
  peace: /\b(peace|calm|serenity|tranquil)\b/i
};

const norm = (s: string) => s.toLowerCase().trim();

function canonicalizeTags(src: string[] | undefined, text: string): string[] {
  const base = new Set<string>();
  (src ?? []).forEach((t) => {
    const v = norm(String(t));
    if (v) base.add(v);
  });
  const txt = text || "";
  for (const tag of CANON) if (TAG_HINTS[tag]?.test(txt)) base.add(tag);
  return Array.from(base);
}

function matches(row: Quote, q: string, author: string) {
  const txt = row.text ?? "";
  const auth = row.author ?? "";
  const qn = norm(q);
  const an = norm(author);
  const txtN = norm(txt);
  const authN = norm(auth);
  const mQ = qn ? (txtN.includes(qn) || authN.includes(qn)) : true;
  const mA = an ? authN.includes(an) : true;
  return mQ && mA;
}

// ----------------- Process-wide warm cache + tag index -----------------
type WarmCache = {
  ready: boolean;
  items: Quote[];
  total: number;
  // tag → subset (cap to keep memory stable)
  tagIndex: Record<string, Quote[]>;
};

type GlobalWithCache = typeof globalThis & { __QUOTES_CACHE__?: WarmCache };
const g = globalThis as GlobalWithCache;

const CACHE: WarmCache =
  g.__QUOTES_CACHE__ ?? { ready: false, items: [], total: 0, tagIndex: {} };
g.__QUOTES_CACHE__ = CACHE;

// Build once (first request). Reservoir limited for quick warm (120k).
async function ensureWarmCache(limit = 120_000, perTagCap = 50_000): Promise<void> {
  if (CACHE.ready) return;
  if (!fs.existsSync(GZ_PATH)) {
    CACHE.ready = true; CACHE.items = []; CACHE.total = 0; CACHE.tagIndex = {};
    return;
  }

  const stream = fs.createReadStream(GZ_PATH).pipe(zlib.createGunzip());
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  const out: Quote[] = [];
  let scanned = 0;

  for await (const line of rl) {
    scanned++;
    if (!line) continue;

    let obj: unknown;
    try { obj = JSON.parse(line as string); } catch { continue; }

    if (
      typeof obj === "object" && obj !== null &&
      typeof (obj as { text?: unknown }).text === "string" &&
      typeof (obj as { author?: unknown }).author === "string"
    ) {
      const qObj = obj as Quote;
      const tags = canonicalizeTags(qObj.tags, qObj.text);
      out.push({ ...qObj, tags });
      if (out.length >= limit) break;
    }
  }

  // build tag index
  const idx: Record<string, Quote[]> = {};
  for (const q of out) {
    for (const t of q.tags ?? []) {
      if (!idx[t]) idx[t] = [];
      const bucket = idx[t];
      if (bucket.length < perTagCap) bucket.push(q);
    }
  }

  CACHE.items = out;
  CACHE.total = scanned;
  CACHE.tagIndex = idx;
  CACHE.ready = true;
}

// Seeded shuffle (stable per seed)
function lcg(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32;
}
function shuffleInPlace<T>(arr: T[], seed: number) {
  const rnd = lcg(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function unionByRef(arrays: Quote[][]): Quote[] {
  const seen = new Set<Quote>();
  const out: Quote[] = [];
  for (const a of arrays) {
    for (const q of a) {
      if (!seen.has(q)) { seen.add(q); out.push(q); }
    }
  }
  return out;
}
function intersectByRef(arrays: Quote[][]): Quote[] {
  if (!arrays.length) return [];
  const [first, ...rest] = arrays;
  const inAll = new Set(first);
  for (const a of rest) for (const q of [...inAll]) if (!a.includes(q)) inAll.delete(q);
  return [...inAll];
}

export async function GET(req: Request): Promise<Response> {
  await ensureWarmCache();

  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const author = url.searchParams.get("author") ?? "";
  const tags = (url.searchParams.get("tags") ?? "")
    .split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const mode = (url.searchParams.get("mode") as Mode) ?? "any";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const limit = Math.max(1, Math.min(50, Number(url.searchParams.get("limit") ?? 36)));
  // Per-visit seed from client → randomness on reload/visit, stable paging
  const seed = Number(url.searchParams.get("seed") ?? 0) || 1;

  const pool = CACHE.items;
  if (!pool.length) return Response.json({ results: [], page, hasMore: false });

  // Fast path with tag index
  let base: Quote[];
  if (tags.length) {
    const buckets = tags
      .map(t => CACHE.tagIndex[t] || [])
      .filter(b => b.length);
    base = buckets.length
      ? (mode === "all" ? intersectByRef(buckets) : unionByRef(buckets))
      : [];
  } else {
    base = pool;
  }

  // Apply q/author match only on the reduced base
  const filtered = (q || author) ? base.filter(r => matches(r, q, author)) : base;

  // Shuffle with per-visit seed then page
  const working = filtered.slice();
  shuffleInPlace(working, seed);

  const start = (page - 1) * limit;
  const results = working.slice(start, start + limit);
  const hasMore = working.length > start + results.length;

  return Response.json({ results, page, hasMore });
}
