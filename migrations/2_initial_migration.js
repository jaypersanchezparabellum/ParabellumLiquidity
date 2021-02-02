const ParabellulmIn = artifacts.require("Parabellum_In_General_V3_0_1");
const goodwill = 65535;
module.exports = function (deployer) {
  deployer.deploy(ParabellulmIn,goodwill,"Parabellum Liquidity V0.1", "V0.1");
};
