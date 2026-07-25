/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: { unoptimized: true },
  trailingSlash: false,
  // free-tier static only — no server APIs, Canvas 2D client export
};

module.exports = nextConfig;
