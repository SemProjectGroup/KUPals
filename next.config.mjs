/** @type {import('next').NextConfig} */

webpack: (config) => ({
  ...config,
  externals: [
    ...config.externals,
    {
      sharp: "commonjs sharp",
    },
  ],
});

const nextConfig = {
  images: {
    remotePatterns: [new URL("https://lh3.googleusercontent.com/**")],
  },
};

export default nextConfig;
