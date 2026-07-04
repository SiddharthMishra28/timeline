/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  turbopack: {} // Setting an empty turbopack config to satisfy Next 16 requirements when using plugins
};

module.exports = withPWA(nextConfig);
