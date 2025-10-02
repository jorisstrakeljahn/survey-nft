pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * SurveyNFT v2
 *
 * - claimNFT(surveyId, points): einmalig pro (user, surveyId)
 * - tokenURI nur von "points" abhängig: base + "<points>.json"
 * - adminRepoint(tokenId): setzt URI neu anhand gespeicherter Punkte
 * - EIP-2771 (TrustedForwarder) für GSN v2 (korrekte _msgSender())
 * - Burn-Optionen für Admin/Owner
 */
contract SurveyNFT is ERC721URIStorage, AccessControl, ERC2771Context {
    using Strings for uint256;

    bytes32 public constant DELETER_ROLE = keccak256("DELETER_ROLE");

    // Zähler für Token-IDs
    uint256 private _nextId;

    // Basis-URI für die Punkte-Metadaten (z.B. https://vpstunden.hsbi.de/vpp-metadata/)
    string public baseTokenURI;

    // Einmaligkeits-Check pro (user, surveyId)
    mapping(address => mapping(uint256 => bool)) public minted;

    // Für Repoint/Anzeige: Punkte je Token
    mapping(uint256 => uint8) public tokenPoints;

    // Optional nützlich für Admin-Löschungen / Re-Mint: geminter Token pro (user, surveyId)
    mapping(address => mapping(uint256 => uint256)) public mintedTokenId;

    /* ---------------------------------------------------------- */
    /*                           Constructor                      */
    /* ---------------------------------------------------------- */
    constructor(
        string memory name_,
        string memory symbol_,
        address trustedForwarder_,   // Polygon v2 Forwarder: 0xdA78a11FD57aF7be2eDD804840eA7f4c2A38801d
        string memory baseTokenURI_, // z.B. "https://vpstunden.hsbi.de/vpp-metadata/"
        address admin_,              // DEFAULT_ADMIN_ROLE
        address deleter_             // DELETER_ROLE (für burnAny/burnAllFor)
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
        _nextId = 1; // Start bei 1 (optional)
    }

    /* ---------------------------------------------------------- */
    /*                           Minting                          */
    /* ---------------------------------------------------------- */

    /**
     * claimNFT: einmalig pro (msg.sender, surveyId)
     * points steuert die Metadaten-Datei: <baseTokenURI><points>.json
     */
    function claimNFT(uint256 surveyId, uint8 points) external returns (uint256 tokenId) {
        address user = _msgSender(); // korrekt via ERC2771Context

        require(!minted[user][surveyId], "already claimed for survey");
        require(points > 0, "points=0");
        // Optional: Obergrenze absichern (wenn du nur 1..3 nutzt):
        // require(points <= 3, "points too high");

        tokenId = _nextId++;
        _safeMint(user, tokenId);

        // Punkte speichern (für Repoint/Anzeige)
        tokenPoints[tokenId] = points;

        // Mapping für Einmaligkeit
        minted[user][surveyId] = true;
        mintedTokenId[user][surveyId] = tokenId;

        // URI aus Punkten ableiten
        _repointTokenURI(tokenId, points);
    }

    /**
     * View-Helfer wie von dir genutzt: wurde (user, surveyId) schon gemintet?
     */
    function mintedFor(address user, uint256 surveyId) external view returns (bool) {
        return minted[user][surveyId];
    }

    /* ---------------------------------------------------------- */
    /*                           Admin                            */
    /* ---------------------------------------------------------- */

    /**
     * Setzt die Basis-URI (z.B. auf deinen CDN/Server).
     * Danach kann adminRepoint() benutzt werden, um existierende Token neu zu setzen.
     */
    function setBaseTokenURI(string calldata base_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseTokenURI = base_;
    }

    /**
     * Neuberechnung der URI anhand der gespeicherten Punkte.
     * Praktisch, wenn du das Schema (oder base) änderst.
     */
    function adminRepoint(uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_exists(tokenId), "no token");
        uint8 p = tokenPoints[tokenId];
        require(p > 0, "no points");
        _repointTokenURI(tokenId, p);
    }

    /**
     * (Optional) Admin kann den TrustedForwarder aktualisieren.
     */
    function setTrustedForwarder(address newForwarder) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setTrustedForwarder(newForwarder);
    }

    /* ---------------------------------------------------------- */
    /*                          Burning                           */
    /* ---------------------------------------------------------- */

    /**
     * Owner darf eigenen Token verbrennen.
     */
    function burn(uint256 tokenId) external {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "not owner/approved");
        _burn(tokenId);
    }

    /**
     * Admin mit DELETER_ROLE darf beliebige Token verbrennen.
     */
    function burnAny(uint256 tokenId) external onlyRole(DELETER_ROLE) {
        _burn(tokenId);
    }

    /**
     * Admin mit DELETER_ROLE: Token zu (user, surveyId) verbrennen
     * und den Einmaligkeits-Status zurücksetzen → User darf erneut claimen.
     */
    function burnAllFor(address user, uint256 surveyId) external onlyRole(DELETER_ROLE) {
        uint256 tid = mintedTokenId[user][surveyId];
        require(tid != 0 && _exists(tid), "no token for pair");
        _burn(tid);
        // Reset für erneutes Claiming, falls gewünscht:
        minted[user][surveyId] = false;
        mintedTokenId[user][surveyId] = 0;
    }

    /* ---------------------------------------------------------- */
    /*                      Internal Helpers                      */
    /* ---------------------------------------------------------- */

    function _repointTokenURI(uint256 tokenId, uint8 points) internal {
        // base + "<points>.json"
        // z.B. "https://vpstunden.hsbi.de/vpp-metadata/1.json"
        string memory uri = string.concat(baseTokenURI, uint256(points).toString(), ".json");
        _setTokenURI(tokenId, uri);
    }

    /* ---------------------------------------------------------- */
    /*                  ERC2771 / OZ Overrides                    */
    /* ---------------------------------------------------------- */

    // AccessControl + ERC721
    function supportsInterface(bytes4 iid)
    public
    view
    override(ERC721, AccessControl)
    returns (bool)
    {
        return super.supportsInterface(iid);
    }

    // ERC721URIStorage: _burn + tokenURI
    function _burn(uint256 tokenId)
    internal
    override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
        // tokenPoints[tokenId] optional behalten oder loeschen:
        // delete tokenPoints[tokenId];
    }

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // ERC2771Context: korrekter msg.sender hinter dem Forwarder
    function _msgSender()
    internal
    view
    override(Context, ERC2771Context)
    returns (address sender)
    {
        sender = ERC2771Context._msgSender();
    }

    function _msgData()
    internal
    view
    override(Context, ERC2771Context)
    returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }
}
