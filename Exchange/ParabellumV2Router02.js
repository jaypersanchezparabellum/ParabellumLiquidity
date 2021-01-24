var Web3 = require('web3');
var fs = require('fs')
const BigNumber = require('bignumber.js');
//const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_URL));

const erc20contractJSON = fs.readFileSync('./ERC20.json')
const parabellumcontractJSON = fs.readFileSync('./ParabellumV2Router02.json')
const erc20ABI = JSON.parse(erc20contractJSON);
const parabellumABI = JSON.parse(parabellumcontractJSON)

//Mainnet contract address for UniswapV2Router02
const parabellumAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const parabellumContract = new web3.eth.Contract(parabellumABI, parabellumAddress);
 
/*
    address tokenA	        A pool token.
    address tokenB	        A pool token.
    uint amountADesired	    The amount of tokenA to add as liquidity if the B/A price is <= amountBDesired/amountADesired (A depreciates).
    uint amountBDesired	    The amount of tokenB to add as liquidity if the A/B price is <= amountADesired/amountBDesired (B depreciates).
    uint amountAMin	        Bounds the extent to which the B/A price can go up before the transaction reverts. Must be <= amountADesired.
    uint amountBMin	        Bounds the extent to which the A/B price can go up before the transaction reverts. Must be <= amountBDesired. 
    uint to address         Recipient of the liquidity tokens.
    uint deadline	        Unix timestamp after which the transaction will revert.
    uint amountA	        The amount of tokenA sent to the pool.
    uint amountB	        The amount of tokenB sent to the pool.
    uint liquidity	        The amount of liquidity tokens minted.
*/

//Calculate ratio between token DAI/ETH = 200:1

//USDC
const tokenA = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
//ETH
const tokenB = '0x0000000000000000000000000000000000000000'
const amountADesired
const amountBDesired
const amountAMin
const amountBMin
const to = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
const deadline
const amountA
const amountB
const liquidity



async function addToLiquid() {
    let result
    try {
        result = await parabellumContract.methods.addToLiquidy(
            tokenA,
            tokenB,
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin,
            deadline,
            amountA,
            amountB,
            liquidity
        );
        console.log(`Result ${result}`);
    } catch (error) {
        console.log('Unable to add', error)
    }
}