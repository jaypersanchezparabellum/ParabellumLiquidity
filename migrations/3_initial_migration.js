const TetherToken = artifacts.require("TetherToken");

const _initialSupply = 1000000; //1 million
const _name = "Parabellum USDT Stablecoin";
const _symbol = "PUSDT";
const _decimals = 2;

module.exports = function (deployer) {
  deployer.deploy(TetherToken, _initialSupply, _name, _symbol, _decimals);
};
