const tsTransformer = require('react-native-typescript-transformer');
const rnTransformer = require('react-native/jest/preprocessor');
const generate = require('babel-generator');

const preprocessor = Object.assign({}, rnTransformer, {
  process(src, file) {
    const { ast } = tsTransformer.transform({
      filename:  file,
      localPath: file,
      options:   {
        dev:         true,
        platform:    '',
        projectRoot: '',
      },
      src,
    });

    return generate.default(ast, {
      filename:    file,
      retainLines: true,
    }, src);
  },
});

module.exports = preprocessor;

