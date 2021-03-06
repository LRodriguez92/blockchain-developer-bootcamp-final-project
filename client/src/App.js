import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import assetOwnershipAbi from './contracts/AssetOwnership.json'
import { useWallet, UseWalletProvider } from 'use-wallet' 
import './App.css';

import NewAsset from './components/NewAsset';
import FetchAsset from './components/FetchAsset';
import CurrentAsset from './components/CurrentAsset'

const web3 = new Web3(Web3.givenProvider);
const contractAddress = '0x880F36c0Bf33F34b1A3c77Ac87C2C87C36c5fD64';
const AssetContract = new web3.eth.Contract(assetOwnershipAbi.abi, contractAddress);


function App() {

  const wallet = useWallet()

  const [getAsset, setGetAsset] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    console.log(AssetContract)
  }, [])

  const displayAlert = async(message) => {
    console.log("calling displayAlert");
    await setAlert(message)

    setTimeout(() => {
      setAlert("")
    },5000)
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
      await displayAlert("Asset Created!");
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
      displayAlert("Asset bought! Awaiting shipping");
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
      displayAlert("Asset received! You are now the owner!");
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
      displayAlert("Asset shipped!");
    } catch (error) {
      console.error(error);
    }
  }

  const burnAsset = async (token) => {
    console.log("Burning asset: ", token);
    console.log("sender: ", wallet.account);

    try {
      const result = await AssetContract.methods.destroyAsset(token).send({
        from: wallet.account,
      })

      console.log(result);
      displayAlert("Asset burned!");
      setGetAsset(null);
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="App">
      {wallet.status === 'connected' ? (
        <div>

          <div className="header">
            <h3>Account: {wallet.account}</h3>

            <button onClick={() => wallet.reset()}>Disconnect MetaMask</button>
          </div>

          <h1>Own and Buy Assets!</h1>

          <h2 className={alert === "Asset burned!" ? "red" : "green"}>{alert}</h2>
          
          <NewAsset createAsset={createAsset} />

          
          <FetchAsset fetchAsset={fetchAsset}/>

          {getAsset ? 
            <CurrentAsset 
            asset={getAsset} 
            account={wallet.account}
            buyAsset={buyAsset}
            receiveAsset={receiveAsset}
            shipAsset={shipAsset}
            burnAsset={burnAsset}
            displayAlert={displayAlert}
            />

            :

            null
          }

        </div>
      ) : (
        <div>
          <div className="disconnected-header">
            <button onClick={() => {wallet.connect()}}>Connect MetaMask</button>
          </div>
          <h1>Own and Buy Assets!</h1>
        </div>
      )}


    </div>
  );
}

export default () => (
  <UseWalletProvider
    chainId={4}
  >
    <App />
  </UseWalletProvider>
)
