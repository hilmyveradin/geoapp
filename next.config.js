const webpack = require("webpack");

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_GEOPORTAL_PATH || "",
  reactStrictMode: false,
  images: {
    domains: ["103.6.53.254"],
    // Or use remotePatterns for more control
    remotePatterns: [
      {
        protocol: "http",
        hostname: "103.6.53.254",
        port: "16890",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("/cesium"),
      })
    );
    return config;
  },
};

module.exports = nextConfig;
