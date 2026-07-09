/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@rebuildyourlife/database', '@rebuildyourlife/shared'],
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
};

export default nextConfig;
