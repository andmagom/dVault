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
    data,
    hash: hashContent,
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
    .then(([model, encryptedModel]) => [model, hash.objectHash(encryptedModel), encryptedModel])
    .then(([model, hashEnc, enc]) => saveAndReplicateManifest(data.userid, hashEnc, enc) && model)
    .then((model) => createResponse(model))
    .catch((err) => { 
      return Promise.reject(err); 
    });
}

function addInitialSecret(data) {
  const opts = {
    id: '0',
    version: 1,
    content: data.content,
    secret: data.secret,
  };
  const valueToSave = addSecret(opts);
  return valueToSave;
}

module.exports = {
  addInitialSecret,
  addSecret,
};
