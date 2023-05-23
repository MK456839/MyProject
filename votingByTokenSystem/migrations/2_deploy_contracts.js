const VotingInstance = artifacts.require("VotingByToken");

module.exports = function(deployer) {
  deployer.deploy(VotingInstance, 10000, 10, ["Alice", "Bob", "Cary"]);
};
