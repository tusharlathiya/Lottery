const linker = require('solc/linker');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const lottery = require('../../build/contracts/Lottery.json');
const random = require('../../build/contracts/Random.json');
let account;

async function randomDeploy() {
    account = (await web3.eth.getAccounts())[0];
    return await new web3.eth.Contract(random['abi'])
        .deploy({data: random['bytecode']})
        .send({from: account, gas: '1000000'});
}

async function lotteryDeploy() {
    account = (await web3.eth.getAccounts())[0];
    const randomContract = await randomDeploy();
    const lotteryByteCode = await linker.linkBytecode(lottery['bytecode'], {'Random': randomContract.options.address});
    return await new web3.eth.Contract(lottery['abi'])
        .deploy({data: lotteryByteCode})
        .send({from: account, gas: '1000000'});

}

module.exports = {
    randomContract : randomDeploy(),
    lotteryContract : lotteryDeploy()
};
