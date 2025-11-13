/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// Usage: node scripts/convert-to-jsonl-gz.cjs data/quotes-big.json
const inFile = process.argv[2];
if (!inFile) {
  console.error("Usage: node scripts/convert-to-jsonl-gz.cjs <input.json>");
  process.exit(1);
}
if (!fs.existsSync(inFile)) {
  console.error(`Input file not found: ${path.resolve(inFile)}\nTip: put your dataset at data/quotes-big.json and run again.`);
  process.exit(1);
}

const outFile = path.join(process.cwd(), "src", "lib", "quotes.jsonl.gz");
fs.mkdirSync(path.dirname(outFile), { recursive: true });

// Read + strip UTF-8 BOM if present
let rawText = fs.readFileSync(inFile, "utf8");
if (rawText.charCodeAt(0) === 0xfeff) rawText = rawText.slice(1);

let raw;
try {
  raw = JSON.parse(rawText);
} catch (e) {
  console.error(`Invalid JSON in ${inFile}: ${e.message}`);
  process.exit(1);
}
if (!Array.isArray(raw)) {
  console.error(`Expected a JSON array at root. Got: ${typeof raw}`);
  process.exit(1);
}

const gz = zlib.createGzip({ level: 9 });
const out = fs.createWriteStream(outFile);
gz.pipe(out);

let total = 0;
for (const r of raw) {
  const text = String(r?.text ?? r?.content ?? "").trim();
  if (!text) continue;
  const author = String(r?.author ?? "Unknown").trim();
  const tags = Array.isArray(r?.tags) ? r.tags : [];
  gz.write(JSON.stringify({ text, author, tags }) + "\n");
  total++;
}
gz.end(() => console.log(`Wrote ${total} lines → ${outFile}`));
