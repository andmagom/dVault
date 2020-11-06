const { createLogger, format, transports } = require('winston');

const { combine, timestamp } = format;

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    format.json(),
  ),
  defaultMeta: { service: 'dVault-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new transports.Console({
      level: 'info',
      format: combine(
        timestamp(),
        format.simple(),
      ),
    }),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
/*
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
*/
module.exports = logger;
