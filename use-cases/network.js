const levelup = require('levelup');
const leveldown = require('leveldown');
const encoding = require('encoding-down');
const kadence = require('@deadcanaries/kadence');
const newLogger = require('./logger');

const logger = newLogger({
  console_level: 'info',
  service: 'kadence',
});

function createIdentity() {
  return kadence.utils.getRandomKeyBuffer();
}

function createNode(identity) {
  const node = new kadence.KademliaNode({
    transport: new kadence.HTTPTransport(),
    storage: levelup(encoding(leveldown('./data/storage.db'))),
    logger,
    identity,
  });

  return node;
}

function addOnionPlugin(node) {
  return node.plugin(kadence.onion({
    dataDirectory: '/usr/src/app/hidden_service',
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
  node.listen(1337, () => {
    logger.info(
      `node listening on local port ${1337} `
      + `and exposed at ${node.contact.protocol}//${node.contact.hostname}`
      + `:${node.contact.port}`,
    );

    logger.info(`Node Identity: ${Buffer.from(node.identity).toString('hex')}`);
  });
}

function createNetwork() {
  const identity = createIdentity();
  const node = createNode(identity);
  node.onion = addOnionPlugin(node);
  listen(node);
}

module.exports = {
  createNetwork,
};
