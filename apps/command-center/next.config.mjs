/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@rebuildyourlife/database', '@rebuildyourlife/shared'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
};

export default nextConfig;
