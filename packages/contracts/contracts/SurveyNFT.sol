// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

/**
 * - claimNFT(surveyId, points 1..3) einmal pro (wallet,survey)
 * - burn(tokenId) nur Owner
 * - non-transferable (Transfers verboten; nur Mint/Burn)
 * - ERC2771 (Trusted Forwarder) für GSN/EIP-2771
 * - tokenURI = baseURI + "<surveyId>-<points>.json"
 */
contract SurveyNFT is ERC721Enumerable, ERC721URIStorage, Ownable, ERC2771Context {
    mapping(address => mapping(uint256 => bool)) public minted;
    mapping(uint256 => uint8) public tokenPoints;

    string public baseTokenURI;
    uint256 private _nextId;

    constructor(address trustedForwarder_, string memory baseURI_)
    ERC721("SurveyNFT", "SNFT")
    Ownable(msg.sender)
    ERC2771Context(trustedForwarder_)
    {
        baseTokenURI = baseURI_;
        _nextId = 1;
    }

    function claimNFT(uint256 surveyId, uint8 points) external {
        address user = _msgSender();
        require(points >= 1 && points <= 3, "invalid points");
        require(!minted[user][surveyId], "already minted");

        minted[user][surveyId] = true;
        uint256 tokenId = _nextId++;
        tokenPoints[tokenId] = points;

        _safeMint(user, tokenId);
        _setTokenURI(
            tokenId,
            string(
                abi.encodePacked(
                    baseTokenURI,
                    _toString(surveyId), "-", _toString(points), ".json"
                )
            )
        );
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == _msgSender(), "not owner");
        _burn(tokenId); // v5: kein eigenes Override nötig
    }

    function setBaseURI(string calldata newBase) external onlyOwner {
        baseTokenURI = newBase;
    }

    // -------- ERC2771 / EIP-2771 --------
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

    // v5: wegen ERC2771Context zusätzlich
    function _contextSuffixLength()
    internal
    view
    override(Context, ERC2771Context)
    returns (uint256)
    {
        return ERC2771Context._contextSuffixLength();
    }

    // -------- Non-transferable ----------
    // v5: Transfers laufen über _update; blocke from!=0 && to!=0
    function _update(address to, uint256 tokenId, address auth)
    internal
    override(ERC721, ERC721Enumerable) // << KEIN ERC721URIStorage hier!
    returns (address from)
    {
        from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("non-transferable");
        }
        from = super._update(to, tokenId, auth);
    }

    // v5: Mehrfachvererbung vereinheitlichen
    function _increaseBalance(address account, uint128 value)
    internal
    override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    // -------- Glue für Mehrfachvererbung ----------
    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage) // hier ist URIStorage korrekt
    returns (string memory)
    {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 iid)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(iid);
    }

    // uint -> string helper
    function _toString(uint256 v) internal pure returns (string memory) {
        if (v == 0) return "0";
        uint256 j = v; uint256 l;
        while (j != 0) { l++; j /= 10; }
        bytes memory b = new bytes(l); j = v;
        while (j != 0) { b[--l] = bytes1(uint8(48 + j % 10)); j /= 10; }
        return string(b);
    }
}
