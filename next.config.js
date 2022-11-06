/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: { appDir: true },
  basePath: "/app"
};

const withPWA = require("next-pwa")({
  dest: "public"
});

module.exports = withPWA(nextConfig);
