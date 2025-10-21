// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * SurveyNFT v2 (OZ v5.x)
 *
 * - Soulbound (Transfers blockiert über _update)
 * - claimNFT(surveyId, points): einmalig pro (user, surveyId)
 * - tokenURI = baseTokenURI + "<points>.json"
 * - adminRepoint(tokenId): setzt URI neu anhand gespeicherter Punkte
 * - burn (Owner), burnAny/burnAllFor (DELETER_ROLE)
 * - ERC721Enumerable für Frontend (tokenOfOwnerByIndex)
 */
contract SurveyNFT is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    AccessControl,
    ERC2771Context
{
    using Strings for uint256;

    bytes32 public constant DELETER_ROLE = keccak256("DELETER_ROLE");

    uint256 private _nextId;
    string public baseTokenURI;

    // Einmaligkeit pro (user, surveyId)
    mapping(address => mapping(uint256 => bool)) public minted;
    // Punkte pro Token
    mapping(uint256 => uint8) public tokenPoints;
    // (optional) TokenId je (user, surveyId)
    mapping(address => mapping(uint256 => uint256)) public mintedTokenId;

    constructor(
        string memory name_,
        string memory symbol_,
        address trustedForwarder_,   // z.B. 0xdA78a11FD57aF7be2eDD804840eA7f4c2A38801d
        string memory baseTokenURI_, // z.B. https://vpstunden.hsbi.de/vpp-metadata/
        address admin_,              // DEFAULT_ADMIN_ROLE
        address deleter_             // DELETER_ROLE
    )
    ERC721(name_, symbol_)
    ERC2771Context(trustedForwarder_)
    {
        require(admin_ != address(0), "admin=0");
        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        if (deleter_ != address(0)) {
            _grantRole(DELETER_ROLE, deleter_);
        }
        baseTokenURI = baseTokenURI_;
        _nextId = 1;
    }

    /* ------------------------ Minting ------------------------ */

    function claimNFT(uint256 surveyId, uint8 points) external returns (uint256 tokenId) {
        address user = _msgSender();
        require(!minted[user][surveyId], "already claimed for survey");
        require(points > 0, "points=0");
        // optional: require(points <= 3, "points too high");

        tokenId = _nextId++;
        _safeMint(user, tokenId);

        tokenPoints[tokenId] = points;
        minted[user][surveyId] = true;
        mintedTokenId[user][surveyId] = tokenId;

        _setTokenURI(tokenId, string.concat(baseTokenURI, uint256(points).toString(), ".json"));
    }

    function mintedFor(address user, uint256 surveyId) external view returns (bool) {
        return minted[user][surveyId];
    }

    /* ------------------------ Admin ------------------------- */

    function setBaseTokenURI(string calldata base_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseTokenURI = base_;
    }

    function adminRepoint(uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_ownerOf(tokenId) != address(0), "no token");
        uint8 p = tokenPoints[tokenId];
        require(p > 0, "no points");
        _setTokenURI(tokenId, string.concat(baseTokenURI, uint256(p).toString(), ".json"));
    }

    /* ------------------------ Burning ----------------------- */

    function burn(uint256 tokenId) external {
        address owner = _requireOwned(tokenId); // revertet, falls nicht existent
        require(_isAuthorized(owner, _msgSender(), tokenId), "not owner/approved");
        _burn(tokenId); // In OZ v5 nicht virtual -> NICHT überschreiben
        // optional: delete tokenPoints[tokenId];
    }

    function burnAny(uint256 tokenId) external onlyRole(DELETER_ROLE) {
        _burn(tokenId);
        // optional: delete tokenPoints[tokenId];
    }

    function burnAllFor(address user, uint256 surveyId) external onlyRole(DELETER_ROLE) {
        uint256 tid = mintedTokenId[user][surveyId];
        require(tid != 0 && _ownerOf(tid) != address(0), "no token for pair");
        _burn(tid);
        // Reset erlaubt erneutes Claiming (falls gewünscht):
        minted[user][surveyId] = false;
        mintedTokenId[user][surveyId] = 0;
        // optional: delete tokenPoints[tid];
    }

    /* --------------------- Soulbound via _update ------------- */

    // OZ v5: Transfers finden intern über _update statt.
    // Blocke echte Transfers (mint: from==0; burn: to==0).
    function _update(address to, uint256 tokenId, address auth)
    internal
    override(ERC721, ERC721Enumerable)
    returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    // OZ v5: Synchronisation mit Enumerable
    function _increaseBalance(address account, uint128 amount)
    internal
    override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, amount);
    }

    /* --------------------- OZ v5 Overrides ------------------ */

    function supportsInterface(bytes4 iid)
    public
    view
    override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
    returns (bool)
    {
        return super.supportsInterface(iid);
    }

    // Muss wegen Mehrfachvererbung (ERC721 & ERC721URIStorage) explizit zusammengeführt werden
    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /* ---------------------- ERC2771 Context ----------------- */

    function _msgSender()
    internal
    view
    override(Context, ERC2771Context)
    returns (address sender)
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
}
