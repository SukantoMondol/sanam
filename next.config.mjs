import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  env: {
    BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    NEXT_PUBLIC_PAYMENT_URL:
      process.env.NEXT_PUBLIC_PAYMENT_URL || process.env.payment_url,
    gTM_ID: process.env.GTM_ID ? process.env.GTM_ID : "",
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  images: {
    unoptimized: true,
    qualities: [75, 80, 100],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      ...(process.env.IMAGE_DOMAIN || "")
        .split(",")
        .map((hostname) => hostname.trim())
        .filter(Boolean)
        .map((hostname) => ({
          protocol: "https",
          hostname,
        })),
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 768, 1024, 1280, 1536],
  },
  turbopack: {
    root: __dirname,
  },
  experimental: {
    esmExternals: true,
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "react-bootstrap",
      "bootstrap",
    ],
  },
  compress: true,
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
