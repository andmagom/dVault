const { createLogger, format, transports } = require('winston');

const { combine, timestamp } = format;

function newLogger(opts) {
  const logger = createLogger({
    level: 'info',
    format: combine(
      timestamp(),
      format.json(),
    ),
    defaultMeta: { service: opts.service },
    transports: [
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new transports.Console({
        level: opts.console_level,
        format: combine(
          timestamp(),
          format.simple(),
        ),
      }),
      new transports.File({ filename: 'error.log', level: 'error' }),
      new transports.File({ filename: 'combined.log' }),
    ],
  });

  return logger;
}

module.exports = newLogger;
