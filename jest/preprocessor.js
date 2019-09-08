const tsTransformer = require('react-native-typescript-transformer');
const rnTransformer = require('react-native/jest/preprocessor');
const generate = require('@babel/generator');

const preprocessor = Object.assign({}, rnTransformer, {
  process(src, file) {
    /*
    return tsTransformer.transform({
      filename:  file,
      localPath: file,
      options:   {
        dev:            true,
        inlineRequires: true,
        platform:       '',
        projectRoot:    '',
        retainLines:    true,
      },
      src,
    }).code;
     */
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
      filename:  file,
      localpath: file,
      options:   {
        platform:       '',
        inlineRequires: true,
        dev:            true,
        retainLines:    true,
        sourceMaps:     true,
      },
    }, src);
  },
});

module.exports = preprocessor;

