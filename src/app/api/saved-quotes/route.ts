import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserId(req: NextRequest): string | null {
  const userId = req.headers.get("x-user-id");
  return userId && userId.trim().length > 0 ? userId : null;
}

// GET /api/saved-quotes
// - ?text=... → { saved: boolean }
// - no query  → { quotes: SavedQuote[] }
export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text");

  try {
    if (text) {
      const existing = await prisma.savedQuote.findFirst({
        where: { userId, text },
      });
      return NextResponse.json({ saved: !!existing });
    }

    const quotes = await prisma.savedQuote.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quotes });
  } catch (err) {
    console.error("GET /api/saved-quotes error", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to load saved quotes", detail: message },
      { status: 500 }
    );
  }
}

// POST /api/saved-quotes → save quote
export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | { author?: string; text?: string; tags?: string[] }
    | null;

  if (!body?.author || !body?.text) {
    return NextResponse.json(
      { error: "author and text are required" },
      { status: 400 }
    );
  }

  const tagsString = Array.isArray(body.tags) ? body.tags.join(",") : null;

  try {
    const saved = await prisma.savedQuote.create({
      data: {
        userId,
        author: body.author,
        text: body.text,
        tags: tagsString,
      },
    });

    return NextResponse.json({ saved }, { status: 201 });
  } catch (err) {
    console.error("POST /api/saved-quotes error", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to save quote", detail: message },
      { status: 500 }
    );
  }
}

// DELETE /api/saved-quotes → unsave
export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { text?: string } | null;

  if (!body?.text) {
    return NextResponse.json(
      { error: "text is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.savedQuote.deleteMany({
      where: { userId, text: body.text },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/saved-quotes error", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to remove quote", detail: message },
      { status: 500 }
    );
  }
}
