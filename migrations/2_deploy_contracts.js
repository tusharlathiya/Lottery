var lottery   = artifacts.require("./Lottery.sol");
var randomLib = artifacts.require("./Random.sol");

module.exports = function(deployer) {
  deployer.deploy(randomLib);
  deployer.link(randomLib,lottery);
  deployer.deploy(lottery);
};
