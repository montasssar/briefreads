import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/saved-quotes?userId=UID
export async function GET(req: NextRequest) {
  try {
    const userId =
      req.nextUrl.searchParams.get("userId") ||
      req.headers.get("x-user-id");

    if (!userId) {
      // no user ⇒ no quotes
      return NextResponse.json({ quotes: [] }, { status: 200 });
    }

    const quotes = await prisma.savedQuote.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quotes }, { status: 200 });
  } catch (err) {
    console.error("GET /api/saved-quotes ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load saved quotes" },
      { status: 500 },
    );
  }
}

// POST /api/saved-quotes  (toggle save/unsave)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId: string | undefined =
      body.userId || req.headers.get("x-user-id") || undefined;
    const text: string | undefined = body.text;
    const author: string | undefined = body.author;
    const tags: string[] | string | undefined = body.tags;

    if (!userId || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const tagString = Array.isArray(tags) ? tags.join(",") : tags ?? "";

    // already saved? ⇒ unsave
    const existing = await prisma.savedQuote.findFirst({
      where: { userId, text },
    });

    if (existing) {
      await prisma.savedQuote.delete({
        where: { id: existing.id },
      });

      return NextResponse.json(
        { saved: false, id: existing.id },
        { status: 200 },
      );
    }

    // create new
    const saved = await prisma.savedQuote.create({
      data: {
        userId,
        text,
        author: author ?? "",
        tags: tagString,
      },
    });

    return NextResponse.json(
      { saved: true, quote: saved },
      { status: 200 },
    );
  } catch (err) {
    console.error("POST /api/saved-quotes ERROR:", err);
    return NextResponse.json(
      { error: "Failed to save quote" },
      { status: 500 },
    );
  }
}
