// javascript:  transact with deployed Uniswap exchange contract

const Tx = require('ethereumjs-tx')
var Web3 = require('web3');
var fs = require('fs')
const BigNumber = require('bignumber.js');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

const erc20contractJSON = fs.readFileSync('./ERC20.json')
const parabellumcontractJSON = fs.readFileSync('./Parabellum_Uniswap_In_V1.json')
const erc20ABI = JSON.parse(erc20contractJSON);
const parabellumABI = JSON.parse(parabellumcontractJSON)


//let web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/"));
// the address that will send the test transaction
const addressFrom = '0x0e364eb0ad6eb5a4fc30fc3d2c2ae8ebe75f245c'
const exchange_addr = '0x416F1Ac032D1eEE743b18296aB958743B1E61E81'
const privKey = process.env.privateKey
// the exchange contract address
const addressTo = '0xCC4d8eCFa6a5c1a84853EC5c0c08Cc54Cb177a6A'
const contract = new web3.eth.Contract(
  JSON.parse(abi),
  addressTo
);
const TOKEN_ADDED = web3.utils.toHex(100*10**18) 
const tx = contract.methods.approve(exchange_addr, TOKEN_ADDED);
const encodedABI = tx.encodeABI();

// Signs the given transaction data and sends it.
function sendSigned(txData, cb) {
  const privateKey = new Buffer(privKey, 'hex')
  const transaction = new Tx(txData)
  transaction.sign(privateKey)
  const serializedTx = transaction.serialize().toString('hex')
  web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
}

// get the number of transactions sent so far so we can create a fresh nonce
web3.eth.getTransactionCount(addressFrom).then(txCount => {

  // construct the transaction data
  const txData = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(6000000),
    gasPrice: web3.utils.toHex(10000000000), // 10 Gwei
    to: addressTo,
    from: addressFrom,
    data: encodedABI,
  }

  // fire away!
  sendSigned(txData, function(err, result) {
    if (err) return console.log('error', err)
    console.log('sent', result)
  })

})
