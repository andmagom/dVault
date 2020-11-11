const { Router } = require('express');
const secretUseCase = require('../../../use-cases/secret');
const errorUseCase = require('../../../use-cases/error');
const authUseCase = require('../../../use-cases/auth');

const router = Router();

function createResponsePasswordAdded(res, data) {
  res.status(201).send(data);
}

router.post('/', (req, res) => {
  const data = {
    content: req.body.content,
    secret: req.body.password,
    userid: req.body.username,
  };

  secretUseCase.addInitialSecret(data)
    .then((secretCreated) => authUseCase.createSession(req.session,
      { username: data.userid }, secretCreated))
    .then((response) => createResponsePasswordAdded(res, response))
    .catch((err) => errorUseCase.createErrorHttp({ res, err, status: 500 }));
});

module.exports = router;
