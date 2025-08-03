/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://lh3.googleusercontent.com/**")],
  },
  experimental: {
    optimizeCss: false, // Disable lightningcss
  },
};

export default nextConfig;
