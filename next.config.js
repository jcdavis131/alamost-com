/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Card photos are served from Vercel Blob.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  trailingSlash: false,
};

module.exports = nextConfig;
