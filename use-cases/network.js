const crypto = require('crypto');
const levelup = require('levelup');
const leveldown = require('leveldown');
const encoding = require('encoding-down');
const kadence = require('@deadcanaries/kadence');
const fs = require('fs');
const newLogger = require('./logger');
const errorUseCase = require('./error');

let serverNode;

const TOR_FOLDER = process.env.TOR_FOLDER || '/usr/src/app/data/hidden_service';
const KADEMLIA_FOLDER = process.env.KADEMLIA_FOLDER || './data/store';
const KADENCE_REFRESH = process.env.KADENCE_REFRESH || 300000;

const logger = newLogger({
  console_level: 'info',
  service: 'kadence',
});

const errorCreatingNodeListener = (err, reject) => {
  const errorResponse = errorUseCase.createError('Error creating node', err.message);
  logger.error(`Error creating node: Reason: ${err.message}`);
  reject(errorResponse);
};

const errorJoiningNetwork = (err, reject) => {
  const errorResponse = errorUseCase.createError('Error joining to node', err.message);
  logger.error(`Error joining to node: Reason: ${err.message}`);
  reject(errorResponse);
};

function createFolderKademlia() {
  if (!fs.existsSync(KADEMLIA_FOLDER)) {
    fs.mkdirSync(KADEMLIA_FOLDER);
  }
}

function readeOrCreateIdentity() {
  createFolderKademlia();
  const pathFile = `${KADEMLIA_FOLDER}/identity`;
  let identity = null;
  if (fs.existsSync(pathFile)) {
    identity = fs.readFileSync(pathFile,
      { encoding: 'utf8', flag: 'r' });
  } else {
    identity = kadence.utils.getRandomKeyBuffer();
    fs.writeFileSync(pathFile, Buffer.from(identity).toString('hex'));
  }
  return identity;
}

function createNode(identity) {
  const nodeKadence = new kadence.KademliaNode({
    transport: new kadence.HTTPTransport(),
    storage: levelup(encoding(leveldown('./data/store/storage.db'))),
    logger,
    identity,
  });

  return nodeKadence;
}

function addOnionPlugin(node) {
  return node.plugin(kadence.onion({
    dataDirectory: TOR_FOLDER,
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

function getNodeInfo(node) {
  if (!node && !serverNode) {
    return {
      error: {
        title: 'Node not Connected',
        message: 'This node isn\'t conected to any network yet',
      },
    };
  }
  const nodeData = node || serverNode;
  return {
    hostname: nodeData.contact.hostname,
    port: nodeData.contact.port,
    identity: Buffer.from(nodeData.identity).toString('hex'),
  };
}

function listen(node) {
  return new Promise((resolve, reject) => {
    node.once('error', (err) => errorCreatingNodeListener(err, reject));
    node.listen(1337, () => {
      logger.info(`Node Identity: ${Buffer.from(node.identity).toString('hex')}`);
      logger.info(
        `node listening on local port ${1337} `
        + `and exposed at https://${node.contact.hostname}`
        + `:${node.contact.port}`,
      );

      const nodeData = getNodeInfo(node);
      node.removeListener('error', errorCreatingNodeListener);
      // Refresh router contacts
      setInterval(
        kadence.utils.preventConvoy(() => logger.debug('refreshing kadence router') && node.refresh(0)),
        KADENCE_REFRESH,
      );
      serverNode = node;
      resolve(nodeData);
    });
  });
}

function joinNet(nodeData) {
  return new Promise((resolve, reject) => {
    serverNode.join([nodeData.identity, {
      hostname: nodeData.hostname,
      port: nodeData.port,
    }], (err) => {
      if (err) return errorJoiningNetwork(err, reject);
      logger.info(`Successful connection to the ${nodeData.identity} node`);
      return resolve(true);
    });
  });
}

function createNetwork() {
  if (serverNode == null) {
    const identity = readeOrCreateIdentity();
    const node = createNode(identity);
    node.onion = addOnionPlugin(node);
    return listen(node);
  }
  return Promise.resolve(getNodeInfo(serverNode));
}

function joinNetwork(nodeData) {
  return createNetwork()
    .then(() => joinNet(nodeData));
}

function getLogger() {
  return logger;
}

function getKademliaKey(key) {
  return crypto.createHash('rmd160').update(key).digest('hex');
}
function save(key, value) {
  const kademliaKey = getKademliaKey(key);
  return serverNode.iterativeStore(kademliaKey, value);
}

function get(key) {
  const kademliaKey = getKademliaKey(key);
  return serverNode.iterativeFindValue(kademliaKey);
}

module.exports = {
  createNetwork,
  joinNetwork,
  getLogger,
  getNodeInfo,
  save,
  get,
};
