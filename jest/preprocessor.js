const tsTransformer = require('react-native-typescript-transformer');
const rnTransformer = require('react-native/jest/preprocessor');
const generate = require('@babel/generator');

const preprocessor = Object.assign({}, rnTransformer, {
  process(src, file) {
    const { ast } = tsTransformer.transform({
      filename:  file,
      localPath: file,
      options:   {
        platform:       '',
        inlineRequires: false,
        dev:            true,
        retainLines:    true,
        sourceMaps:     true,
      },
      src,
    });

    return generate.default(ast, {
      // sourceMapTarget
      sourceRoot:     '',
      filename:       file,
      sourceMaps:     true,
      sourceFileName: file,
      comments:       true,
      options:        {},
    }, src).code;
  },
});

module.exports = preprocessor;
