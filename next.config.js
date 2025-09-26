/** @type {import('next').NextConfig} */
const isCI = process.env.GITHUB_ACTIONS === "true";
const repo = (process.env.GITHUB_REPOSITORY || "").split("/")[1] || "";
const basePath = isCI ? `/${repo}` : "";
module.exports = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
};


