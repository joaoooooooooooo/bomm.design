import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    // Rive's per-frame assertions overwhelm the development log bridge.
    browserToTerminal: false,
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
