import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    // Rive's per-frame assertions overwhelm the development log bridge.
    browserToTerminal: false,
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
    // Reuse recently visited categories instead of requesting their page again.
    staleTimes: { dynamic: 300 },
  },
  images: {
    remotePatterns: [
      {
        hostname: "cdn.sanity.io",
        protocol: "https",
        pathname: "/images/abg9wgq6/production/**",
      },
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
