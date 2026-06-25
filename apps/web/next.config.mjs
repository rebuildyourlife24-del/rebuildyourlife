/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@rebuildyourlife/shared"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  serverExternalPackages: ["@prisma/client", "bcryptjs", "jsonwebtoken", "@rebuildyourlife/database", "@supabase/ssr"],
};

export default nextConfig;
