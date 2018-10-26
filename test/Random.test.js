const assert = require('assert');
const deploy = require('./config/deploy');
let contract;

describe('Random',function(){
    beforeEach(async function() {
        contract = await deploy.randomContract;
    });

    it('test random number should greater than 0 and less than limit : positive limit', async function() {
        const limit = 33;
        const randomNumber = await contract.methods.generateRandomWithin(limit).call();

        assert.ok(randomNumber > 0 && randomNumber <= limit , 'greater than 0 and less than limit.');
    });

    it('test random number should greater than 0 and less than limit : negative limit', async function() {
        const limit = -6;
        try {
            await contract.methods.generateRandomWithin(limit).call();
        } catch(err) {
            assert.equal(err.results[err.hashes[0]].reason,'limit must be positive.', 'test validation');
        }
    });

    it('test random number should greater than 0 and less than limit : zero in limit', async function() {
        const limit = 0;
        try {
            await contract.methods.generateRandomWithin(limit).call();
        } catch(err) {
            assert.equal(err.results[err.hashes[0]].reason,'limit must be positive.', 'test validation');
        }
    });
});
