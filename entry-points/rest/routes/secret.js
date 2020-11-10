const { Router } = require('express');
const secretUseCase = require('../../../use-cases/secret');
const errorUseCase = require('../../../use-cases/error');

const router = Router();

function createResponsePasswordAdded(res, data) {
  res.status(201).send(data);
}

function getAuth(authHeader) {
  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const username = auth[0];
  const password = auth[1];
  return {
    username,
    password,
  };
}

router.post('/initial', (req, res) => {
  const authHeader = req.headers.authorization;
  const auth = getAuth(authHeader);
  const data = {
    content: req.body.content,
    secret: auth.password,
    userid: auth.username,
  };
  secretUseCase.addInitialSecret(data)
    .then((response) => createResponsePasswordAdded(res, response))
    .catch((err) => errorUseCase.createErrorHttp({ res, err, status: 500 }));
});

router.get('/', (req, res) => {
  const authHeader = req.headers.authorization;
  const auth = getAuth(authHeader);
  secretUseCase.getSecret(auth)
    .then((response) => res.send(response))
    .catch((err) => errorUseCase.createErrorHttp({ res, err, status: 500 }));
});

module.exports = router;
