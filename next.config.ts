import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Keep Next.js build files separate from the static export in out/.
  distDir: ".next",
};

export default nextConfig;
