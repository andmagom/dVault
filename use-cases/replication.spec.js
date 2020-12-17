const { assert } = require('chai');
const replicationUsecase = require('./replication');

describe('Replication Usecase Tests', () => {
  it('It must create a random hex with a fix bytes size', () => {
    const size = 10;

    const result = replicationUsecase.randomHex(size);

    assert.lengthOf(result, size * 2); // hex result must to be multiplied by 2
  });

  it('It must split and replicate the data', () => {
    const data = {
      username: 'andamgom',
      content: 'dVault',
      date: new Date(),
    };
    const dataString = JSON.stringify(data);
    const splitSize = 50;
    const nReplication = 3;

    const result = replicationUsecase.split(dataString, splitSize, nReplication);

    assert.lengthOf(result.chunks, Math.ceil(dataString.length / splitSize));
    assert.lengthOf(result.chunks[0].keys, nReplication);
  });
});
