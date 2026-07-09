/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@rebuildyourlife/database', '@rebuildyourlife/shared'],
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
