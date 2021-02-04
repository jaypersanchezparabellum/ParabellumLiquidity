import './App.css';

import erc20contractJSON from './data/ERC20.json';
import parabellumcontractJSON from './data/Parabellum_In_General_V3_0_1.json';
import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import Web3 from 'web3';
let web3 = new Web3(window.ethereum);
require('dotenv').config();
const BigNumber = require('bignumber.js');
    


function addToPool() {
  //alert(`addToPool`)
  const web3 = new Web3(Web3.currentProvider || "https://ropsten.infura.io/v3/6fd2fd8e1b334661b0c38556bd48b257")
    web3.eth.net.getNetworkType()
    .then(network => {
      console.log(network) // should give you main if you're connected to the main network via metamask...
    })
    
}





function App() {

  let _amount = new BigNumber(1000000000000000)
  let _slippage = new BigNumber(16102705757875959344)
  /* set all data in these state variables */
  const [FromTokenContractAddress, setFromTokenContractAddress] = useState('0x0000000000000000000000000000000000000000');
  const [pairAddress, setpairAddress] = useState('0x648450d9c30b73e2229303026107a1f7eb639f6c');
  const [amount, setamount] = useState(_amount); 
  const [minPoolTokens, setminPoolTokens] = useState(_slippage);
  const [allowanceTarget, setallowanceTarget] = useState('0xdef1c0ded9bec7f1a1670819833240f027b25eff');
  const [swapTarget, setswapTarget] = useState('0xdef1c0ded9bec7f1a1670819833240f027b25eff');
  const [swapData, setswapData] = useState();
  const [httpprovider, sethttpprovider] = useState("https://ropsten.infura.io/v3/6fd2fd8e1b334661b0c38556bd48b257")
  
  
 
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider(httpprovider));
  }

  function transferToken() {
    window.web3 = new Web3(Web3.givenProvider || "https://ropsten.infura.io/v3/6fd2fd8e1b334661b0c38556bd48b257");
    window.ethereum.enable()
    .then(() => {
      window.web3.eth.sendTransaction({
        from: '0x923359F72080CFE2647711eD7BCb8fC25E938B7e',
        to: '0xd28A12D75D552b2FAc46f4Ea37FE2575AA91dEa7',
        value: 1000000000000000 //0.001
      })
    })
  }

  function parabellumAdd() {
    window.ethereum.enable()
    const parabellumAddress = '0xD3cF4e98e1e432B3d6Ae42AE406A78F2AC8293D0';
    const parabellumContract = new web3.eth.Contract(parabellumcontractJSON, parabellumAddress);
    window.web3 = new Web3(Web3.givenProvider || "https://mainnet.infura.io/v3/6fd2fd8e1b334661b0c38556bd48b257");
    const URL = `https://api.0x.org/swap/v1/quote?sellToken=WETH&buyToken=USDC&buyAmount=100000000000000`;
    let coinbase;

    /* DEBUG */
    web3.eth.getAccounts((error, accounts) => {
      coinbase = accounts[0]
      console.log(coinbase)
    })
    
    fetch(URL, { method:"GET",headers:{Accept:'application/json','Content-Type':'applicaiton/json'} })
    .then((response) => 
        //console.log(response.json())
        //parse out data for swapData
        response.json()
    )
    .then((response) => {
      console.log(response)
      //return response.data;
      return response
    })
    .then((swapData) => {
      //console.log( swapData.data );
      console.log(`GasPrice :: ${swapData.gasPrice}`)
      let _gasPrice = new BigNumber(50000);
      let _gasLimit = new BigNumber(100000000000);
      window.ethereum.enable();
      window.web3.eth.sendTransaction({
        from: coinbase,
        to: pairAddress,
        value:amount,
        gasPrice: web3.utils.toHex(_gasPrice),
        gasLimit: web3.utils.toHex(_gasLimit),
        data: parabellumContract.methods.ZapIn(
          FromTokenContractAddress,
          pairAddress,
          amount,
          minPoolTokens,
          allowanceTarget,
          swapTarget,
          swapData.data
        ).encodeABI()
      })
      .then((tx) => {
        
        console.log(tx)
        //settxreceipt(tx);
      })
      .catch((error) => {
        
        console.log(error)
        //settxreceipt(error)
      })
    }).catch((error) => {
      
      console.log(error);
      //settxreceipt(error);
    })
    
    
  }
  
 
  return (
    <div className="App">
                <div>
                    <div>
                    <input type='text' id='ethamount' placeholder='ETH Amount' value='0.001' />
                    </div>
                    <div>
                    <input type='text' id='FromTokenContractAddress' placeholder='FromTokenContractAddress' value={FromTokenContractAddress} />
                    </div>
                    <div>
                    <input type='text' id='pairAddress' placeholder='pairAddress' value={pairAddress} />
                    </div>
                    <div>
                    <input type='text' id='amount' placeholder='amount' value={amount} />
                    </div>
                    <div>
                    <input type='text' id='minPoolTokens' placeholder='minPoolTokens' value={minPoolTokens} />
                    </div>
                    <div>
                    <input type='text' id='allowanceTarget' placeholder='allowanceTarget' value={allowanceTarget} />
                    </div>
                    <div>
                    <input type='text' id='swapTarget' placeholder='swapTarget' value={swapTarget} />
                    </div>
                </div>

                <button id="addliquidity" onClick={parabellumAdd}>Add To Pool</button>  
    </div>
  );
}

export default App;
