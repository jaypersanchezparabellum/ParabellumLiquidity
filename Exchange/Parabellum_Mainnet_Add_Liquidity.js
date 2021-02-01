var Web3 = require('web3');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var fs = require('fs')
require('dotenv').config();
const BigNumber = require('bignumber.js');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_URL));
const erc20contractJSON = fs.readFileSync('./ERC20.json')
const parabellumcontractJSON = fs.readFileSync('./Parabellum_In_General_V3_0_1.json')
const erc20ABI = JSON.parse(erc20contractJSON);
const parabellumABI = JSON.parse(parabellumcontractJSON)
const parabellumAddress = process.env.ZAPIN_MAINNET;
const parabellumContract = new web3.eth.Contract(parabellumABI, parabellumAddress);


async function addToLiquidSigned(_swapData) {
    console.log(`PARAMS :: ${ZapInData.FromTokenContractAddress} :: ${ZapInData.pairAddress} :: ${ZapInData.amount} 
                        :: ${ZapInData.minPoolTokens} :: ${ZapInData.allowanceTarget} :: ${ZapInData.swapTarget} :: ${_swapData}`)
                const myContract = new web3.eth.Contract(parabellumABI,parabellumAddress);
                //get gas estimation for price and limit
                const _gasLimit = 1000000;
                let _gasPrice 
                gprice = web3.eth.getGasPrice(function(e,r) {
                    _gasPrice = r;
                    console.log(`Current Gas Price: ${e} :: ${r}`)
                })
                
                const tx = {
                    from: process.env.WALLET_ADDRESS,
                    to: ZapInData.pairAddress,
                    value:ZapInData.amount,
                    gasPrice:web3.utils.toHex(75000000000),
                    gasLimit:web3.utils.toHex(_gasLimit),
                    data: myContract.methods.ZapIn(
                                ZapInData.FromTokenContractAddress,
                                ZapInData.pairAddress,
                                ZapInData.amount,
                                ZapInData.minPoolTokens,
                                ZapInData.allowanceTarget,
                                ZapInData.swapTarget,
                                _swapData
                    ).encodeABI()
                }
                const signPromise = web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY)
                signPromise.then((signedTx => {
                    const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
                    sentTx.on("receipt", receipt => {
                        console.log('Liquidity Added')
                        console.log(`receipt ${receipt.LPBought} :: ${receipt.goodwillPortion}`)
                    });

                    sentTx.on("error", err => {
                        console.log(`Error: ${err}`)
                    });

                })).catch((err) => {
                    console.log(`Unable to sign transaction ${err}`)
                })
}


function addLiquidity() {
    //https://mainnet.api.0x.org/swap/v1/quote?sellToken=0xd0A1E359811322d97991E03f863a0C30C2cF029C&buyToken=0x1528f3fcc26d13f7079325fb78d9442607781c8c&buyAmount=100000000000000
    const Http = new XMLHttpRequest();
    const URL = `${process.env.MAINNET_API0XURL}?sellToken=ETH&buyToken=USDC&buyAmount=${ZapInData.amount}`
    console.log(URL)
    Http.open("GET",URL,true);
    
    Http.onreadystatechange = function(e) {
        console.log(Http.readyState + " :: " + Http.status )
                        if( Http.readyState == 4 && Http.status == 200 ) {
                                    console.log(Http.responseText);
                                    //strifiedData = JSON.stringify(Http.responseText)
                                    parsedData = JSON.parse( Http.responseText )
                                    swapData = parsedData.data
                                    console.log(swapData)
                                    addToLiquidSigned(swapData)
                        }
    }
    Http.send();
}

function gasEstimate() {}
function calculateSlippage() {}

/*
    FromTokenContractAddress - this will be the address of the originating token. If ETH is being added into the poll, the the address will be the ETH smart contract address
    pairAddress - The pair address is the target liquid pool contract address.  In this case.  I am adding 0.05 of my ETH into Uniswap V2 USDC/ETH pair
    amount - This is the amount of ETH being spent represented in Wei.  Eth = 0.01 is equal to Wei 10000000000000000 (1^17)
    minPoolTokens - This is the slippage tolerance.  
        1. Call getExpectedRate for 1 ETH equivalent worth of srcToken.
        2. Call getExpectedRate for actual srcToken amount.
    allowanceTarget - This is the exchange contract target.  This is, for now 0x Exchange
    swapTarget - Same as allowanceTarget (have to find out why the same value)
*/
//Liquidity pool payload data
const ZapInData = {
    FromTokenContractAddress : process.env.ETH_CONTRACT_ADDRESS,
    pairAddress : process.env.UNISWAPV2_USDC3_ETH_ADDRESS,
    amount: new BigNumber(3600000000000000), //0.0036 ETH
    minPoolTokens : 1262872576,
    allowanceTarget : process.env.MAINNET_OX_EXCHANGE_CONTRACT_ADDRESS,
    swapTarget : process.env.MAINNET_OX_EXCHANGE_CONTRACT_ADDRESS,
}
let swapData


/*
* Below are the function calls in order.
*/
//calculateSlippage(); 
addLiquidity()
