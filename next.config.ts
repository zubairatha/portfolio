import type { NextConfig } from "next";

const isCI = process.env.GITHUB_ACTIONS === "true";
const repo = (process.env.GITHUB_REPOSITORY || "").split("/")[1] || "";
const basePath = isCI ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
};

export default nextConfig;
