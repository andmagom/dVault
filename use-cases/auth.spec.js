const { assert } = require('chai');
const authUseCase = require('./auth');

describe('Auth Usecase Tests', () => {
  it('Getting username and password successfully', () => {
    const data = 'Basic YWRtaW46ZFZhdWx0';
    const result = authUseCase.getAuth(data);
    assert.equal(result.username, 'admin');
    assert.equal(result.password, 'dVault');
  });

  it('Creating a session successfully', () => {
    const session = {};
    const data = {
      username: 'andmagom',
    };
    const body = 'Result';

    const result = authUseCase.createSession(session, data, body);

    assert.equal(session.username, data.username);
    assert.equal(result, body);
  });
});
