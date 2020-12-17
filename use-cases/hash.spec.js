const { assert } = require('chai');
const hashUsecase = require('./hash');

describe('Hash Usecases Tests', () => {
  it('Object hash always return the same digest', () => {
    const data = {
      username: 'andmagom',
    };

    const hash1 = hashUsecase.objectHash(data);
    const hash2 = hashUsecase.objectHash(data);

    assert.equal(hash1, hash2);
  });

  it('Getting a 256 bit hash key', () => {
    const key = 'dVaultAppOverTor';

    const hash1 = hashUsecase.hashKey(key);

    assert.lengthOf(hash1, 32);
  });
});
