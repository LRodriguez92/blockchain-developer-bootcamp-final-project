# Avoiding Common Pitfallas and Attacks

## Using specific compiler pragma

This contract is using the `0.8.0` version of the compiler

```solidity
compilers: {
    solc: {
      version: "^0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
      docker: false,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       },
       evmVersion: "byzantium"
      }
    }
  },
```

## Using both Require and Modifiers for Validation

This contract has multiple modifiers which also makes use of `require` in order to make sure requirements are met before a transaction

```solidity
modifier verifyOwner (address _address) {
        require(msg.sender == _address, "You are not the owner of this asset");
        _;
    }

    modifier verifyTokenExists (uint _tokenId) {
        require(_exists(_tokenId), "This token does not exist");
        _;
    }


    modifier verifyBuyer (address _address) {
        require(msg.sender == _address, "You are not the buyer of this asset");
        _;
    }

    modifier verifyNotOwner (address _address) {
        require(msg.sender != _address, "You are already the owner of this asset");
        _;
    }

    modifier inPossession (uint _tokenId) {
        require(assets[_tokenId].state == State.InPossession, "The asset is not currently being sold"); 
        _;
    }

    modifier isLostorStolen (uint _tokenId) {
        require(assets[_tokenId].state == State.LostOrStolen, "This asset has not been reported lost or stolen");
        _;
    }

    modifier pendingTransfer (uint _tokenId) {
        require(assets[_tokenId].state == State.PendingTransfer, "Ownership has not been transferred.");
        _;
    }

    modifier transferringOwnership (uint _tokenId) {
        require(assets[_tokenId].state == State.TransferringOwnership, "This asset has not been shipped or approved for ownership transfer.");
        _;
    }

    modifier paidEnough (uint _value) {
        require(msg.value >= _value, "You have insufficient funds");
        _;
    }

```
