/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/bear',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
