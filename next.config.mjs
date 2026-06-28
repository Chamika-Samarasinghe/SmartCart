/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.fbsbx.com",
      },
      {
        protocol: "https",
        hostname: "*.facebook.com",
      },
    ],
  },
};

export default nextConfig;
