module.exports = {
  preset:               'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform:            {
    '^.+\\.[jt]sx?$': '<rootDir>/jest/preprocessor.js',
  },
  setupFiles: [
    require.resolve('react-native-gesture-handler/jestSetup'),
    require.resolve('core-js/es7/reflect'),
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-navigation|@react-navigation|react-navigation-redux-helpers)',
  ],
};
