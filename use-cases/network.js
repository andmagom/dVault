const levelup = require('levelup');
const leveldown = require('leveldown');
const encoding = require('encoding-down');
const kadence = require('@deadcanaries/kadence');
const newLogger = require('./logger');
const errorUseCase = require('./error');

const logger = newLogger({
  console_level: 'info',
  service: 'kadence',
});

const errorCreatingNodeListener = (err, reject) => {
  const errorResponse = errorUseCase.createError('Error creating node', err.message);
  logger.error(`Error creating node: Reason: ${err.message}`);
  reject(errorResponse);
};

function createIdentity() {
  return kadence.utils.getRandomKeyBuffer();
}

function createNode(identity) {
  const nodeKadence = new kadence.KademliaNode({
    transport: new kadence.HTTPTransport(),
    storage: levelup(encoding(leveldown('./data/storage.db'))),
    logger,
    identity,
  });

  return nodeKadence;
}

function addOnionPlugin(node) {
  return node.plugin(kadence.onion({
    dataDirectory: '/Users/andmagom/Documents/code/dVault/hidden_service',
    virtualPort: '443',
    localMapping: '127.0.0.1:1337',
    torrcEntries: {
      CircuitBuildTimeout: 10,
      KeepalivePeriod: 60,
      NewCircuitPeriod: 60,
      NumEntryGuards: 8,
      Log: 'info stdout',
    },
    passthroughLoggingEnabled: 0,
  }));
}

function listen(node) {
  return new Promise((resolve, reject) => {
    node.once('error', (err) => errorCreatingNodeListener(err, reject));
    node.listen(1337, () => {
      logger.info(`Node Identity: ${Buffer.from(node.identity).toString('hex')}`);
      logger.info(
        `node listening on local port ${1337} `
        + `and exposed at ${node.contact.protocol}//${node.contact.hostname}`
        + `:${node.contact.port}`,
      );

      const nodeData = {
        hostname: node.contact.hostname,
        port: node.contact.port,
        identity: Buffer.from(node.identity).toString('hex'),
      };
      node.removeListener('error', errorCreatingNodeListener);
      resolve(nodeData);
    });
  });
}

function createNetwork() {
  const identity = createIdentity();
  const node = createNode(identity);
  node.onion = addOnionPlugin(node);
  return listen(node);
}

module.exports = {
  createNetwork,
};