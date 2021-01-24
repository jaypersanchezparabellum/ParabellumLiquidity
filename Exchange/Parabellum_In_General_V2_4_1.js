var Web3 = require('web3');
var fs = require('fs')
const BigNumber = require('bignumber.js');
//const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_URL));
const erc20contractJSON = fs.readFileSync('./ERC20.json')
const parabellumcontractJSON = fs.readFileSync('./Parabellum_In_General_V2_4_1.json')
const erc20ABI = JSON.parse(erc20contractJSON);
const parabellumABI = JSON.parse(parabellumcontractJSON)

//Mainnet contract address for UniswapV2_ZapIn_General_V2_4_1
const parabellumAddress = '0x0286Ab4C526C0F28EC31dBb08755C999f441A58F'
const parabellumContract = new web3.eth.Contract(parabellumABI, parabellumAddress);

//fromToken is the wallet address where the ether must be coming from to add to the Uniswap liquidity
const fromToken = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0'
const daiToken = new web3.eth.Contract(erc20ABI, fromToken);

/**
    @notice This function is used to invest in given Uniswap V2 pair through ETH/ERC20 Tokens
    @param _FromTokenContractAddress The ERC20 token used for investment (address(0x00) if ether)
    @param _ToUnipoolToken0 The Uniswap V2 pair token0 address
    @param _ToUnipoolToken1 The Uniswap V2 pair token1 address
    @param _amount The amount of fromToken to invest
    @param _minPoolTokens Reverts if less tokens received than this
    @return Amount of LP bought
*/

//Forked address for virtual use
const _toWhomToIssue = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
//Uniswap V2 USDC/ETH
const _ToUnipoolToken0 = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f' //<== this is Uniswap V2: Factory Contract address from Etherscan should be USDC
//const _ToUnipoolToken1 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' //<== this is contract address to WETH

//Uniswap V2 USDC/ETH
//const _ToUnipoolToken0 = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' //USDC contract address from etherscan
const _ToUnipoolToken1 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' //WETH

//test with ether that is the ETH address
const _FromTokenContractAddress = "0x0000000000000000000000000000000000000000";
                                          

//this is the amount of ETH that is being added.  This is should probably be converted from Eth to Wei
//const amount = new BigNumber('0.01');
const amount = new BigNumber(100000000000000000)
//this is the slippage tolerance which is in percent but is converted into uint256
const minPoolTokens = 634999265606;

    

    async function addToLiquid() {
        //console.log(`PARAMS :: ${_toWhomToIssue} :: ${_FromTokenContractAddress} :: ${_ToUnipoolToken0} :: ${_ToUnipoolToken1} :: ${amount} :: ${minPoolTokens}`);
        let result
        try {
            result = await parabellumContract.methods.ZapIn(
                _toWhomToIssue,
                _FromTokenContractAddress,
                _ToUnipoolToken0,
                _ToUnipoolToken1,
                amount,
                minPoolTokens
            ).send({from:_toWhomToIssue, value:amount});;
            console.log(`Result ${result[0]} :: ${result[1]}`);
            console.log(result)
        } catch (error) {
            console.log('Unable to add', error)
        }
    }


async function addToLiquidSigned() {
                const myContract = new web3.eth.Contract(parabellumABI,parabellumAddress);
                const tx = {
                    from: '0xB5A7b7658c8daA57AE9F538C0315d4fa44Fe0bE4',
                    to: _ToUnipoolToken0,
                    value:amount,
                    gasLimit:web3.utils.toHex(6000000),
                    data: myContract.methods.ZapIn(
                        _toWhomToIssue,
                        _FromTokenContractAddress,
                        _ToUnipoolToken0,
                        _ToUnipoolToken1,
                        amount,
                        minPoolTokens
                    ).encodeABI()
                }
                const signPromise = web3.eth.accounts.signTransaction(tx, '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d') //private key
                signPromise.then((signedTx => {
                    const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
                    sentTx.on("receipt", receipt => {
                        //console.log(`receipt ${receipt.LPBought} :: ${receipt.goodwillPortion}`)
                        console.log(result)
                    });

                    sentTx.on("error", err => {
                        console.log(`SentTx ${err}`)
                    });

                })).catch((err) => {
                    console.log(`Unable to sign transaction ${err}`)
                })
}

addToLiquid();
//addToLiquidSigned();