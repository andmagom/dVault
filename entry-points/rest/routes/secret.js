const { Router } = require('express');
const secretUseCase = require('../../../use-cases/secret');
const errorUseCase = require('../../../use-cases/error');

const router = Router();

function createResponsePasswordAdded(res, data) {
  res.status(201).send(data);
}

router.post('/initial', (req, res) => {
  const data = {
    content: req.body.content,
    secret: req.body.passwd,
  };
  secretUseCase.addInitialSecret(data)
    .then((response) => createResponsePasswordAdded(res, response))
    .catch((err) => errorUseCase.createErrorHttp({ res, err, status: 500 }));
});

module.exports = router;
