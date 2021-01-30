import './App.css';
import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import Web3 from 'web3';

let web3 = new Web3(window.ethereum);
//web3.eth.getAccounts().then(console.log);
    
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

                  <button id="addliquidity">Add To Pool</button>
    </div>
  );
}

export default App;
