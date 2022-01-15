import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import assetOwnershipAbi from './contracts/AssetOwnership.json'
import { useWallet, UseWalletProvider } from 'use-wallet' 
import './App.css';

import NewAsset from './components/NewAsset';
import FetchAsset from './components/FetchAsset';
import CurrentAsset from './components/CurrentAsset'

const developmentContractAddress = '0xbf369f814E26bdDcD6554Bd4E534525750703937';

const web3 = new Web3(Web3.givenProvider);
const contractAddress = '0xaD9a274C1734f2a4db08F2Fc6922e5cfD02cBA57';
const AssetContract = new web3.eth.Contract(assetOwnershipAbi.abi, contractAddress);


function App() {

  const wallet = useWallet()

  const [getAsset, setGetAsset] = useState(null);

  useEffect(() => {
    console.log(AssetContract)
    // getAllAssets()
  }, [])
  
  const getAllAssets = async () => {
    const totalAssets = await AssetContract.methods.totalSupply()

    console.log("Total supply of assets: ", totalAssets);
  }

  const fetchAsset = async (token) => {
    console.log("Fetching asset");

    // const accounts = await window.ethereum.enable();
    // const account = account[0];

    const result = await AssetContract.methods.fetchAsset(token).call();

    
    // Convert from wei to ether for client
    const valueInEther = await web3.utils.fromWei(result[3], 'ether')

    result[3] = valueInEther;
    
    console.log("Asset recieved: ", result);

    setGetAsset(result);

  }

  const createAsset = async (asset) => {
    console.log("Creating asset: ", asset);

    asset.value = web3.utils.toWei(asset.value, 'ether')

    console.log("Asset value in Wei: ", asset);
    try {
      const result = await AssetContract.methods.addAsset(asset.name, asset.serial, asset.value, asset.uri).send({
        from: wallet.account,
      });
      console.log(result);

      // TODO: Display a response to the user
    } catch (error) {
      console.error(error); 
    }
  }

  const buyAsset = async (token) => {
    console.log("Buying asset: ", token);
    console.log("sender: ", wallet.account);

    try {
      const result = await AssetContract.methods.buyAsset(token).send({
        from: wallet.account,
        to: contractAddress,
        value: web3.utils.toWei(getAsset[3], 'ether'),
      })
      let contractBalance = await web3.eth.getBalance(contractAddress);
      contractBalance = await web3.utils.fromWei(contractBalance, 'ether')
      console.log("Contract balance: ", contractBalance);    
      console.log(result);

      fetchAsset(token);
    } catch (error) {
      console.error(error);
    }
  }

  const receiveAsset = async (token) => {
    console.log("Receiving asset: ", token);
    console.log("sender: ", wallet.account);

    try {
      const result = await AssetContract.methods.receiveAsset(token).send({
        from: wallet.account,
      })
      console.log(result);

      let contractBalance = await web3.eth.getBalance(contractAddress);
      console.log("Contract balance: ", contractBalance);

      fetchAsset(token);
    } catch (error) {
      console.error(error);
    }
  }

  const shipAsset = async (token) => {
    console.log("Shipping asset: ", token);
    console.log("sender: ", wallet.account);

    try {
      const result = await AssetContract.methods.shipAssetAndApproveOwnershipTransfer(token).send({
        from: wallet.account,
      })
      console.log(result);

      let contractBalance = await web3.eth.getBalance(contractAddress);
      console.log("Contract balance: ", contractBalance);

      fetchAsset(token);
    } catch (error) {
      console.error(error);
    }

  }

  return (
    <div className="App">
      {wallet.status === 'connected' ? (
        <div>
          <div>Account: {wallet.account}</div>
          <div>Balance: {wallet.balance}</div>
          <button onClick={() => wallet.reset()}>Disconnect MetaMask</button>
          
          <button onClick={getAllAssets}>All Assets</button>
          
          <NewAsset createAsset={createAsset} />

          <FetchAsset fetchAsset={fetchAsset}/>

          <CurrentAsset 
          asset={getAsset} 
          account={wallet.account}
          buyAsset={buyAsset}
          receiveAsset={receiveAsset}
          shipAsset={shipAsset}
          />

        </div>
      ) : (
        <div>
          <button onClick={() => wallet.connect()}>Connect MetaMask</button>
        </div>
      )}


    </div>
  );
}

// export default App;

export default () => (
  <UseWalletProvider
    chainId={4}
  >
    <App />
  </UseWalletProvider>
)
