import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:5000/api",
  },
  images: {
    domains: [
      "drive.google.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com" // ✅ Added Cloudinary as an allowed domain
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/uc",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // ✅ Allow Cloudinary images
        pathname: "/**", // Matches all paths
      },
    ],
  },
};

export default nextConfig;
