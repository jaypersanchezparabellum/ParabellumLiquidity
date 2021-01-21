var Web3 = require('web3');
var fs = require('fs')
const BigNumber = require('bignumber.js');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

const erc20contractJSON = fs.readFileSync('./ERC20.json')
const parabellumcontractJSON = fs.readFileSync('./Parabellum_Uniswap_In_V1.json')
const erc20ABI = JSON.parse(erc20contractJSON);
const parabellumABI = JSON.parse(parabellumcontractJSON)

//Mainnet contract address for UniswapV2_ZapIn_General_V3_0_1
const parabellumAddress = "0xD3cF4e98e1e432B3d6Ae42AE406A78F2AC8293D0";
const parabellumContract = new web3.eth.Contract(parabellumABI, parabellumAddress);
//fromToken is the wallet address where the ether must be coming from to add to the Uniswap liquidity
const fromToken = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0'
const daiToken = new web3.eth.Contract(erc20ABI, fromToken);

/**
    @notice This function is used to invest in given Uniswap V2 pair through ETH/ERC20 Tokens
    @param _FromTokenContractAddress The ERC20 token used for investment (address(0x00) if ether)
    @param _pairAddress The Uniswap pair address
    @param _amount The amount of fromToken to invest
    @param _minPoolTokens Reverts if less tokens received than this
    @param _allowanceTarget Spender for the first swap
    @param _swapTarget Excecution target for the first swap
    @param swapData DEX quote data
    @return Amount of LP bought
     */
    const _toWhomToIssue = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
    //test with ether that is the ETH address
    const FromTokenContractAddress = '0x0000000000000000000000000000000000000000';
    /*
    * The pair address is the target liquid pool contract address.  In this case
    * I am adding 0.05 of my ETH into Uniswap V2 USDC/ETH pair
    */
    const pairAddress = '0xe41d2489571d322189246dafa5ebde1f4699f498'
    //this is the amount of ETH that is being added.  This is should probably be converted from Eth to Wei
    const amount = new BigNumber(100000000000000000)
    //this is the slippage tolerance which is in percent but is converted into uint256
    const minPoolTokens = 634999265606;
    //this is the exchange contract target returned by Zapper and it happens to be 0x: Exchange Proxy contract target
    const allowanceTarget = '0xDef1C0ded9bec7F1a1670819833240f027b25EfF'
    //for whatever reason, this happens to be the same as the allowanceTarget
    const swapTarget = '0xDef1C0ded9bec7F1a1670819833240f027b25EfF'
    //data holder from call on line 1104 in Parabellum_Uniswap_In_V1
    const swapData = '0x0';

    async function addToLiquid() {
        let result
        try {
            result = await parabellumContract.methods.ZapIn(
                FromTokenContractAddress,
                pairAddress,
                amount,
                minPoolTokens,
                allowanceTarget,
                swapTarget,
                swapData
            ).call();
            console.log(result);
        } catch (error) {
            console.log('Unable to add', error)
        }
    }

//addToLiquid();

const myContract = new web3.eth.Contract(parabellumABI,parabellumAddress);
const tx = {
    from: '0xB5A7b7658c8daA57AE9F538C0315d4fa44Fe0bE4',
    to: pairAddress,
    value:amount,
    gasLimit:web3.utils.toHex(6000000),
    data: myContract.methods.ZapIn(
        FromTokenContractAddress,
                pairAddress,
                amount,
                minPoolTokens,
                allowanceTarget,
                swapTarget,
                swapData
    ).encodeABI()
}
const signPromise = web3.eth.accounts.signTransaction(tx, '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d')
signPromise.then((signedTx => {
    const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
    sentTx.on("receipt", receipt => {
        console.log(`receipt ${receipt}`)
    });

    sentTx.on("error", err => {
        console.log(`Error: ${err}`)
    });

})).catch((err) => {
    console.log(`Unable to sign transaction ${err}`)
})