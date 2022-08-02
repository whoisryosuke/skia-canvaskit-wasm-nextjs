/** @type {import('next').NextConfig} */
const CopyWebpackPlugin = require("copy-webpack-plugin");
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "node_modules/canvaskit-wasm/bin/canvaskit.wasm",
            to: "static/chunks/pages/canvaskit.wasm ",
          },
        ],
      })
    );

    config.experiments = { asyncWebAssembly: true };

    if (isServer) {
      config.output.webassemblyModuleFilename =
        "./../static/wasm/[modulehash].wasm";
    } else {
      config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
    }

    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
      },
    };
    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
