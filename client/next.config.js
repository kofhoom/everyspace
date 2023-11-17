/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.gravatar.com",
      "localhost",
      "ec2-54-180-103-235.ap-northeast-2.compute.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
