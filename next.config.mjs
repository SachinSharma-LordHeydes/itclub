/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.clerk.com","res.cloudinary.com"],
  },
  experimental: {
    allowedDevOrigins: ["https://dde7-27-34-68-170.ngrok-free.app"], // Your ngrok public URL
  },
};

export default nextConfig;