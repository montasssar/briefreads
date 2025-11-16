/* eslint-disable @typescript-eslint/no-explicit-any */

import pkg from "@prisma/client";

// Prisma 6+ ships a default export, so we safely pull PrismaClient out of it.
const { PrismaClient } = pkg as any;

// In dev we reuse the same instance via globalThis to avoid “too many clients”
// errors on hot reload. In production we just create one.
let prisma: any;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  const globalWithPrisma = globalThis as any;

  if (!globalWithPrisma.__prisma) {
    globalWithPrisma.__prisma = new PrismaClient();
  }

  prisma = globalWithPrisma.__prisma;
}

export { prisma };
