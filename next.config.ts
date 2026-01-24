import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hechingerreport.org',
      },
      {
        protocol: 'https',
        hostname: '**.wp.com', // WordPress CDN (i0.wp.com, i1.wp.com, etc.)
      },
      {
        protocol: 'https',
        hostname: 'kjxofjq2cxejjxiu.public.blob.vercel-storage.com',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);