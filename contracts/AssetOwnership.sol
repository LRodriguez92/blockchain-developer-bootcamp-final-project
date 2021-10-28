mapping (uint => Asset) assets;

enum State{InPossesion, LostOrStolen, Destroyed}

struct Asset {
    string name;
    uint serial;
    address owner;
    State state;
}

modifier verifyCaller (address _address) {

    // verifies the caller is the owner of the asset

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