var Web3 = require('web3');
var fs = require('fs')
const BigNumber = require('bignumber.js');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

const erc20contractJSON = fs.readFileSync('./ERC20.json')
const parabellumcontractJSON = fs.readFileSync('./Parabellum_Out_General_V2_1.json')
const erc20ABI = JSON.parse(erc20contractJSON);
const parabellumABI = JSON.parse(parabellumcontractJSON)

//Mainnet contract address for UniswapV2_ZapOut_General_V2_1
const parabellumAddress = "0x79B6C6F8634ea477ED725eC23b7b6Fcb41F00E58";
const parabellumContract = new web3.eth.Contract(parabellumABI, parabellumAddress);

/**
    @notice This function is used to zapout of given Uniswap pair in the bounded tokens
    @param _FromUniPoolAddress The uniswap pair address to zapout
    @param _IncomingLP The amount of LP.  This is the amount being withdrawn from the pool
    @return the amount of pair tokens received after zapout
*/
//Contract Address where minted token is supposed to be deposited - Ganache account instead
const _ToTokenContractAddress = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
//From UniswapV2_ZapOut_General_V2_1
const _FromUniPoolAddress = '0x79B6C6F8634ea477ED725eC23b7b6Fcb41F00E58'
const _IncomingLP = new BigNumber(100000000000000000)
const _minTokensRec = new BigNumber(100000000000000000)

async function withdrawFromLiquid() {
    console.log(`PARAMS :: ${_FromUniPoolAddress} :: ${_IncomingLP} :: ${_minTokensRec}`);
    let result
    try {
        result = await parabellumContract.methods.ZapOut(
                                                        _ToTokenContractAddress,
                                                        _FromUniPoolAddress,
                                                        _IncomingLP,
                                                        _minTokensRec
                                                        ) ;
        console.log(`Result ${result}`);
    } catch (error) {
        console.log('Withdrawal Attempt Failed', error)
    }
}

async function addToLiquidSigned() {
    const myContract = new web3.eth.Contract(parabellumABI,parabellumAddress);
    const tx = {
        from: _FromUniPoolAddress,
        to: _ToTokenContractAddress,
        value:_IncomingLP,
        gasLimit:web3.utils.toHex(6000000),
        data: myContract.methods.ZapOut(
            _ToTokenContractAddress,
            _FromUniPoolAddress,
            _IncomingLP,
            _minTokensRec
        ).encodeABI()
    }
    const signPromise = web3.eth.accounts.signTransaction(tx, '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d') //privatekey
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
}

//withdrawFromLiquid();
addToLiquidSigned();


