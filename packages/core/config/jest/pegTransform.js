'use strict';

const crypto = require('crypto');
const peg = require('pegjs');

module.exports = {
  getCacheKey(
    fileData,
    _filePath,
    configString,
    _options
  ) {
    return crypto.createHash('md5')
      .update(fileData)
      .update(configString)
      .digest('hex');
  },

  process (
    sourceText,
    _sourcePath,
    _config,
    _options
  ) {
    return `module.exports = ${peg.generate(sourceText, {output: 'source'})}`;
  }
}
