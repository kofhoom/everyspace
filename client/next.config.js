/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.gravatar.com",
      "localhost",
      "ec2-54-180-83-49.ap-northeast-2.compute.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
