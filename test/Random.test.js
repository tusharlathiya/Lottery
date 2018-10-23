const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const json = require('./../build/contracts/Random.json');

const interface = json['abi'];
const bytecode = json['bytecode'];
let contract,account;

beforeEach(async function() {
    account = (await web3.eth.getAccounts())[0];
    contract = await new web3.eth.Contract(interface)
        .deploy({data: bytecode})
        .send({ from: account, gas: '1000000' });
});

describe('Random',function(){
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
