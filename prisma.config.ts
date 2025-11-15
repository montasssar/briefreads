// prisma.config.ts (root)
// Minimal Prisma JS config so CLI + TS are happy.

import { defineConfig } from "prisma/config";

const prismaConfig = defineConfig({
  // Default schema location
  schema: "./prisma/schema.prisma",
});

export default prismaConfig;
