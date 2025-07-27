/** @type {import('next').NextConfig} */
const nextConfig = withSharp({
  images: {
    remotePatterns: [new URL("https://lh3.googleusercontent.com/**")],
  },
});

export default nextConfig;
