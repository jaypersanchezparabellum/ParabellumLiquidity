import './App.css';
import erc20contractJSON from './data/ERC20.json';
import parabellumcontractJSON from './data/Parabellum_In_General_V3_0_1.json';
import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import Web3 from 'web3';

let web3 = new Web3(window.ethereum);
//web3.eth.getAccounts().then(console.log);
    
function addToPool() {
  //alert(`addToPool`)
  const web3 = new Web3(Web3.currentProvider || "https://mainnet.infura.io/v3/6fd2fd8e1b334661b0c38556bd48b257")
    web3.eth.net.getNetworkType()
    .then(network => {
      console.log(network) // should give you main if you're connected to the main network via metamask...
    })
    
}

function transferToken() {
  window.web3 = new Web3(Web3.givenProvider || "https://mainnet.infura.io/v3/6fd2fd8e1b334661b0c38556bd48b257");
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
  const parabellumContract = new web3.eth.Contract(parabellumcontractJSON, parabellumAddress);
  window.web3 = new Web3(Web3.givenProvider || "https://mainnet.infura.io/v3/6fd2fd8e1b334661b0c38556bd48b257");
  window.ethereum.enable()
  .then(() => {
    window.web3.eth.sendTransaction({
                    from: '0xB5A7b7658c8daA57AE9F538C0315d4fa44Fe0bE4',
                    to: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
                    value:1000000000000000,
                    gasPrice:68000000,
                    gasLimit:1000000,
                    data: parabellumContract.methods.ZapIn(
                      '0x0000000000000000000000000000000000000000',
                      '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
                      1000000000000000,
                      1262872576,
                      '0xDef1C0ded9bec7F1a1670819833240f027b25EfF',
                      '0xDef1C0ded9bec7F1a1670819833240f027b25EfF',
                      '0X0'
                    ).encodeABI()
    })
  })
}

function App() {
 
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/6fd2fd8e1b334661b0c38556bd48b257"));
  }
 
  
  
  return (
    <div className="App">
                <div>
                    <div>
                    <input type='text' id='ethamount' placeholder='ETH Amount' value='0.001' />
                    </div>
                    <div>
                    <input type='text' id='FromTokenContractAddress' placeholder='FromTokenContractAddress' value='0x0000000000000000000000000000000000000000' />
                    </div>
                    <div>
                    <input type='text' id='pairAddress' placeholder='pairAddress' value='0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc' />
                    </div>
                    <div>
                    <input type='text' id='amount' placeholder='amount' value='1000000000000000' />
                    </div>
                    <div>
                    <input type='text' id='minPoolTokens' placeholder='minPoolTokens' value='1262872576' />
                    </div>
                    <div>
                    <input type='text' id='allowanceTarget' placeholder='allowanceTarget' value='0xDef1C0ded9bec7F1a1670819833240f027b25EfF' />
                    </div>
                    <div>
                    <input type='text' id='swapTarget' placeholder='swapTarget' value='0xDef1C0ded9bec7F1a1670819833240f027b25EfF' />
                    </div>
                </div>

                  <button id="addliquidity" onClick={parabellumAdd}>Add To Pool</button>
    </div>
  );
}

export default App;
