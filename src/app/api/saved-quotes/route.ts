import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserId(req: NextRequest): string | null {
  const userId = req.headers.get("x-user-id");
  return userId && userId.trim().length > 0 ? userId : null;
}

// Shape of errors we might see from Prisma / Postgres
type ErrorWithCode = Error & {
  code?: string;
  errorCode?: string;
};

// Normalize unknown error → { message, code }
function normalizeError(err: unknown): { message: string; code: string | null } {
  if (typeof err === "string") {
    return { message: err, code: null };
  }

  if (err && typeof err === "object") {
    const e = err as ErrorWithCode;
    const message =
      e.message || JSON.stringify(err, Object.getOwnPropertyNames(err));
    const code = e.code ?? e.errorCode ?? null;
    return { message, code };
  }

  return { message: "Unknown error", code: null };
}

/**
 * Small helper: test DB connection once.
 * If DATABASE_URL / SSL is wrong, this throws DB_CONNECT_ERROR with details.
 */
async function assertDbConnection(): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err: unknown) {
    const { message, code } = normalizeError(err);
    throw new Error(
      `DB_CONNECT_ERROR: ${message}${code ? ` (code: ${code})` : ""}`
    );
  }
}

// GET /api/saved-quotes
//   ?text=... → { saved: boolean }
//   none      → { quotes: SavedQuote[] }
export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  try {
    await assertDbConnection();

    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text");

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
  } catch (err: unknown) {
    console.error("GET /api/saved-quotes error", err);
    const { message, code } = normalizeError(err);
    return NextResponse.json(
      {
        error: "Failed to load saved quotes",
        detail: message,
        code,
      },
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
    await assertDbConnection();

    const saved = await prisma.savedQuote.create({
      data: {
        userId,
        author: body.author,
        text: body.text,
        tags: tagsString,
      },
    });

    return NextResponse.json({ saved }, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/saved-quotes error", err);
    const { message, code } = normalizeError(err);
    return NextResponse.json(
      {
        error: "Failed to save quote",
        detail: message,
        code,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/saved-quotes → unsave quote
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
    await assertDbConnection();

    await prisma.savedQuote.deleteMany({
      where: { userId, text: body.text },
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("DELETE /api/saved-quotes error", err);
    const { message, code } = normalizeError(err);
    return NextResponse.json(
      {
        error: "Failed to remove quote",
        detail: message,
        code,
      },
      { status: 500 }
    );
  }
}
