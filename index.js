require('dotenv').config();
const httpServer = require('./entry-points/rest');
require('./entry-points/socket')(httpServer);
require('./use-cases/network').createNetwork();
