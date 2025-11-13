import data from "@/lib/quotes.json";
import type { Quote } from "@/types/quote";
import type { MatchMode } from "@/hooks/useFilters";


export interface QueryInput {
q?: string; // free-text over text+author+tags
author?: string; // author only
tags?: string[]; // selected tags
mode?: MatchMode; // "any" | "all"
}


const BASE = data as Quote[];


function norm(s: string) {
return s.toLowerCase();
}


export function useQuotes({ q = "", author = "", tags = [], mode = "any" }: QueryInput) {
const qn = norm(q);
const an = norm(author);
const tn = tags.map(norm);


const rows = BASE.filter((row) => {
const text = norm(row.text);
const auth = norm(row.author);
const tagList = (row.tags ?? []).map(norm);


// free-text across text + author + tags
const matchesQ = qn
? text.includes(qn) || auth.includes(qn) || tagList.some((t) => t.includes(qn))
: true;


// specific author filter
const matchesAuthor = an ? auth.includes(an) : true;


// tag filter
const matchesTags = tn.length
? mode === "all"
? tn.every((t) => tagList.includes(t))
: tn.some((t) => tagList.includes(t))
: true;


return matchesQ && matchesAuthor && matchesTags;
});


return rows;
}