const { withExpo } = require('@expo/next-adapter');

module.exports = withExpo({
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['react-native', 'react-native-web', 'expo'],
  experimental: {
    forceSwcTransforms: true,
  },
  distDir: '.next',
});
