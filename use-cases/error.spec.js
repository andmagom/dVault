const { assert } = require('chai');
const sinon = require('sinon');
const errorUsecase = require('./error');

describe('Error Usecase Tests', () => {
  it('It must create an error object', () => {
    const title = 'dVault error';
    const message = 'dVault can not save your password';

    const result = errorUsecase.createError(title, message);

    assert.equal(result.message, message);
    assert.equal(result.title, title);
  });

  it('It must create an error http object', () => {
    // eslint-disable-next-line arrow-body-style
    const send = () => {
      return {
        send: () => sinon.spy(),
      };
    };
    const res = {
      status: sinon.spy(send),
    };

    const data = {
      res,
      status: 404,
      err: 'Error Test',
    };

    errorUsecase.createErrorHttp(data);

    assert.isTrue(res.status.called);
    assert.equal(res.status.callCount, 1);
  });
});
