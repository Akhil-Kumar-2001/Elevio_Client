import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "https://api.elevic.site/api", 
  },
  images: {
    domains: [
      "drive.google.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com"
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
        hostname: "res.cloudinary.com",
        pathname: "/**", 
      },
    ],
  },
};

export default nextConfig;
