/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@rebuildyourlife/shared"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
      'node_modules/.prisma/client/query_engine-windows*', 
      'node_modules/@prisma/client/runtime/*.wasm-base64.js',
      'node_modules/@prisma/client/runtime/*.wasm-base64.mjs',
      'node_modules/@prisma/client/runtime/*.wasm'
    ]
  },
  serverExternalPackages: ["@prisma/client", "bcryptjs", "jsonwebtoken", "@rebuildyourlife/database", "@supabase/ssr"],

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
