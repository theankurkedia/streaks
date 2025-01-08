const { withExpo } = require('@expo/next-adapter');

module.exports = withExpo({
  // Your custom Next.js config options here
  transpilePackages: [
    'react-native',
    'expo',
    // Add any other packages that need transpiling
  ],
});
