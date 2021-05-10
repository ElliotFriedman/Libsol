const MockContractToPause = artifacts.require("MockContractToPause");

module.exports = function (deployer) {
  deployer.deploy(MockContractToPause, []);
};
