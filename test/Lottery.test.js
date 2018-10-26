const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const deploy = require('./config/deploy');
let lotteryContract;

describe('Lottery',function() {

    beforeEach(async function() {
        lotteryContract = await deploy.lotteryContract;
    });

    it('test scheme generation function and check schemeID : positive', async function() {
        const schemeId = await lotteryContract.methods.generateScheme(10).call();
        assert.equal(schemeId, 1, 'generate Scheme Id.');
    });

    it('test scheme generation function and check schemeID : negative', async function() {
        try {
            await lotteryContract.methods.generateScheme(-5).call();
        } catch(error) {
            assert.equal(error.results[error.hashes[0]].reason,'Amount must be positive.', 'test validation');
        }
    });

    it('test scheme generation function and check schemeID : Zero', async function() {
        try {
            await lotteryContract.methods.generateScheme(0).call();
        } catch(error) {
            assert.equal(error.results[error.hashes[0]].reason,'Amount must be positive.', 'test validation');
        }
    });
});

