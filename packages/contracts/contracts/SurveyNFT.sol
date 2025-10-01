// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract SurveyNFT is ERC721Enumerable, ERC721URIStorage, AccessControl, ERC2771Context {
    bytes32 public constant DELETER_ROLE = keccak256("DELETER_ROLE");

    mapping(address => mapping(uint256 => bool)) public minted; // user => surveyId => minted?
    mapping(uint256 => uint8) public tokenPoints;                // tokenId => 1..3

    string public baseTokenURI;
    uint256 private _nextId = 1;

    constructor(address trustedForwarder, string memory baseURI)
    ERC721("SurveyNFT","SNFT")
    ERC2771Context(trustedForwarder)
    {
        baseTokenURI = baseURI;
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function claimNFT(uint256 surveyId, uint8 points) external {
        address user = _msgSender();
        require(points >= 1 && points <= 3, "invalid points");
        require(!minted[user][surveyId], "already minted");

        minted[user][surveyId] = true;
        uint256 id = _nextId++;
        tokenPoints[id] = points;

        _safeMint(user, id);
        _setTokenURI(
            id,
            string(abi.encodePacked(baseTokenURI, _toString(surveyId), "-", _toString(points), ".json"))
        );
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == _msgSender(), "not owner");
        _burn(tokenId);
        delete tokenPoints[tokenId];
    }

    function burnAny(uint256 tokenId) external onlyRole(DELETER_ROLE) {
        _burn(tokenId);
        delete tokenPoints[tokenId];
    }

    function burnAllFor(address holder, uint256 maxCount) external onlyRole(DELETER_ROLE) {
        uint256 n = balanceOf(holder);
        uint256 toBurn = n < maxCount ? n : maxCount;
        for (uint256 i = 0; i < toBurn; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(holder, 0);
            _burn(tokenId);
            delete tokenPoints[tokenId];
        }
    }

    // Soulbound: nur Mint (from==0) oder Burn (to==0) erlauben
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        if (from != address(0) && to != address(0)) revert("non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // ---- Multiple inheritance (OZ 4.9) ----
    function _burn(uint256 tokenId)
    internal
    override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return ERC721URIStorage.tokenURI(tokenId);
    }
    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721Enumerable, ERC721URIStorage, AccessControl)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // EIP-2771 glue
    function _msgSender()
    internal
    view
    override(Context, ERC2771Context)
    returns (address)
    {
        return ERC2771Context._msgSender();
    }

    function _msgData()
    internal
    view
    override(Context, ERC2771Context)
    returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }

    function _contextSuffixLength()
    internal
    view
    override(Context, ERC2771Context)
    returns (uint256)
    {
        return ERC2771Context._contextSuffixLength();
    }

    // uint -> string
    function _toString(uint256 v) internal pure returns (string memory) {
        if (v == 0) return "0";
        uint256 j = v; uint256 l;
        while (j != 0) { l++; j /= 10; }
        bytes memory b = new bytes(l);
        uint256 k = l;
        while (v != 0) { k--; b[k] = bytes1(uint8(48 + v % 10)); v /= 10; }
        return string(b);
    }
}
