import path from "path";
import type { NextConfig } from "next";

const cosmiconfigStub = path.join(process.cwd(), "src/lib/cosmiconfig-stub.ts");

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      cosmiconfig: "./src/lib/cosmiconfig-stub.ts",
      fs: { browser: "./src/lib/empty-module.ts" },
      "fs/promises": { browser: "./src/lib/empty-module.ts" },
      module: { browser: "./src/lib/empty-module.ts" },
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      cosmiconfig: cosmiconfigStub,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      "fs/promises": false,
      module: false,
    };
    return config;
  },
};

export default nextConfig;
