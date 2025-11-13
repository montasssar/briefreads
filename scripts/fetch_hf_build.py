# scripts/fetch_hf_build.py
# Downloads large quotes datasets from Hugging Face and builds fallback gzip.
# Works on Windows. Requires: pip install huggingface_hub pandas

import json, os, sys, gzip, csv
from pathlib import Path
from typing import Dict, Iterable, List, Tuple
try:
    import pandas as pd
    from huggingface_hub import snapshot_download, hf_hub_download
except Exception as e:
    print("Missing deps. Run:\n  pip install --upgrade huggingface_hub pandas\n")
    raise

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
LIB_DIR  = ROOT / "src" / "lib"
DATA_DIR.mkdir(parents=True, exist_ok=True)
LIB_DIR.mkdir(parents=True, exist_ok=True)

# --- Helpers ---------------------------------------------------------------

def norm(s: str) -> str:
    return (s or "").strip()

def to_record(text: str, author: str, tags: Iterable[str]) -> Dict:
    return {"text": norm(text), "author": norm(author), "tags": [t.strip().lower() for t in tags if t and str(t).strip()]}

def add_rows(rows: List[Dict], seen: set, text: str, author: str, tags: Iterable[str]):
    text, author = norm(text), norm(author)
    if not text:
        return
    key = (text.lower(), author.lower())
    if key in seen:
        return
    seen.add(key)
    rows.append(to_record(text, author, tags))

# --- 1) Abirate/english_quotes (JSONL) ------------------------------------

def ingest_abirate(rows: List[Dict], seen: set):
    repo = "Abirate/english_quotes"
    target = hf_hub_download(repo_id=repo, filename="quotes.jsonl")
    with open(target, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            obj = json.loads(line)
            # dataset fields commonly: {"author": "...", "quote": "...", "tags": [...]}
            text = obj.get("quote") or obj.get("text") or obj.get("content") or ""
            author = obj.get("author") or ""
            tags = obj.get("tags") or []
            add_rows(rows, seen, text, author, tags)

# --- 2) jstet/quotes-500k (CSV) -------------------------------------------

def find_first_csv(dir_path: Path) -> Path:
    for p in dir_path.rglob("*.csv"):
        return p
    raise FileNotFoundError("No CSV found in snapshot")

def ingest_jstet(rows: List[Dict], seen: set):
    repo = "jstet/quotes-500k"
    local_dir = snapshot_download(repo_id=repo, repo_type="dataset")
    csv_path = find_first_csv(Path(local_dir))
    # Try a few common field names
    df = pd.read_csv(csv_path)
    # heuristics for columns
    txt_col = next((c for c in df.columns if str(c).lower() in ["quote", "text", "content", "quotation"]), None)
    auth_col = next((c for c in df.columns if str(c).lower() in ["author", "by", "speaker"]), None)
    tags_col = next((c for c in df.columns if "tag" in str(c).lower() or "topic" in str(c).lower()), None)

    if not txt_col:
        raise RuntimeError(f"Could not detect text column in {csv_path}; columns: {list(df.columns)}")

    for _, row in df.iterrows():
        text  = row.get(txt_col, "")
        author = row.get(auth_col, "") if auth_col else ""
        raw_tags = row.get(tags_col, "") if tags_col else ""
        # tags could be comma/semicolon separated or a list-like string
        tags = []
        if isinstance(raw_tags, str):
            if ";" in raw_tags:
                tags = [t.strip() for t in raw_tags.split(";")]
            elif "," in raw_tags:
                tags = [t.strip() for t in raw_tags.split(",")]
            else:
                if raw_tags.strip():
                    tags = [raw_tags.strip()]
        elif isinstance(raw_tags, list):
            tags = raw_tags
        add_rows(rows, seen, str(text), str(author or ""), tags)

# --- Build pipeline --------------------------------------------------------

def main():
    rows: List[Dict] = []
    seen: set = set()

    print("Fetching Abirate/english_quotes ...")
    try:
        ingest_abirate(rows, seen)
        print(f"  +{len(rows)} rows so far")
    except Exception as e:
        print("  Skipped Abirate:", e)

    print("Fetching jstet/quotes-500k ...")
    try:
        before = len(rows)
        ingest_jstet(rows, seen)
        print(f"  +{len(rows) - before} rows from jstet/quotes-500k")
    except Exception as e:
        print("  Skipped jstet/quotes-500k:", e)

    total = len(rows)
    print(f"Total unique rows: {total}")

    merged_json = DATA_DIR / "merged.json"
    with open(merged_json, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False)

    # Write JSONL.GZ for fast server streaming
    out_gz = LIB_DIR / "quotes.jsonl.gz"
    with gzip.open(out_gz, "wt", encoding="utf-8") as gz:
        for r in rows:
            gz.write(json.dumps(r, ensure_ascii=False) + "\n")

    print(f"Wrote {merged_json} and {out_gz}")
    if total < 10000:
        print("\n⚠ The count is still small. Ensure both datasets downloaded and parsed correctly.")
        print("  Check your internet, or rerun the script.")

if __name__ == "__main__":
    main()
