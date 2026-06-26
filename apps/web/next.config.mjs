/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@rebuildyourlife/shared"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  serverExternalPackages: ["@prisma/client", "bcryptjs", "jsonwebtoken", "@rebuildyourlife/database", "@supabase/ssr"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
