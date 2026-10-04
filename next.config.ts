import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 builds a plain HTML/CSS/JS site into `out/` (see scripts/build-static.mjs):
 * no Node server, no image optimizer, no API route, no language-detection redirect.
 */
const isStatic = process.env.STATIC_EXPORT === "1";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    globalNotFound: true,
  },
  ...(isStatic
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
        // The static build runs in ./.static-build and resolves packages from the parent folder.
        ...(process.env.STATIC_TURBOPACK_ROOT ? { turbopack: { root: process.env.STATIC_TURBOPACK_ROOT } } : {}),
      }
    : {
        images: { formats: ["image/avif", "image/webp"] },
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
