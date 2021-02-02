import './App.css';
import erc20contractJSON from './data/ERC20.json';
import parabellumcontractJSON from './data/Parabellum_In_General_V3_0_1.json';
import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import Web3 from 'web3';

let web3 = new Web3(window.ethereum);
//web3.eth.getAccounts().then(console.log);
    

function addToPool() {
  //alert(`addToPool`)
  const web3 = new Web3(Web3.currentProvider || "https://ropsten.infura.io/v3/6fd2fd8e1b334661b0c38556bd48b257")
    web3.eth.net.getNetworkType()
    .then(network => {
      console.log(network) // should give you main if you're connected to the main network via metamask...
    })
    
}

function transferToken() {
  window.web3 = new Web3(Web3.givenProvider || "https://ropsten.infura.io/v3/6fd2fd8e1b334661b0c38556bd48b257");
  window.ethereum.enable()
  .then(() => {
    window.web3.eth.sendTransaction({
      from: '0xB5A7b7658c8daA57AE9F538C0315d4fa44Fe0bE4',
      to: '0xab48918a1E997A43423b19B9Cc50f59a251bF0f3',
      value: 1000000000000000 //0.001
    })
  })
  /*let web3 = new Web3(Web3.givenProvider || "https://mainnet.infura.io/v3/6fd2fd8e1b334661b0c38556bd48b257")
  web3.eth.unlockAccount('0xB5A7b7658c8daA57AE9F538C0315d4fa44Fe0bE4','@1B3RT@L!fe', 5000);
  web3.eth.sendTransaction({
    from: '0xB5A7b7658c8daA57AE9F538C0315d4fa44Fe0bE4',
    to: '0xab48918a1E997A43423b19B9Cc50f59a251bF0f3',
    value: 1000000000000000 //0.001
  })
  .catch(error => {
    console.log(`Error ${error}`)
  })*/
}

function parabellumAdd() {
  const parabellumAddress = process.env.ZAPIN_MAINNET;
  const parabellumContract = new web3.eth.Contract(parabellumcontractJSON, '0x8B5BE234D39425620216145169c866e335F20794');
  window.web3 = new Web3(Web3.givenProvider || "https://ropsten.infura.io/v3/6fd2fd8e1b334661b0c38556bd48b257");
  window.ethereum.enable()
  .then(() => {
    window.web3.eth.sendTransaction({
                    from: '0x923359F72080CFE2647711eD7BCb8fC25E938B7e',
                    to: '0x4A6a2F8c7b5F3e756868bc9AA24693aDb17f710f',
                    value:1000000000000000,
                    gasPrice:68000000,
                    gasLimit:1000000,
                    data: parabellumContract.methods.ZapIn(
                      '0xc778417e063141139fce010982780140aa0cd5ab',
                      '0x4A6a2F8c7b5F3e756868bc9AA24693aDb17f710f',
                      1000000000000000,
                      1262872576,
                      '0xfb2dd2a1366de37f7241c83d47da58fd503e2c64',
                      '0xfb2dd2a1366de37f7241c83d47da58fd503e2c64',
                      '0X0'
                    ).encodeABI()
    })
  })
}

function App() {

  const [FromTokenContractAddress, setFromTokenContractAddress] = useState(process.env.ETH_CONTRACT_ADDRESS);
  const [pairAddress, setpairAddress] = useState(process.env.KOVAN_USDT_Tether_Token);
  const [amount, setamount] = useState(1000000000000000);
  const [minPoolTokens, setminPoolTokens] = useState(1262872576);
  const [allowanceTarget, setallowanceTarget] = useState(process.env.KOVAN_OX_EXCHANGE_CONTRACT_ADDRESS);
  const [swapTarget, setswapTarget] = useState(process.env.KOVAN_OX_EXCHANGE_CONTRACT_ADDRESS);
  const [swapData, setswapData] = useState();
 
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/6fd2fd8e1b334661b0c38556bd48b257"));
  }
 
  
  
  return (
    <div className="App">
                <div>
                    <div>
                    <input type='text' id='ethamount' placeholder='ETH Amount' value='0.001' />
                    </div>
                    <div>
                    <input type='text' id='FromTokenContractAddress' placeholder='FromTokenContractAddress' value='0xc778417e063141139fce010982780140aa0cd5ab' />
                    </div>
                    <div>
                    <input type='text' id='pairAddress' placeholder='pairAddress' value='0x4A6a2F8c7b5F3e756868bc9AA24693aDb17f710f' />
                    </div>
                    <div>
                    <input type='text' id='amount' placeholder='amount' value='1000000000000000' />
                    </div>
                    <div>
                    <input type='text' id='minPoolTokens' placeholder='minPoolTokens' value='1262872576' />
                    </div>
                    <div>
                    <input type='text' id='allowanceTarget' placeholder='allowanceTarget' value='0xfb2dd2a1366de37f7241c83d47da58fd503e2c64' />
                    </div>
                    <div>
                    <input type='text' id='swapTarget' placeholder='swapTarget' value='0xfb2dd2a1366de37f7241c83d47da58fd503e2c64' />
                    </div>
                </div>

                  <button id="addliquidity" onClick={parabellumAdd}>Add To Pool</button>
    </div>
  );
}

export default App;
