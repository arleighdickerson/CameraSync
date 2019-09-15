module.exports = {
  'modulePaths':        ['<rootDir>'],
  preset:               'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform:            {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  setupFiles: [
    require.resolve('react-native-gesture-handler/jestSetup'),
    require.resolve('core-js/es7/reflect'),
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-navigation|@react-navigation|react-navigation-redux-helpers|redux-saga-catch)',
  ],
  globals: {
    'ts-jest': {
      babelConfig: 'babel.test.json',
    },
  },
};
