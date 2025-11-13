/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

// Recursively find .json and .jsonl files under data/
function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && (full.endsWith(".json") || full.endsWith(".jsonl"))) {
      yield full;
    }
  }
}

function stripBOM(s) {
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

function normItem(r) {
  const text = String(r?.text ?? r?.content ?? "").trim();
  if (!text) return null;
  const author = String(r?.author ?? "Unknown").trim();
  const tags = Array.isArray(r?.tags) ? r.tags.map(String) : [];
  return { text, author, tags };
}

function keyOf(q) {
  return `${q.text.toLowerCase()}|${q.author.toLowerCase()}`;
}

const DATA_DIR = path.join(process.cwd(), "data");
const OUT = path.join(process.cwd(), "data", "merged.json");

if (!fs.existsSync(DATA_DIR)) {
  console.error(`data/ folder not found at: ${DATA_DIR}`);
  process.exit(1);
}

const seen = new Set();
const out = [];
let files = 0, rows = 0, kept = 0;

for (const file of walk(DATA_DIR)) {
  files++;
  const isJSONL = file.endsWith(".jsonl");
  if (isJSONL) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    for (const line of lines) {
      if (!line.trim()) continue;
      let obj;
      try { obj = JSON.parse(stripBOM(line)); } catch { continue; }
      rows++;
      const q = normItem(obj);
      if (!q) continue;
      const k = keyOf(q);
      if (seen.has(k)) continue;
      seen.add(k); out.push(q); kept++;
    }
  } else {
    let text = fs.readFileSync(file, "utf8");
    text = stripBOM(text);
    let arr;
    try { arr = JSON.parse(text); } catch { arr = []; }
    if (!Array.isArray(arr)) continue;
    for (const r of arr) {
      rows++;
      const q = normItem(r);
      if (!q) continue;
      const k = keyOf(q);
      if (seen.has(k)) continue;
      seen.add(k); out.push(q); kept++;
    }
  }
}

fs.writeFileSync(OUT, JSON.stringify(out));
console.log(`Scanned ${files} file(s), ${rows} row(s); kept ${kept} unique → ${OUT}`);
