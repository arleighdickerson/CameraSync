/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-typescript-transformer'),
    getTransformOptions:  async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires:            false,
      },
    }),
  },
  serializer: {
    getModulesRunBeforeMainModule: (entryFilePath) => ([
      'core-js/es7/reflect',
    ]),
  },
};
