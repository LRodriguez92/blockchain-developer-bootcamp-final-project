const AssetOwnership = artifacts.require("AssetOwnership");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("AssetOwnership", function (accounts) {
  let contract;
  const value = "100000000000000000";
  const inPossession = 0;
  const pendingTransfer = 1;
  const transferringOwnership = 2;
  const lostOrStolen = 3;
  const [owner, buyer] = accounts;
  
  let newOwner;
  const newValue ="2500000000000000000"


  // Deploys contract and creates an asset
  before(async () => {
    contract = await AssetOwnership.deployed();
    await contract.addAsset("iPhone13", 12345, value, "https://example.com" , {from: owner});
  })

  describe("Transactions on the first asset on contract", () => {
    // Makes sure the owner of an asset cannot buy or change the asset's state
    it("should prevent owners from buying their own asset", async () => {
      try {
        await contract.buyAsset(0, {from: owner, value: value});
      } catch (err) {}
      
      const storedAsset = await contract.fetchAsset.call(0);
      const assetState = storedAsset.state.words[0];
      assert.equal(assetState, inPossession, 'Owner not able to buy own asset!')
    })
  
    // Makes sure the buyer can't receive the asset before the owner ships it
    it("Buyer should not be able to reveive the asset before it's been shipped", async () => {
      await contract.buyAsset(0, {from: buyer, value: value});
      try {
        await contract.receiveAsset(0, {from: buyer})
      } catch (err) {}
  
  
      const storedAsset = await contract.fetchAsset.call(0);
      const assetState = storedAsset.state.words[0];
  
      assert.equal(assetState, pendingTransfer, "The buyer can't receive the asset before shipping!")
    })
  
    // Makes sure the owner is able to ship the asset
    it("The owner is able to ship the asset and approve NFT transfer", async () => {
      try {
        await contract.shipAssetAndApproveOwnershipTransfer(0, {from: owner});
      } catch (err) {}
  
      const storedAsset = await contract.fetchAsset.call(0);
      const assetState = storedAsset.state.words[0];    
  
      assert.equal(assetState, transferringOwnership, "The owner should be ship the asset after it's been purchased!")
    })
  
    // Makes sure that the buyer becomes the owner of the asset once it's received
    it("The buyer can receive the asset and the ownership is transferred", async () => {
      try {
        await contract.receiveAsset(0, {from: buyer})
      } catch (err) {}
  
      const storedAsset = await contract.fetchAsset.call(0);
      newOwner = buyer;
  
      assert.equal(storedAsset["_owner"], buyer, "The buyer should be able to receive the asset!")
    })
  
    // Confirms that the owner is able to change the value of the asset
    it("The new owner should be able to change the value of the asset", async () => {
      try{
        await contract.changeValueOfAsset(0, newValue, {from: newOwner})
      } catch(err) {}
  
      const storedAsset = await contract.fetchAsset.call(0);
      assert.equal(storedAsset.value.toString(), newValue, "The assets value was not changed!");
    })
  })
  
});
