const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const newLogger = require('../../use-cases/logger');
const networkRoute = require('./routes/network');
const secretRoute = require('./routes/secret');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');

const COOKIE_SECRET = process.env.COOKIE_SECRET || 'dVault';

const logger = newLogger({
  console_level: 'info',
  service: 'app',
});
const app = express();
app.use(bodyParser.json());

app.use(session({
  saveUninitialized: false,
  resave: false,
  name: 'dVault',
  secret: COOKIE_SECRET,
  cookie: { maxAge: 60000 },
}));

app.use('/api/network', networkRoute);
app.use('/api/secret', secretRoute);
app.use('/api/login', loginRoute);
app.use('/api/register', registerRoute);

const port = process.env.APP_PORT || 8686;
app.listen(port, () => {
  logger.info(`dVault app listening at http://localhost:${port}`);
});
