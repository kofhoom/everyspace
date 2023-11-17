/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.gravatar.com", "localhost", "3.34.9.77"],
  },
};

module.exports = nextConfig;
