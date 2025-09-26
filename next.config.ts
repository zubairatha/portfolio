import type { NextConfig } from "next";

const isCI = process.env.GITHUB_ACTIONS === "true";
const isVercel = process.env.VERCEL === "1";
const repo = (process.env.GITHUB_REPOSITORY || "").split("/")[1] || "";
const basePath = isCI && !isVercel ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  distDir: "out",
};

export default nextConfig;
