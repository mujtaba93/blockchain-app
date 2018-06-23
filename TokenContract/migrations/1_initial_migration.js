var Migrations = artifacts.require("./Migrations.sol");
var MyCoin = artifacts.require("./MyCoin.sol");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(MyCoin);
};
