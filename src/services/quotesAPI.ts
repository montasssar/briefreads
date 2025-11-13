export type MatchMode = "any" | "all";


export interface QuoteDTO {
_id?: string;
text: string;
author: string;
tags?: string[];
}


export interface FetchQuotesParams {
q?: string;
author?: string;
tags?: string[];
mode?: MatchMode; // affects tag join rule
page?: number;
limit?: number;
}


export interface FetchQuotesResult {
results: QuoteDTO[];
page: number;
totalPages: number;
total: number;
}


export async function fetchQuotes(params: FetchQuotesParams): Promise<FetchQuotesResult> {
const url = new URL("/api/quotes", typeof window === "undefined" ? "http://localhost" : window.location.origin);
if (params.q) url.searchParams.set("q", params.q);
if (params.author) url.searchParams.set("author", params.author);
if (params.tags?.length) url.searchParams.set("tags", params.tags.join(","));
if (params.mode) url.searchParams.set("mode", params.mode);
url.searchParams.set("page", String(params.page ?? 1));
url.searchParams.set("limit", String(params.limit ?? 12));


const res = await fetch(url.toString(), { cache: "no-store" });
if (!res.ok) throw new Error(`API error: ${res.status}`);
return (await res.json()) as FetchQuotesResult;
}