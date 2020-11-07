const { Router } = require('express');
const networkUseCase = require('../../../use-cases/network');
const errorUseCase = require('../../../use-cases/error');

const router = Router();

function createResponseNetworkCreated(res, nodeData) {
  res.status(201).send(nodeData);
}

router.post('/', (req, res) => {
  networkUseCase
    .createNetwork()
    .then((node) => createResponseNetworkCreated(res, node))
    .catch((err) => errorUseCase.createErrorHttp({ res, err, status: 500 }));
});

router.put('/', (req, res) => {
  const nodeData = req.body;
  networkUseCase
    .joinNetwork(nodeData)
    .then(() => res.sendStatus(200))
    .catch((err) => errorUseCase.createErrorHttp({ res, err, status: 500 }));
});

module.exports = router;
