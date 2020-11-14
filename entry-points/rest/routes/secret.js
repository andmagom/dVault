const { Router } = require('express');
const secretUseCase = require('../../../use-cases/secret');
const errorUseCase = require('../../../use-cases/error');

const router = Router();

function createResponsePasswordAdded(res, data) {
  res.status(201).send(data);
}

router.use((req, res, next) => {
  if (req.session) {
    next();
  } else {
    res.sendStatus(401);
  }
});

router.post('/', (req, res) => {
  const { username } = req.session;

  const data = {
    content: req.body.content,
    lastId: req.body.lastId,
    id: req.body.id,
    userid: username,
  };

  secretUseCase.addSubsequentSecret(data)
    .then((response) => createResponsePasswordAdded(res, response))
    .catch((err) => errorUseCase.createErrorHttp({ res, err, status: 500 }));
});

module.exports = router;
