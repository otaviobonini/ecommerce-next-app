import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "otavio-ecommerce-bucket.s3.sa-east-1.amazonaws.com",
      },
      { protocol: "http", hostname: "localhost", port: "5000" },
    ],
  },
  allowedDevOrigins: ["192.168.10.108"],
};

export default nextConfig;
