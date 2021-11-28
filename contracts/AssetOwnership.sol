// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract AssetOwnership {

    // owner
    address public owner;

    // number of assets
    uint public assetCount;

    // assets
    mapping (uint => Asset) assets;

    // asset state
    enum State{InPossession, Sold, TransferringOwnership, LostOrStolen, Destroyed}

    // asset struct
    struct Asset {
        string name;
        uint serial;
        uint value;
        address payable buyer;
        address payable owner;
        State state;
    }



    /*
     * Constructor
     */

    constructor () public {
        owner = msg.sender;
        assetCount = 0;
    }



    /*
     * Events
     */

    event LogInPossession(uint serial);

    event LogSold(uint serial);

    event LogTransferringOwnership(uint serial);
    
    event LogLostOrStolen(uint serial);

    event LogDestroyed(uint serial);

    event LogChangedValue(uint serial, uint value);


    /*
     * Modifiers
     */

    
    
    
    modifier verifyCaller (address _address) {
        require(msg.sender == _address, "You are not the owner of this asset");
        _;
    }

    modifier inPossession (uint _serial) {
        require(assets[_serial].state == State.InPossession, "The asset is not currently in your possession"); 
        _;
    }

    modifier isLostorStolen (uint _serial) {
        require(assets[_serial].state == State.LostOrStolen, "This asset has not been reported lost or stolen");
        _;
    }

    modifier isNotDestroyed (uint _serial) {
        require(assets[_serial].state != State.Destroyed, "This asset has been destroyed. No further actions are available");
        _;
    }

    modifier sold(uint _serial) {
        require(assets[_serial].state == State.Sold, "This asset has not been sold");
        _;
    }

    modifier transferringOwnership (uint _serial) {
        require(assets[_serial].state == State.TransferringOwnership, "Ownership has not been transferred.");
        _;
    }

    
    modifier checkValue(uint _serial) {
        uint _value = assets[_serial].value;
        uint amountToRefund = msg.value - _value;
        
        assets[_serial].buyer.transfer(amountToRefund);
        _;
    }

    modifier paidEnough (uint _value) {
        require(msg.value >= _value);
        _;
    }


    /*
     * Functionality
     */



    // creates new Asset struct and adds it to asset mapping
    function addAsset(string memory _name, uint _serial, uint _value) public returns (bool) {
        
        assets[_serial] = Asset({
            name: _name,
            serial: _serial,
            value: _value,
            buyer: payable (address(0)),
            owner: payable (msg.sender),
            state: State.InPossession
        });

        assetCount += 1;

        emit LogInPossession(assetCount);

        return true;
    }

    // LOST OR STOLEN
    function reportLostOrStolen(uint _serial) verifyCaller(assets[_serial].owner) inPossession(_serial) public {
        assets[_serial].state = State.LostOrStolen;

        emit LogLostOrStolen(_serial);
    }

    // IN POSSESSION
    function reportFoundAndInPossession(uint _serial) verifyCaller(assets[_serial].owner) isLostorStolen(_serial) public {
        assets[_serial].state = State.InPossession;

        emit LogInPossession(_serial);
    }


    // DESTROY
    function destroyAsset(uint _serial) verifyCaller(assets[_serial].owner) inPossession(_serial) public {
        assets[_serial].state = State.Destroyed;

        emit LogDestroyed(_serial);
    }

    // VALUE: changeValueOfAsset
    function changeValueOfAsset(uint _serial, uint _value) verifyCaller(assets[_serial].owner) inPossession(_serial) public {
        assets[_serial].value = _value;

        emit LogChangedValue(_serial, _value);
    }

    // BUY
    function buyAsset(uint _serial) inPossession(_serial) paidEnough(assets[_serial].value) checkValue(_serial) payable public {
        assets[_serial].owner.transfer(assets[_serial].value);
        assets[_serial].buyer = payable(msg.sender);

        assets[_serial].state = State.Sold;

        emit LogSold(_serial);
    }

    // TRANSFER
    function transferOwnership(uint _serial) verifyCaller(assets[_serial].owner) sold(_serial) public {
        assets[_serial].state = State.TransferringOwnership;

        emit LogTransferringOwnership(_serial);
    }

    // RECEIVED
    function receiveAsset(uint _serial) verifyCaller(assets[_serial].buyer) transferringOwnership(_serial) public {
        assets[_serial].owner = payable(msg.sender);
        assets[_serial].state = State.InPossession;

        emit LogInPossession(_serial);
    }

    // FETCH
    function fetchAsset(uint _serial) public view 
    returns (string memory name, uint serial, uint value, address buyer, address _owner, State state) {
        
        name = assets[_serial].name;
        serial = assets[_serial].serial;
        value = assets[_serial].value;
        buyer = assets[_serial].buyer;
        _owner = assets[_serial].owner;
        state = assets[_serial].state;

        return (name, serial, value, buyer, _owner, state);
    }
}
