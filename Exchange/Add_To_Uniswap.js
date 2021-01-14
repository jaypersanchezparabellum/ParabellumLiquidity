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
    //test with ether
    const FromTokenContractAddress = '0x00';
    //wallet address where eth will be coming from.  Taken from Etherscan Mainnet
    const pairAddress = '0xe41d2489571d322189246dafa5ebde1f4699f498'
    const amount = 0.1;
    //set the slippage tolerance
    const minPoolTokens = 1.50;
    //allow slippage allowance.  due to prices changing constantly, the price might change in while transaction is being set
    const allowanceTarget = 0.05
    //is this the target contract that will hold the liquidity?  In this case contract address of Uniswap In?
    const _swapTarget = '0xD3cF4e98e1e432B3d6Ae42AE406A78F2AC8293D0'
    //data holder from call on line 1104 in Parabellum_Uniswap_In_V1
    const swapData = 0;

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

addToLiquid();