pragma solidity ^0.8.20;

import "@opengsn/contracts/src/BasePaymaster.sol";
import "@opengsn/contracts/src/utils/GsnTypes.sol";
import "@opengsn/contracts/src/interfaces/IRelayHub.sol";

interface ISurveyNFT {
    function hasRole(bytes32 role, address account) external view returns (bool);
    function getRoleAdmin(bytes32 role) external view returns (bytes32);
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract SurveyPaymaster is BasePaymaster {
    // Ziel-Contract (SurveyNFT)
    address public target;
    // RelayHub-Referenz (v2)
    IRelayHub public hub;

    // Rollen-Hashes (müssen mit NFT übereinstimmen)
    bytes32 public constant DELETER_ROLE = keccak256("DELETER_ROLE");
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    // Funktions-Selectoren (4-Byte)
    bytes4 private constant SEL_CLAIM        = bytes4(keccak256("claimNFT(uint256,uint8)"));
    bytes4 private constant SEL_BURN_ANY     = bytes4(keccak256("burnAny(uint256)"));
    bytes4 private constant SEL_BURN_ALL     = bytes4(keccak256("burnAllFor(address,uint256)"));
    bytes4 private constant SEL_BURN_OWNER   = bytes4(keccak256("burn(uint256)"));                  // optional
    bytes4 private constant SEL_GRANT_ROLE   = bytes4(keccak256("grantRole(bytes32,address)"));
    bytes4 private constant SEL_REVOKE_ROLE  = bytes4(keccak256("revokeRole(bytes32,address)"));
    // (Optional) bytes4 private constant SEL_ADMIN_REPOINT = bytes4(keccak256("adminRepoint(uint256)"));
    // (Optional) bytes4 private constant SEL_SET_BASE_URI  = bytes4(keccak256("setBaseTokenURI(string)"));

    constructor(
        address relayHub_,
        address forwarder_,
        address targetContract_
    ) {
        require(relayHub_ != address(0) && forwarder_ != address(0) && targetContract_ != address(0), "zero addr");
        setRelayHub(IRelayHub(relayHub_));
        setTrustedForwarder(forwarder_);
        hub    = IRelayHub(relayHub_);
        target = targetContract_;
    }

    /* ====================== Admin (optional) ====================== */

    function setTarget(address targetContract_) external onlyOwner {
        require(targetContract_ != address(0), "zero addr");
        target = targetContract_;
    }

    function setRelayHubAddress(address relayHub_) external onlyOwner {
        setRelayHub(IRelayHub(relayHub_));
        hub = IRelayHub(relayHub_);
    }

    function setForwarder(address forwarder_) external onlyOwner {
        setTrustedForwarder(forwarder_);
    }

    /* ====================== GSN v2 API ====================== */

    // Vom Client beim init() aufgerufen
    function versionPaymaster() external pure override returns (string memory) {
        return "2.2.6+opengsn.survey-paymaster";
    }

    // >>> WICHTIG: v2-Client erwartet diesen Getter
    function getHubAddr() external view override returns (address) {
        return address(hub);
    }

    function preRelayedCall(
        GsnTypes.RelayRequest calldata req,
        bytes calldata /*signature*/,
        bytes calldata /*approvalData*/,
        uint256 /*maxPossibleGas*/
    )
    external
    override
    returns (bytes memory context, bool rejectOnRecipientRevert)
    {
        require(msg.sender == address(hub), "only RelayHub");
        require(req.request.to == target,   "unauthorized target");

        // Funktions-Selector
        bytes4 sel;
        bytes calldata cd = req.request.data;
        assembly { sel := calldataload(cd.offset) }

        address from = req.request.from;

        // 1) claimNFT(...) → erlauben (gaslos für alle)
        if (sel == SEL_CLAIM) {
            return ("", false);
        }

        ISurveyNFT nft = ISurveyNFT(target);

        // 2) burnAny / burnAllFor → nur mit DELETER_ROLE
        if (sel == SEL_BURN_ANY || sel == SEL_BURN_ALL) {
            require(_hasRole(nft, DELETER_ROLE, from), "deleter only");
            return ("", false);
        }

        // 3) (optional) burn(owner) → nur wenn from == ownerOf(tokenId)
        if (sel == SEL_BURN_OWNER) {
            uint256 tokenId = _decodeUint256Arg(cd, 0); // burn(tokenId)
            require(_tryOwnerOf(nft, tokenId) == from, "not token owner");
            return ("", false);
        }

        // 4) grantRole/revokeRole → nur für Admin der DELETER_ROLE und nur für genau diese Rolle
        if (sel == SEL_GRANT_ROLE || sel == SEL_REVOKE_ROLE) {
            (bytes32 roleParam, /*address account*/) = _decodeGrantRevoke(cd);
            require(roleParam == DELETER_ROLE, "role not allowed");
            require(_isRoleAdmin(nft, roleParam, from), "role admin only");
            return ("", false);
        }

        // 5) (optional) adminRepoint / setBaseTokenURI → nur DEFAULT_ADMIN
        // if (sel == SEL_ADMIN_REPOINT || sel == SEL_SET_BASE_URI) {
        //     require(_hasRole(nft, DEFAULT_ADMIN_ROLE, from), "admin only");
        //     return ("", false);
        // }

        revert("fn not allowed");
    }

    function postRelayedCall(
        bytes calldata /*context*/,
        bool /*success*/,
        uint256 /*gasUseWithoutPost*/,
        GsnTypes.RelayData calldata /*relayData*/
    ) external override {
        require(msg.sender == address(hub), "only RelayHub");
    }

    /* ====================== Funds ====================== */

    // MATIC ins RelayHub einzahlen (nicht via GSN, da value benötigt)
    function deposit() external payable {
        hub.depositFor{value: msg.value}(address(this));
    }

    function withdraw(address payable to, uint256 amount) external onlyOwner {
        hub.withdraw(amount, to);
    }

    function withdrawAll(address payable to) external onlyOwner {
        uint256 bal = hub.balanceOf(address(this));
        if (bal > 0) {
            hub.withdraw(bal, to);
        }
    }

    /* ====================== Internals ====================== */

    function _hasRole(ISurveyNFT nft, bytes32 role, address account) internal view returns (bool) {
        return nft.hasRole(role, account);
    }

    function _isRoleAdmin(ISurveyNFT nft, bytes32 role, address account) internal view returns (bool) {
        bytes32 adminRole = nft.getRoleAdmin(role);
        return nft.hasRole(adminRole, account);
    }

    function _tryOwnerOf(ISurveyNFT nft, uint256 tokenId) internal view returns (address) {
        // ownerOf revertet bei nicht-existenten Tokens → try/catch pattern wäre extern; hier reicht Annahme: UI zeigt nur existierende
        return nft.ownerOf(tokenId);
    }

    // decode uint256 argument at index i (0-based) after 4-byte selector
    function _decodeUint256Arg(bytes calldata data, uint256 index) internal pure returns (uint256 v) {
        uint256 offset = 4 + 32 * index;
        require(data.length >= offset + 32, "bad calldata len");
        assembly { v := calldataload(add(data.offset, offset)) }
    }

    // decode grantRole/revokeRole(bytes32,address)
    function _decodeGrantRevoke(bytes calldata data) internal pure returns (bytes32 role, address account) {
        require(data.length >= 4 + 64, "bad calldata len");
        assembly {
            role    := calldataload(add(data.offset, 4))
            account := shr(96, calldataload(add(data.offset, 36))) // address is right-padded in 32 bytes
        }
    }
}
