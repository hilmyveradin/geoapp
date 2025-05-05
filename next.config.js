const webpack = require("webpack");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "dev3.webgis.co.id",
        port: "",
        pathname: "/be/gs/thumbnail/***",
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
