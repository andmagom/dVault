const express = require('express');
const bodyParser = require('body-parser');
const newLogger = require('../../use-cases/logger');
const networkRoute = require('./routes/network');
const secretRoute = require('./routes/secret');

const logger = newLogger({
  console_level: 'info',
  service: 'app',
});
const app = express();
app.use(bodyParser.json());

app.use('/network', networkRoute);
app.use('/secret', secretRoute);

const port = process.env.APP_PORT || 8686;
app.listen(port, () => {
  logger.info(`dVault app listening at http://localhost:${port}`);
});
