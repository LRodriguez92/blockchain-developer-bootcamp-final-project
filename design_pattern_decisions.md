# Design Patterns

## Inheritance and Interfaces
This contract is importing and extending the `OpenZeppelin` contract

```solidity
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
```

## Inter-Contract Execution
This contract is calling functions from the `OpenZeppelin` ERC721 contract such as `burn`, `safeMint` and `setTokenUri` when creating and destroying assets.

```solidity
function safeMint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
```

```solidity
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

        safeMint(msg.sender, _uri);

        emit LogInPossession(tokenId);

        return true;
    }
```

```solidity
function destroyAsset(uint _tokenId) verifyOwner(assets[_tokenId].owner) inPossession(_tokenId) verifyTokenExists(_tokenId) public {
        _burn(_tokenId);
        emit LogDestroyed(_tokenId);
    }
```
