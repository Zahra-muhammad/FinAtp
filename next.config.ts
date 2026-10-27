import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Duotone photos hide compression well, so they're served at quality 60.
  images: { formats: ["image/avif", "image/webp"], qualities: [60, 75] },
};

export default nextConfig;
