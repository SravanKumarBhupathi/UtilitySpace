/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Because output: 'export' does not support next.config.js redirects or rewrites natively,
  // we cannot rely on server-side Next.js rewrites when exporting static HTML.
  // The pages simply being deleted natively returns a 404 which is the appropriate fallback for 410 constraints
  // when deployed statically without a custom node server.
};

module.exports = nextConfig;
