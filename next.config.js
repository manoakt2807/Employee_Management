/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.example.com",
        port: "3000",
        pathname: "/account123/**",
      },
    ],
  },
};

module.exports = nextConfig;
