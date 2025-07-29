const webpack = require("webpack");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["geoapp.hilmyveradin.dev"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "geoapp.hilmyveradin.dev",
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
