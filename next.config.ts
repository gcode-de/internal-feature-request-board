import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["clsx", "tailwind-merge", "class-variance-authority"],
  },
  output: "standalone",
};

export default nextConfig;
