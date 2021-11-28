const AssetOwnership = artifacts.require("AssetOwnership");

module.exports = function(deployer) {
    deployer.deploy(AssetOwnership);
}