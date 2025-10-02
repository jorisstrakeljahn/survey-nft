pragma solidity ^0.8.20;

import "@opengsn/contracts/src/BasePaymaster.sol";
import "@opengsn/contracts/src/utils/GsnTypes.sol";
import "@opengsn/contracts/src/interfaces/IRelayHub.sol";

/**
 * SurveyPaymaster (OpenGSN v2.2.x)
 *
 * - Sponsorisiert claimNFT(...) für dein SurveyNFT.
 * - Optional: burnAny/burnAllFor nur durch "deleter"-Adresse.
 * - Kritisch: getHubAddr() implementiert – darauf verlässt sich der v2-Client beim init().
 */
contract SurveyPaymaster is BasePaymaster {
    // Ziel-Contract (dein SurveyNFT)
    address public target;
    // Adresse mit Löschrechten (DELETER_ROLE im NFT)
    address public deleter;
    // Lokale Referenz auf den RelayHub (v2-Client erwartet getHubAddr())
    IRelayHub public hub;

    // Selektoren (compile-time konstant)
    bytes4 private constant SEL_CLAIM     = bytes4(keccak256("claimNFT(uint256,uint8)"));
    bytes4 private constant SEL_BURN_ANY  = bytes4(keccak256("burnAny(uint256)"));
    bytes4 private constant SEL_BURN_ALL  = bytes4(keccak256("burnAllFor(address,uint256)"));
    bytes4 private constant SEL_BURN      = bytes4(keccak256("burn(uint256)"));

    constructor(
        address relayHub_,
        address forwarder_,
        address targetContract_,
        address deleterAddr_
    ) {
        require(relayHub_ != address(0) && forwarder_ != address(0) && targetContract_ != address(0), "zero addr");

        // BasePaymaster-internen Hub + Forwarder setzen
        setRelayHub(IRelayHub(relayHub_));      // BasePaymaster kennt den Hub
        setTrustedForwarder(forwarder_);        // ERC2771 forwarder (Polygon v2)

        // Eigene Felder synchron halten
        hub     = IRelayHub(relayHub_);
        target  = targetContract_;
        deleter = deleterAddr_;
    }

    /* ====================== Admin ====================== */

    function setDeleter(address d) external onlyOwner {
        deleter = d;
    }

    function setForwarder(address forwarder_) external onlyOwner {
        setTrustedForwarder(forwarder_);
    }

    function setRelayHubAddress(address relayHub_) external onlyOwner {
        setRelayHub(IRelayHub(relayHub_));  // BasePaymaster
        hub = IRelayHub(relayHub_);         // lokal
    }

    function setTarget(address targetContract_) external onlyOwner {
        require(targetContract_ != address(0), "zero addr");
        target = targetContract_;
    }

    /* ====================== GSN API ====================== */

    // v2-Client liest diese Versionssignatur
    function versionPaymaster() external pure override returns (string memory) {
        return "2.2.6+opengsn.survey-paymaster";
    }

    // <<< WICHTIG: vom v2-Client beim init() aufgerufen >>>
    function getHubAddr() external view override returns (address) {
        return address(hub);
    }

    // Whitelist / Policy vor der Weiterleitung
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
        require(req.request.to == target, "unauthorized target");

        // 4-Byte-Selector aus calldata
        bytes4 sel;
        bytes calldata cd = req.request.data;
        assembly { sel := calldataload(cd.offset) }

        // claimNFT(...) immer erlauben
        if (sel == SEL_CLAIM) {
            return ("", false);
        }

        // burns nur von "deleter"
        if (sel == SEL_BURN_ANY || sel == SEL_BURN_ALL /* || sel == SEL_BURN */) {
            require(req.request.from == deleter, "not deleter");
            return ("", false);
        }

        revert("fn not allowed");
    }

    // Nachlauf-Hook (hier nichts weiter nötig, aber Hub-Absender prüfen)
    function postRelayedCall(
        bytes calldata /*context*/,
        bool /*success*/,
        uint256 /*gasUseWithoutPost*/,
        GsnTypes.RelayData calldata /*relayData*/
    ) external override {
        require(msg.sender == address(hub), "only RelayHub");
    }

    /* ====================== Funds ====================== */

    // MATIC in den RelayHub einzahlen (sponsert künftige Relays)
    function deposit() external payable {
        hub.depositFor{value: msg.value}(address(this));
    }

    // Auszahlung aus dem Hub
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        hub.withdraw(amount, to);
    }

    function withdrawAll(address payable to) external onlyOwner {
        uint256 bal = hub.balanceOf(address(this));
        if (bal > 0) {
            hub.withdraw(bal, to);
        }
    }
}
