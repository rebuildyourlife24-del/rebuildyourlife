/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@rebuildyourlife/shared"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
