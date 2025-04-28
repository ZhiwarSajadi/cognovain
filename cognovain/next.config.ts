import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Next.js telemetry is disabled via NEXT_TELEMETRY_DISABLED environment variable
  // or by running 'npx next telemetry disable' command
  // Configure output mode to handle dynamic routes properly
  output: 'standalone',
};

export default nextConfig;
