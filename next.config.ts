import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Dossier corporativo privado — accesible solo por URL directa
      { source: '/dossier', destination: '/dossier/index.html' },
    ]
  },
  async headers() {
    return [
      {
        // Nunca indexar el dossier en buscadores
        source: '/dossier/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
      {
        source: '/dossier',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'niuaflxfiyafckvseruu.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
