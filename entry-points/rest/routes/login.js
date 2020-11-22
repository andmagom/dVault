const { Router } = require('express');
const secretUseCase = require('../../../use-cases/secret');
const authUseCase = require('../../../use-cases/auth');
const errorUseCase = require('../../../use-cases/error');

const router = Router();

function createResponse(res, data) {
  res.status(201).send(data);
}

router.get('/', (req, res) => {
  const authHeader = req.headers.authorization;
  const auth = authUseCase.getAuth(authHeader);
  secretUseCase.getFirsSecret(auth)
    .then((firstSecret) => authUseCase.createSession(req.session, auth, firstSecret))
    .then((firstSecret) => createResponse(res, firstSecret))
    .catch((err) => errorUseCase.createErrorHttp({ res, err, status: 500 }));
});

module.exports = router;
