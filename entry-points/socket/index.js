const io = require('socket.io');
const newLogger = require('../../use-cases/logger');
const secretUseCase = require('../../use-cases/secret');

let ioServer;

const logger = newLogger({
  console_level: 'info',
  service: 'socket',
});

function init(httpServer) {
  ioServer = io(httpServer);
  ioServer.on('connection', (socket) => {
    logger.info('a user connected');

    socket.on('disconnect', () => {
      logger.info('user disconnected');
    });

    socket.on('GetSecrets', (data) => {
      logger.info('Getting Secrets');
      secretUseCase.getSecrets(data, socket);
    });
  });
}

module.exports = init;
