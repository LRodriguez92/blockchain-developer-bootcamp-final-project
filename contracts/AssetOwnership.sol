// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AssetOwnership is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Asset Ownership", "ASSET") {}

    function safeMint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


    /*****************************************************************
     ****************************** Data ****************************
     ****************************************************************/


    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    // assets
    mapping (uint => Asset) assets;

    // to iterate over assets
    Asset[] assetList;
    

    // asset state
    enum State{InPossession, PendingTransfer, TransferringOwnership, LostOrStolen}

    // asset struct
    struct Asset {
        uint tokenId;
        string name;
        uint serial;
        uint value;
        address payable buyer;
        address payable owner;
        State state;
        string uri;
    }

    /*****************************************************************
     ****************************** Events ***************************
     ****************************************************************/

    event LogInPossession(uint tokenId);

    event LogSold(uint tokenId);

    event LogTransferringOwnership(uint tokenId);
    
    event LogLostOrStolen(uint tokenId);

    event LogDestroyed(uint tokenId);

    event LogChangedValue(uint tokenId, uint value);

    /*****************************************************************
     **************************** Modifiers **************************
     ****************************************************************/

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

    /*****************************************************************
     ****************************** Logic ****************************
     ****************************************************************/

    // ADD
    function addAsset(string memory _name, uint _serial, uint _value, string memory _uri) public returns (bool) {
        uint tokenId = _tokenIdCounter.current();

        assets[tokenId] = Asset({
            tokenId: tokenId,
            name: _name,
            serial: _serial,
            value: _value,
            buyer: payable (address(0)),
            owner: payable (msg.sender),
            state: State.InPossession,
            uri: _uri
        });

        assetList.push(assets[tokenId]);

        safeMint(msg.sender, _uri);

        emit LogInPossession(tokenId);

        return true;
    }

    // BUY
    function buyAsset(uint _tokenId) 
    inPossession(_tokenId) 
    verifyNotOwner(assets[_tokenId].owner) 
    verifyTokenExists(_tokenId)
    paidEnough(assets[_tokenId].value) 
    payable public {        
        // TODO: Change and add modifiers and make sure money is sent
        
        assets[_tokenId].buyer = payable(msg.sender);

        assets[_tokenId].state = State.PendingTransfer;

        emit LogSold(_tokenId);
    }

    // APPROVE FOR OWNERSHIP TRANSFER
    function shipAssetAndApproveOwnershipTransfer(uint _tokenId) pendingTransfer(_tokenId) verifyOwner(assets[_tokenId].owner) verifyTokenExists(_tokenId) public {
        _approve(assets[_tokenId].buyer, _tokenId);
        
        assets[_tokenId].state = State.TransferringOwnership;
    }

    // RECEIVE AND TRANSFER OWNERSHIP
    function receiveAsset(uint _tokenId) verifyBuyer(assets[_tokenId].buyer) transferringOwnership(_tokenId) verifyTokenExists(_tokenId) payable public {
        safeTransferFrom(assets[_tokenId].owner, assets[_tokenId].buyer, _tokenId);

        assets[_tokenId].owner.transfer(assets[_tokenId].value);

        assets[_tokenId].owner = payable(msg.sender);

        assets[_tokenId].buyer = payable(address(0));
        
        assets[_tokenId].state = State.InPossession;

        emit LogInPossession(_tokenId);
    }

    // CHANGE VALUE
    function changeValueOfAsset(uint _tokenId, uint _value) verifyOwner(assets[_tokenId].owner) inPossession(_tokenId) verifyTokenExists(_tokenId) public {
        assets[_tokenId].value = _value;

        emit LogChangedValue(_tokenId, _value);
    }

    // LOST OR STOLEN
    function reportLostOrStolen(uint _tokenId) verifyOwner(assets[_tokenId].owner) inPossession(_tokenId) verifyTokenExists(_tokenId) public {
        assets[_tokenId].state = State.LostOrStolen;

        emit LogLostOrStolen(_tokenId);
    }

    // IN POSSESSION
    function reportFoundAndInPossession(uint _tokenId) verifyOwner(assets[_tokenId].owner) isLostorStolen(_tokenId) verifyTokenExists(_tokenId) public {
        assets[_tokenId].state = State.InPossession;

        emit LogInPossession(_tokenId);
    }

    // DESTROY
    function destroyAsset(uint _tokenId) verifyOwner(assets[_tokenId].owner) inPossession(_tokenId) verifyTokenExists(_tokenId) public {
        _burn(_tokenId);
        emit LogDestroyed(_tokenId);
    }


    // FETCH
    function fetchAsset(uint _tokenId) verifyTokenExists(_tokenId) public view 
    returns (uint tokenId, string memory name, uint serial, uint value, address buyer, address _owner, State state, string memory uri) {
        tokenId = assets[_tokenId].tokenId;
        name = assets[_tokenId].name;
        serial = assets[_tokenId].serial;
        value = assets[_tokenId].value;
        buyer = assets[_tokenId].buyer;
        _owner = assets[_tokenId].owner;
        state = assets[_tokenId].state;
        uri = assets[_tokenId].uri;

        return (tokenId, name, serial, value, buyer, _owner, state, uri);
    }

    function fetchAssetList() public view returns (Asset[] memory listOfAssets) {
        listOfAssets = assetList;
        return listOfAssets;
    }
}