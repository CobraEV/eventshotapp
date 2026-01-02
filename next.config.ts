import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  cacheComponents: true,
  images: {
    qualities: [25, 50, 60, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minio.edelbyte.ch',
      },
    ],
  },
}

export default nextConfig
