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

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
