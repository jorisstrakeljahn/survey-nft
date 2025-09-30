// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract SurveyNFT is ERC721Enumerable, ERC721URIStorage, AccessControl, ERC2771Context {
    bytes32 public constant DELETER_ROLE = keccak256("DELETER_ROLE");

    mapping(address => mapping(uint256 => bool)) public minted; // user => surveyId => minted?
    mapping(uint256 => uint8) public tokenPoints;                // tokenId => points

    string public baseTokenURI;
    uint256 private _nextId = 1;

    constructor(address trustedForwarder, string memory baseURI)
    ERC721("SurveyNFT","SNFT")
    ERC2771Context(trustedForwarder)
    {
        baseTokenURI = baseURI;
        // Admin (DEFAULT_ADMIN_ROLE) ist Deployer
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    // --- Mint: 1x pro (user,surveyId) ---
    function claimNFT(uint256 surveyId, uint8 points) external {
        address user = _msgSender();
        require(points >= 1 && points <= 3, "invalid points");
        require(!minted[user][surveyId], "already minted");

        minted[user][surveyId] = true;

        uint256 id = _nextId++;
        tokenPoints[id] = points;
        _safeMint(user, id);
        _setTokenURI(id, string.concat(baseTokenURI, _toString(surveyId), "-", _toString(points), ".json"));
    }

    // --- Owner darf sein eigenes NFT löschen ---
    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == _msgSender(), "not owner");
        _burn(tokenId);
        delete tokenPoints[tokenId];
    }

    // --- Fremd-Löschung (burnAny) nur mit DELETER_ROLE ---
    function burnAny(uint256 tokenId) external onlyRole(DELETER_ROLE) {
        _burn(tokenId);
        delete tokenPoints[tokenId];
    }

    // --- Optional: Alles für eine Adresse löschen (in Chunks) ---
    // Achtung: gas-intensiv bei vielen Tokens. MaxCount begrenzt Laufzeit.
    function burnAllFor(address holder, uint256 maxCount) external onlyRole(DELETER_ROLE) {
        uint256 n = balanceOf(holder);
        uint256 toBurn = n < maxCount ? n : maxCount;

        for (uint256 i = 0; i < toBurn; i++) {
            // Immer Index 0 nehmen, weil sich die Liste nach _burn verschiebt
            uint256 tokenId = tokenOfOwnerByIndex(holder, 0);
            _burn(tokenId);
            delete tokenPoints[tokenId];
        }
    }

    // Non-transferable (Soulbound): nur Mint (from==0) oder Burn (to==0) erlaubt
    function _update(address to, uint256 tokenId, address auth)
    internal override(ERC721) returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) revert("non-transferable");
        return super._update(to, tokenId, auth);
    }

    // --- Admin: BaseURI ändern, Rolle vergeben/entziehen ---
    function setBaseURI(string calldata newBaseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseTokenURI = newBaseURI;
    }
    function grantDeleter(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DELETER_ROLE, account);
    }
    function revokeDeleter(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(DELETER_ROLE, account);
    }

    // --- ERC2771 overrides ---
    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }
    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }

    // --- Multiple inheritance glue ---
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    function tokenURI(uint256 tokenId)
    public view override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return ERC721URIStorage.tokenURI(tokenId);
    }
    function supportsInterface(bytes4 interfaceId)
    public view override(ERC721, ERC721Enumerable, AccessControl)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
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
