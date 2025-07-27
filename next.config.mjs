/** @type {import('next').NextConfig} */
import withSharp from "next-sharp";

const nextConfig = {
  images: {
    remotePatterns: [new URL("https://lh3.googleusercontent.com/**")],
  },
};

export default withSharp(nextConfig);
