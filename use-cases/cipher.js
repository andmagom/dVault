const crypto = require('crypto');
const hash = require('./hash');

function encrypt(plain, key, iv) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
  let encrypted = cipher.update(plain);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}

function decrypt(encrypted, key, iv) {
  const encryptedText = Buffer.from(encrypted, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function cipherObject(object) {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const data = JSON.stringify(object);
  return {
    key: Buffer.from(key).toString('hex'),
    iv: Buffer.from(iv).toString('hex'),
    encrypted: encrypt(data, key, iv),
  };
}

function cipherObjectKey(object, key) {
  const iv = crypto.randomBytes(16);
  const key256 = hash.hashKey(key);
  const data = JSON.stringify(object);
  return {
    encrypted: encrypt(data, key256, iv),
  };
}

function decipherObject(encrypted, key, iv) {
  const plain = decrypt(encrypted, key, iv);
  return JSON.parse(plain);
}

module.exports = {
  cipherObject,
  cipherObjectKey,
  decipherObject,
};
