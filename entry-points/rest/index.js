const express = require('express');
const logger = require('../../use-cases/logger');

const app = express();
const port = process.env.APP_PORT || 8686;

app.listen(port, () => {
  logger.info(`dVault app listening at http://localhost:${port}`);
});
