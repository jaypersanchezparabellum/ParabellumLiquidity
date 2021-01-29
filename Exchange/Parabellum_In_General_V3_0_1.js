var Web3 = require('web3');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var fs = require('fs')
require('dotenv').config();
const BigNumber = require('bignumber.js');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_MAINNET));
const erc20contractJSON = fs.readFileSync('./ERC20.json')
const parabellumcontractJSON = fs.readFileSync('./Parabellum_In_General_V3_0_1.json')
const erc20ABI = JSON.parse(erc20contractJSON);
const parabellumABI = JSON.parse(parabellumcontractJSON)

const parabellumAddress = process.env.ZAPIN_MAINNET;
const parabellumContract = new web3.eth.Contract(parabellumABI, parabellumAddress);

function approveToken(tokenInstance, receiver, amount) {
    tokenInstance.methods.approve(receiver, amount).send({ from: _toWhomToIssue }, async function(error, txHash) {
        if (error) {
            console.log("ERC20 could not be approved", error);
            return false;
        }
        console.log("ERC20 token approved to " + receiver);
        const status = await waitTransaction(txHash);
        if (!status) {
            console.log("Approval transaction failed.");
            return false;
        }
        parabellumContract.methods.ZapIn(
            FromTokenContractAddress,
            pairAddress,
            amount,
            minPoolTokens,
            allowanceTarget,
            swapTarget,
            swapData
        ).send({from:_toWhomToIssue, value:amount}, async function(error, txHash) {
            if (error) {
                console.log("Unable to add into liquidity pool", error);
                return;
            }
            const status = await waitTransaction(txHash);
            // We check the final balances after the swap for logging purpose
            let ethBalanceAfter = await web3.eth.getBalance(_toWhomToIssue);
            let daiBalanceAfter = await daiToken.methods.balanceOf(_toWhomToIssue).call();
            console.log("Final Status: ", status)
            console.log("Final balances:")
            console.log("Change in ETH balance", new BigNumber(ethBalanceAfter).minus(ethBalanceBefore).shiftedBy(-fromTokenDecimals).toFixed(2));
            console.log("Change in USDC balance", new BigNumber(daiBalanceAfter).minus(daiBalanceBefore).shiftedBy(-fromTokenDecimals).toFixed(2))
        });
    })
}

async function waitTransaction(txHash) {
    let tx = null;
    while (tx == null) {
        tx = await web3.eth.getTransactionReceipt(txHash);
        //await sleep(2000);
        //setTimeout(() => {  console.log("Transaction Done!"); }, 2000);
    }
    console.log("Transaction " + txHash + " was mined.");
    return (tx.status);
}


async function addToLiquid() {
        console.log(`PARAMS :: ${FromTokenContractAddress} :: ${pairAddress} :: ${amount} :: ${minPoolTokens} :: ${allowanceTarget} :: ${swapTarget}`);
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
            ).send({from:'0xB5A7b7658c8daA57AE9F538C0315d4fa44Fe0bE4', value:amount});
            console.log(`Result ${result.LPBought} :: ${result.goodwillPortion}`);
        } catch (error) {
            console.log('Unable to add', error)
        }
}


async function addToLiquidSigned(_swapData) {
    console.log(`PARAMS :: ${ZapInData.FromTokenContractAddress} :: ${ZapInData.pairAddress} :: ${ZapInData.amount} 
                        :: ${ZapInData.minPoolTokens} :: ${ZapInData.allowanceTarget} :: ${ZapInData.swapTarget} :: ${_swapData}`)
                const myContract = new web3.eth.Contract(parabellumABI,parabellumAddress);
                const tx = {
                    from: process.env.WALLET_ADDRESS,
                    to: ZapInData.pairAddress,
                    value:ZapInData.amount,
                    gasPrice:web3.utils.toHex(5500000000),
                    gasLimit:web3.utils.toHex(2000000),
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

function calculateSlippage() {

}

function addLiquidity() {
    //https://mainnet.api.0x.org/swap/v1/quote?sellToken=0xd0A1E359811322d97991E03f863a0C30C2cF029C&buyToken=0x1528f3fcc26d13f7079325fb78d9442607781c8c&buyAmount=100000000000000
    const Http = new XMLHttpRequest();
    const URL = `${process.env.MAINNET_API0XURL}?sellToken=ETH&buyToken=USDC&buyAmount=${ZapInData.amount}`
    console.log(URL)
    Http.open("GET",URL,true);
    
    Http.onreadystatechange = function(e) {
        
                        if( Http.readyState == 4 && Http.status == 200 ) {
                                    //console.log(Http.responseText);
                                    //strifiedData = JSON.stringify(Http.responseText)
                                    parsedData = JSON.parse( Http.responseText )
                                    swapData = parsedData.data
                                    addToLiquidSigned(swapData)
                        }
    }
    Http.send();
}



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
    amount: new BigNumber(1000000000000000), //0.001 ETH
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
//addToLiquidSigned();
/*
*   addToLiquid();
*   Aproval should be required if exhchanging or adding into a pool that is not ETH to ETH.  
*   approveToken(daiToken, parabellumAddress, amount)
*/
