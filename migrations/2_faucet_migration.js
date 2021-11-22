
const faucetContract = artifacts.require("Faucet") // the abi is called artifacts
module.exports = function(deployer){
    deployer.deploy(faucetContract);
}