import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      // add other trusted domains if needed
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.favpng.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
