// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AssetOwnership {

    // owner
    address public owner;

    // number of assets
    uint public assetCount;

    // assets
    mapping (uint => Asset) assets;

    // asset state
    enum State{InPossession, TransferringOwnership, LostOrStolen, Destroyed}

    // asset struct
    struct Asset {
        string name;
        uint serial;
        address owner;
        State state;
    }



    /*
     * Constructor
     */

    constructor () {
        owner = msg.sender;
        assetCount = 0;
    }



    /*
     * Events
     */

    event LogInPossession(uint serial);

    event LogTransferringOwnership(uint serial);
    
    event LogLostOrStolen(uint serial);

    event LogDestroyed(uint serial);



    /*
     * Modifiers
     */

    // verifies the caller is the owner of the asset
    modifier verifyCaller (address _address) {
        require(msg.sender == _address, "You are not the owner of this asset");
        _;
    }

    // verifies the asset is in possesion (use when transferring ownership)
    modifier inPossession (uint _serial) {
        require(assets[_serial].state == State.InPossession, "The asset is not currently in your possession"); 
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

    modifier transferringOwnership (uint _serial) {
        require(assets[_serial].state == State.TransferringOwnership, "Ownership has not been transferred.");
        _;
    }



    /*
     * Functionality
     */

    // creates new Asset struct and adds it to asset mapping
    function addAsset(string memory _name, uint _serial) public returns (bool) {
        // create a new asset in the asset mapping
        assets[_serial] = Asset({
            name: _name,
            serial: _serial,
            owner: msg.sender,
            state: State.InPossession
        });

        // increase asset count
        assetCount += 1;

        // call an event
        emit LogInPossession(assetCount);

        return true;
    }

    // changes the state to LostOrStolen
    function reportLostOrStolen(uint _serial) verifyCaller(assets[_serial].owner) inPossession(_serial) public {
        assets[_serial].state = State.LostOrStolen;

        emit LogLostOrStolen(_serial);
    }

    // changes the state to InPossession
    function reportFoundAndInPossession(uint _serial) verifyCaller(assets[_serial].owner) isLostorStolen(_serial) public {
        assets[_serial].state = State.InPossession;

        emit LogInPossession(_serial);
    }

    // transfers ownership of asset
    function transferOwnership(uint _serial) verifyCaller(assets[_serial].owner) inPossession(_serial) public {
        assets[_serial].state = State.TransferringOwnership;

        emit LogTransferringOwnership(_serial);
    }

    // changes the state to Destroyed
    function destroyAsset(uint _serial) verifyCaller(assets[_serial].owner) inPossession(_serial) public {
        assets[_serial].state = State.Destroyed;

        emit LogDestroyed(_serial);
    }
}
