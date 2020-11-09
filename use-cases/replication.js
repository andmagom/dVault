const crypto = require('crypto');
const hash = require('./hash');

function randomHex(size) {
  return crypto.randomBytes(size).toString('hex');
}

function split(data, splitSize, nReplication) {
  const contentHash = hash.objectHash(data);
  const regex = new RegExp(`.{1,${splitSize}}`, 'g');
  const values = data.match(regex);
  const json = {
    hash: contentHash,
    chunks: [],
  };

  for (let i = 0; i < values.length; i += 1) {
    const valueChunk = values[i];
    const hashChunk = hash.objectHash(valueChunk);
    const keysReplications = [];
    for (let j = i; j < nReplication; j += 1) {
      keysReplications.push(randomHex(3));
    }

    json.chunks.push({
      value: valueChunk,
      hash: hashChunk,
      keys: keysReplications,
    });
  }
  return json;
}

module.exports = {
  randomHex,
  split,
};
