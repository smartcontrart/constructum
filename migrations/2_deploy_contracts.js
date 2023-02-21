var Constructum = artifacts.require("Constructum");
var ConstructumMint = artifacts.require("ConstructumMint");

module.exports = async function(deployer) {
  await deployer.deploy(Constructum);
  await deployer.deploy(ConstructumMint);
};
