const { v4: uuidv4 } = require('uuid');
const newLogger = require('./logger');
const errorUseCase = require('./error');
const replication = require('./replication');
const cipher = require('./cipher');
const hash = require('./hash');
const network = require('./network');

const splitSize = process.env.SECRET_SPLIT_SIZE_BYTES || 15;
const nReplication = process.env.NUMBER_REPLICATIONS || 10;

const logger = newLogger({
  console_level: 'info',
  service: 'secret',
});

function removeValue(splittedData) {
  splittedData.chunks.forEach((chunk) => {
    // eslint-disable-next-line no-param-reassign
    delete chunk.value;
  });
  return splittedData;
}

function saveAndReplicateChunk(chunk) {
  const { value } = chunk;
  const hashChunk = chunk.hash;
  const promises = [];
  chunk.keys.forEach((keyReplication) => {
    const data = {
      value,
      hash: hashChunk,
      type: 'chunk',
    };
    const key = hashChunk + keyReplication;
    const promise = network.save(key, data);
    promises.push(promise);
  });
  return Promise.all(promises)
    .catch((err) => {
      logger.error(`Error to save replicated chunk, Reason: ${err.message}`);
      const errorResponse = errorUseCase.createError('Error saving secret', err.message);
      return Promise.reject(errorResponse);
    });
}

function saveContent(data) {
  const promises = [];
  data.chunks.forEach((chunk) => promises.push(saveAndReplicateChunk(chunk)));
  return Promise.all(promises)
    .catch((err) => {
      logger.error(`Error to save chunk: Reason: ${err.message}`);
      const errorResponse = errorUseCase.createError('Error saving secret', err.message);
      return Promise.reject(errorResponse);
    });
}

function splitAndSaveContent(contentEncrypted) {
  const splittedData = replication.split(contentEncrypted.encrypted, splitSize, nReplication);
  return saveContent(splittedData)
    .then(() => removeValue(splittedData))
    .catch((err) => {
      logger.error(`Error to save secret: Reason: ${err.message}`);
      const errorResponse = errorUseCase.createError('Error saving secret', err.message);
      return Promise.reject(errorResponse);
    });
}

function createModel(data, splittedData, contentEncrypted) {
  const plain = {
    id: data.id,
    secret: contentEncrypted.key,
    iv: contentEncrypted.iv,
    version: data.version,
    type: 'manifest',
    action: 'add',
    nextId: uuidv4(),
    value: splittedData,
  };
  return plain;
}

function saveAndReplicateManifest(id, hashContent, data) {
  const valueToSave = {
    data: data.encrypted,
    hash: hashContent,
    iv: data.iv,
  };
  const promises = [];
  for (let i = 0; i < nReplication; i += 1) {
    const key = `${id}#${i}`;
    const promise = network.save(key, valueToSave);
    promises.push(promise);
  }
  return Promise.all(promises);
}

function createResponse(model) {
  return {
    message: 'Secret Added',
    nextId: model.nextId,
  };
}

function addSecret(data) {
  const contentEncrypted = cipher.cipherObject(data.content);
  return splitAndSaveContent(contentEncrypted)
    .then((splittedData) => createModel(data, splittedData, contentEncrypted))
    .then((model) => [model, cipher.cipherObjectKey(model, data.secret)])
    .then(([model, encModel]) => [model, hash.objectHash(encModel.encrypted), encModel])
    .then(([model, hashEnc, enc]) => saveAndReplicateManifest(data.userid, hashEnc, enc) && model)
    .then((model) => createResponse(model))
    .catch((err) => Promise.reject(err));
}

async function getManifest(id) {
  for (let i = 0; i < nReplication; i += 1) {
    const key = `${id}#${i}`;
    // eslint-disable-next-line no-await-in-loop
    const response = await network.get(key);
    if (response.value) {
      const hashValue = hash.objectHash(response.value.data);
      if (response.value && hashValue === response.value.hash) return response.value;
    }
  }
  const msg = 'Not possible to get Manifest';
  logger.error(msg);
  throw new Error(msg);
}

function decryptManifest(encryptedManifest, secret) {
  const manifest = cipher.decipherObjectKey(encryptedManifest.data, secret, encryptedManifest.iv);
  const objManifest = JSON.parse(manifest);
  return objManifest;
}

async function getChunk(chunk) {
  for (let i = 0; i < chunk.keys.length; i += 1) {
    const key = chunk.hash + chunk.keys[i];
    // eslint-disable-next-line no-await-in-loop
    const response = await network.get(key);
    if (response.value) {
      const hashValue = hash.objectHash(response.value.value);
      if (hashValue === response.value.hash) return response.value;
    }
  }
  const msg = 'Not possible to get Chunk of a Secret';
  logger.error(msg);
  throw new Error(msg);
}

function mergeChunksString(arrayChunks) {
  let stringSecret = '';
  arrayChunks.forEach((chunk) => { stringSecret += chunk.value; });
  return stringSecret;
}

function validateHashSecretEncrypted(strSecretEnc, realHash) {
  const contentHash = hash.objectHash(strSecretEnc);
  if (contentHash === realHash) {
    return strSecretEnc;
  }
  const msg = 'Not possible to get a Secret, Invalid hash';
  logger.error(msg);
  throw new Error(msg);
}

function mergeChunksAndGetSecret(manifest) {
  const promises = [];
  for (let i = 0; i < manifest.value.chunks.length; i += 1) {
    const chunk = manifest.value.chunks[i];
    promises.push(getChunk(chunk));
  }
  return Promise.all(promises)
    .then((arrayChunks) => mergeChunksString(arrayChunks))
    .then((strSecretEnc) => validateHashSecretEncrypted(strSecretEnc, manifest.value.hash))
    .then((strSecretEnc) => cipher.decipherObject(strSecretEnc,
      Buffer.from(manifest.secret, 'hex'), Buffer.from(manifest.iv, 'hex')));
}

function getSecret(auth) {
  const id = auth.username;
  return getManifest(id)
    .then((encryptedManifest) => decryptManifest(encryptedManifest, auth.password))
    .then((manifest) => mergeChunksAndGetSecret(manifest))
    .catch((err) => Promise.reject(err));
}

function addInitialSecret(data) {
  const opts = {
    id: '0',
    version: 1,
    content: data.content,
    secret: data.secret,
    userid: data.userid,
  };
  const valueToSave = addSecret(opts);
  return valueToSave;
}

module.exports = {
  addInitialSecret,
  addSecret,
  getSecret,
};
