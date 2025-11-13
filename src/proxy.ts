import type { NextFetchEvent, NextRequest } from "next/server";

// No-op proxy hook for local dev; keeps the new "proxy" file in place.
// We deliberately touch the params to avoid unused-var warnings.
export default function proxy(_req: NextRequest, _evt: NextFetchEvent) {
  void _req;
  void _evt;
  // Add custom rewrites/headers here if needed.
}
