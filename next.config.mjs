// next.config.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { default: svgrWebpack } = require('@svgr/webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack(config, options) {
    // Exclude SVGs from the default file loader
    config.module.rules.forEach((rule) => {
      if (rule && rule.test && rule.test.toString().includes('|svg|')) {
        rule.exclude = /\.svg$/i;
      }
    });

    // Add a new rule to handle SVGs with @svgr/webpack
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            // Optional: Add SVGR options here
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
