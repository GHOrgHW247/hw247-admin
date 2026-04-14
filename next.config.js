/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // Strict mode type checking
    tsconfigPath: './tsconfig.json',
  },
  eslint: {
    // Lint on build
    ignoreDuringBuilds: false,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  },
}

module.exports = nextConfig
