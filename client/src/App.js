import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import assetOwnershipAbi from './contracts/AssetOwnership.json'
import { useWallet, UseWalletProvider } from 'use-wallet' 
import './App.css';

import NewAsset from './components/NewAsset';
import FetchAsset from './components/FetchAsset';
import CurrentAsset from './components/CurrentAsset'

// const developmentContractAddress = '0x415De09609e14878c781349E95E4e8Af1943f3F7';

const web3 = new Web3(Web3.givenProvider);
const contractAddress = '0xe9f07FcbcE9055F29D9201F7dCb9575dC20Da29B';
const AssetContract = new web3.eth.Contract(assetOwnershipAbi, contractAddress);


function App() {

  const wallet = useWallet()

  const [getAsset, setGetAsset] = useState(null);

  useEffect(() => {
    console.log(AssetContract)
  }, [])
  

  const fetchAsset = async (serial) => {
    console.log("Fetching asset");

    // const accounts = await window.ethereum.enable();
    // const account = account[0];

    const result = await AssetContract.methods.fetchAsset(serial).call();

    console.log("Asset recieved: ", result);

    setGetAsset(result);
  }

  const createAsset = async (asset) => {
    console.log("Creating asset: ", asset);

    try {
      const result = await AssetContract.methods.addAsset(asset.name, asset.serial, asset.value).send({
        from: wallet.account
      });
      console.log(result);

      // TODO: Display a response to the user
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
          
          <NewAsset createAsset={createAsset} />

          <FetchAsset fetchAsset={fetchAsset}/>

          <CurrentAsset asset={getAsset} account={wallet.account}/>

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
