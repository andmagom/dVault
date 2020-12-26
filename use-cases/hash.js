const oHash = require('object-hash');
const pbkdf2 = require('pbkdf2');
// const crypto = require('crypto');

function objectHash(value) {
  return oHash(value);
}

/* function variableHash(size, data, inputEncoding) {
  // Generate 256-bit hash of data
  let hash = crypto.createHash('sha256');
  hash.update(data, inputEncoding);
  hash = hash.digest('binary');
  // Generate pseudorandom-random output that is `size` bytes
  const output = Buffer.alloc(size);
  // Encrypt a zero-filled buffer using the SHA-256 hash as the AES-256 key
  const cipher = crypto.createCipher('aes256', hash);
  const offset = output.write(cipher.update(output), 0, size, 'binary');
  output.write(cipher.final(), offset, 'binary');
  return output;
} */

function hashKey(key) {
  const key256 = pbkdf2.pbkdf2Sync(key, key, 1, 256 / 8, 'sha512');
  return key256;
}

module.exports = {
  objectHash,
  hashKey,
};
