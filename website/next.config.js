/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      domains: ['friends.nyc'],
  },
  reactStrictMode: true,
  webpack: (config) => {
    return Object.assign({}, config, {
      module: Object.assign({}, config.module, {
        rules: config.module.rules.concat([
          {
            test: /\.md$/,
            loader: "raw-loader",
          },
        ]),
      }),
    });
  },
};
module.exports = nextConfig;
