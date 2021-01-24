var Web3 = require('web3');
var fs = require('fs')
require('dotenv').config();
const BigNumber = require('bignumber.js');
//const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_URL));
const erc20contractJSON = fs.readFileSync('./ERC20.json')
const parabellumcontractJSON = fs.readFileSync('./Parabellum_In_General_V3_0_1.json')
const erc20ABI = JSON.parse(erc20contractJSON);
const parabellumABI = JSON.parse(parabellumcontractJSON)

//Mainnet contract address for UniswapV2_ZapIn_General_V3_0_1
const parabellumAddress = "0xD3cF4e98e1e432B3d6Ae42AE406A78F2AC8293D0";
const parabellumContract = new web3.eth.Contract(parabellumABI, parabellumAddress);
//fromToken is the wallet address where the ether must be coming from to add to the Uniswap liquidity
//const fromToken = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0'
//USDC
const fromToken = '0x514910771AF9Ca656af840dff83E8264EcF986CA'

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
    //Ganache account
    const _toWhomToIssue = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
    //test with ether that is the ETH address
    const FromTokenContractAddress = '0x0000000000000000000000000000000000000000';
    /*
    * The pair address is the target liquid pool contract address.  In this case
    * I am adding 0.05 of my ETH into Uniswap V2 USDC/ETH pair
    */
    const pairAddress = '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc'
    //this is the amount of ETH that is being added.  This is should probably be converted from Eth to Wei
    const amount = new BigNumber(100000000000000000)
    //this is the slippage tolerance which is in percent but is converted into uint256
    const minPoolTokens = 634999265606;
    //this is the exchange contract target returned by Zapper and it happens to be 0x: Exchange Proxy contract target
    const allowanceTarget = '0xDef1C0ded9bec7F1a1670819833240f027b25EfF'
    //for whatever reason, this happens to be the same as the allowanceTarget
    const swapTarget = '0xDef1C0ded9bec7F1a1670819833240f027b25EfF'
    //data holder from call on line 1104 in Parabellum_Uniswap_In_V1
const swapData =
'0xd9627aa4000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000b1a2bc2ec500000000000000000000000000000000000000000000000000000000000003a8e1d700000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48869584cd000000000000000000000000f4e386b070a18419b5d3af56699f8a438dd18e890000000000000000000000000000000000000000000000ecbdf913f36000ef0d';
const daiToken = new web3.eth.Contract(erc20ABI, fromToken);


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
            ).send({from:'0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', value:amount});
            console.log(`Result ${result.LPBought} :: ${result.goodwillPortion}`);
        } catch (error) {
            console.log('Unable to add', error)
        }
}


async function addToLiquidSigned() {
                const myContract = new web3.eth.Contract(parabellumABI,parabellumAddress);
                const tx = {
                    from: '0xf584F8728B874a6a5c7A8d4d387C9aae9172D621',
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
                const signPromise = web3.eth.accounts.signTransaction(tx, '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d') //privatekey
                signPromise.then((signedTx => {
                    const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
                    sentTx.on("receipt", receipt => {
                        console.log(`receipt ${receipt.LPBought} :: ${receipt.goodwillPortion}`)
                    });

                    sentTx.on("error", err => {
                        console.log(`Error: ${err}`)
                    });

                })).catch((err) => {
                    console.log(`Unable to sign transaction ${err}`)
                })
}

//addToLiquid();
//addToLiquidSigned();
//Aproval should be required if exhchanging or adding into a pool that is not ETH to ETH.  
approveToken(daiToken, parabellumAddress, amount)

