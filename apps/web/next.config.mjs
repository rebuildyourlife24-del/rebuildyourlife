/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@rebuildyourlife/shared", "@rebuildyourlife/api"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
