import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pick-road.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
