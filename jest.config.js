module.exports = {
  'modulePaths':        ['<rootDir>'],
  preset:               'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform:            {
    '^.+\\.[jt]sx?$': 'ts-jest',
  },
  setupFiles: [
    require.resolve('react-native-gesture-handler/jestSetup'),
    require.resolve('core-js'),
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-navigation|@react-navigation|react-navigation-redux-helpers)',
  ],
  globals: {
    'ts-jest': {
      babelConfig: 'babel.test.json',
    },
  },
};
