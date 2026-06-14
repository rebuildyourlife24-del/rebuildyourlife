import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@rebuildyourlife/database", "@rebuildyourlife/shared"],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

export default nextConfig;
