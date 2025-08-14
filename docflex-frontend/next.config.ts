import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      // add other trusted domains if needed
    ],
  },
};

export default nextConfig;
