module.exports = {
  preset:               'react-native',
  // modulePaths:          ['<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform:            {
    '^.+\\.[jt]sx?$': '<rootDir>/jest/preprocessor.js',
  },
  setupFiles:              ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-navigation|@react-navigation|react-navigation-redux-helpers)',
  ],
  /*
  'globals': {
    '__TEST__': true,
  },
   */
};
