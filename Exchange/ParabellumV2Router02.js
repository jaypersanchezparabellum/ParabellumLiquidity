var Web3 = require('web3');
var fs = require('fs')
const BigNumber = require('bignumber.js');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

const erc20contractJSON = fs.readFileSync('./ERC20.json')
const parabellumcontractJSON = fs.readFileSync('./ParabellumV2Router02.json')
const erc20ABI = JSON.parse(erc20contractJSON);
const parabellumABI = JSON.parse(parabellumcontractJSON)

//Mainnet contract address for UniswapV2Router02
const parabellumAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const parabellumContract = new web3.eth.Contract(parabellumABI, parabellumAddress);