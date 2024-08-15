// @ts-check
import { env } from './src/env.mjs';

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default config;