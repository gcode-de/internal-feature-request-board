import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    optimizePackageImports: ["clsx", "tailwind-merge", "class-variance-authority"],
  },
  output: "standalone",
};

export default nextConfig;
