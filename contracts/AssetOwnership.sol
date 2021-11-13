pragma solidity ^0.8.0;

contract AssetOwnership {

    // owner
    address public owner;

    // assets
    mapping (uint => Asset) assets;

    // asset state
    enum State{InPossesion, LostOrStolen, Destroyed, TransferredOwnership}

    // asset struct
    struct Asset {
        string name;
        uint serial;
        address owner;
        State state;
    }

    // verifies the caller is the owner of the asset
    modifier verifyCaller (uint _serial) {
        require(msg.sender == assets[_serial].owner, "You are not the owner of this asset");
        _;
    }

    // verifies the asset is in possesion (use when transferring ownership)
    modifier inPossesion (uint _serial) {
        require(assets[_serial].state == State.InPossesion, "The asset is not currently in your possesion"); 
        _;
    }

    // verifies the asset is reported lost or stolen ()
    modifier isLostorStolen (uint _serial) {
        require(assets[_serial].state == State.LostOrStolen, "This asset has not been reported lost or stolen");
        _;
    }

    modifier isNotDestroyed (uint _serial) {
        require(assets[_serial].state != State.Destroyed, "This asset has been destroyed. No further actions are available");
        _;
    }

    modifier transferOwnership (uint _serial) {
        require(assets[_serial].state == State.TransferredOwnership, "Ownership has not been transferred.");
        _;
    }

    function addAsset(string memory _name, uint _serial) {
        
        // creates new Asset struct and adds it to asset mapping

    }

    function reportLostOrStolen(uint _serial) {

        // changes the state to LostOrStolen

    }

    function reportFoundAndInPosession(uint _serial) {

        // changes the state to InPossesion

    }

    function transferOwnership(uint _serial) {

        // transfers ownership of asset

    }

    function destroyAsset(uint _serial) {

        // chnages the state to Destroyed

    }
}
