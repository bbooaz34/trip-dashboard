/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow maplibre-gl to be bundled (it uses some browser globals)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
