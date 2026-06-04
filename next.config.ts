import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone",
  images: {
    qualities: [80, 85, 90, 95, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
