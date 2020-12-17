const { assert } = require('chai');
const loggerUsecase = require('./logger');

describe('Logger Usecase Tests', () => {
  it('Logger must be created with the options specified', () => {
    const logger = loggerUsecase({
      console_level: 'info',
      service: 'app',
    });

    assert.equal(logger.defaultMeta.service, 'app');
  });
});
