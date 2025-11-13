// next.config.ts
import type { NextConfig } from "next";

/**
 * Lock Turbopack to this folder as the workspace root.
 * This avoids climbing to C:\Users\mnt where a package-lock.json exists.
 */
const nextConfig: NextConfig = {
  turbopack: {
    // Explicit absolute path is safest on Windows:
    root: "C:\\Users\\mnt\\Desktop\\bib\\briefreads"
    // If you move the folder later, update this path accordingly.
    // Alternative portable form:
    // root: process.cwd(),
  },
};

export default nextConfig;
