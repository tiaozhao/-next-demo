/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['b2b-accelerator.myshopify.com'],
  },
  async headers() {
    return [
      {
        // 主页路由 - 通过 Vercel 边缘缓存实现缓存层
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=2592000, stale-while-revalidate=30',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=2592000',
          },
        ],
      },
      {
        // 其他页面路由
        source: '/((?!api).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=2592000, stale-while-revalidate=30',
          },
        ],
      },
      {
        // API 路由配置
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
