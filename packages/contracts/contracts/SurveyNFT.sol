// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

/**
 * Schlanker, v5-kompatibler ERC-721:
 * - claimNFT(surveyId, points 1..3) einmal pro (wallet,survey)
 * - burn(tokenId) nur Owner
 * - non-transferable (Transfers verboten; nur Mint/Burn)
 * - ERC2771Context (Trusted Forwarder) für GSN/EIP-2771
 * - tokenURI dynamisch: baseURI + "<surveyId>-<points>.json"
 */
contract SurveyNFT is ERC721, Ownable, ERC2771Context {
    // wallet => (surveyId => minted?)
    mapping(address => mapping(uint256 => bool)) public minted;
    // tokenId => points (1..3)
    mapping(uint256 => uint8) public tokenPoints;
    // tokenId => surveyId
    mapping(uint256 => uint256) public tokenSurveyId;

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
        address user = _msgSender(); // via ERC2771Context: echte Nutzeradresse bei GSN
        require(points >= 1 && points <= 3, "invalid points");
        require(!minted[user][surveyId], "already minted");

        minted[user][surveyId] = true;

        uint256 tokenId = _nextId++;
        tokenPoints[tokenId] = points;
        tokenSurveyId[tokenId] = surveyId;

        _safeMint(user, tokenId);
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == _msgSender(), "not owner");
        // Mappings optional aufraeumen (kein Muss, aber sauber)
        delete tokenPoints[tokenId];
        delete tokenSurveyId[tokenId];
        _burn(tokenId);
    }

    function setBaseURI(string calldata newBase) external onlyOwner {
        baseTokenURI = newBase;
    }

    // --------- ERC2771 / EIP-2771 ----------
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

    // --------- Non-transferable ----------
    // v5: Transfers/Mints/Burns laufen über _update. Wir blocken "echte" Transfers.
    function _update(address to, uint256 tokenId, address auth)
    internal
    override
    returns (address from)
    {
        from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("non-transferable");
        }
        from = super._update(to, tokenId, auth);
    }

    // --------- tokenURI dynamisch ----------
    // Nutzt baseTokenURI und die gespeicherten Survey/Punkte
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        uint256 sId = tokenSurveyId[tokenId];
        uint8 pts = tokenPoints[tokenId];
        string memory base = _baseURI();
        if (bytes(base).length == 0) return "";
        return string(abi.encodePacked(base, _toString(sId), "-", _toString(pts), ".json"));
    }

    // v5: _baseURI() ist internal virtual
    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    // v5: supportsInterface kommt nur aus ERC721 hier
    function supportsInterface(bytes4 iid) public view override returns (bool) {
        return super.supportsInterface(iid);
    }

    // kleiner int->string helper (ohne Strings-Import)
    function _toString(uint256 v) internal pure returns (string memory) {
        if (v == 0) return "0";
        uint256 j = v; uint256 l;
        while (j != 0) { l++; j /= 10; }
        bytes memory b = new bytes(l); j = v;
        while (j != 0) { b[--l] = bytes1(uint8(48 + (j % 10))); j /= 10; }
        return string(b);
    }
}
