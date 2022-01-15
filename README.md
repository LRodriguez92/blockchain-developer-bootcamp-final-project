# blockchain-developer-bootcamp-final-project

My public ETH address for NFT: `0xfE6b82A6b82674EB4D2AB4b7e7fBeDda4c7D1c28`

## Giving your assets a digital identity

With this dapp you will be able to give all of your valuables a digital identity whether it's a tv, car, computer, wedding ring, etc. This will serve as your proof of ownership for these products through the Ethereum blockchain. This will make your valuables easier to recover when they go missing or are stolen. 

You'll be able to also mint an NFT which will represent your ownership status of your asset.

### Asset Contract Workflow
- Users will be able to connect to the contract with their MetaMask
- Users can create their asset and mint an NFT to represent their asset
- Owners of an asset will be able to change it's value and users will be able to buy the asset
- Once users buy the asset, the contract will hold the funds
- The Owner of the asset will the be able to ship the asset to the buyer, granting permission to transfer asset and NFT ownership
- Once users confirm they have received the asset, the funds will be released to the owner and the buyer will become the new owner of the asset and receive the NFT that accompanies it.

## Dapp link
```
Deployed link goes here
```

## Installation Instructions
- Fork and clone this repo to your machine
- Navigate to the cloned repo directory

## Solidity
Compile the solidity with the command:
```bash
truffle compile
```

### Unit tests
To run the unit tests first start up the Ganache CLI in your terminal with the command:
```bash
ganache-cli
```

In another terminal window run the unit tests with the following command:
```bash
truffle test
```

## Client
To run the client, navigate to the `client` directory inside of the repo

Install all of the necessary dependencies for the client
```bash
npm install
```

And finally start the client server
```bash
npm start
```
