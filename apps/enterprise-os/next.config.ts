import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@rebuildyourlife/database', '@rebuildyourlife/shared'],
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
};

export default nextConfig;
