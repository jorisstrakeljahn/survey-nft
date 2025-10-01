// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@opengsn/contracts/src/BasePaymaster.sol";
import "@opengsn/contracts/src/utils/GsnTypes.sol";
import "@opengsn/contracts/src/interfaces/IRelayHub.sol";

contract SurveyPaymaster is BasePaymaster {
    address public target;          // dein SurveyNFT
    address public deleter;         // Wallet mit DELETER_ROLE im NFT
    IRelayHub public hub;           // <-- eigene Referenz auf den RelayHub (v2.2.6 hat kein getRelayHub())

    constructor(
        address relayHub,
        address forwarder,
        address targetContract,
        address deleterAddr
    ) {
        // BasePaymaster v2.2.6 hat KEINEN ctor mit Owner-Arg; Owner ist msg.sender
        setRelayHub(IRelayHub(relayHub));
        setTrustedForwarder(forwarder);

        hub     = IRelayHub(relayHub);   // <-- hier merken
        target  = targetContract;
        deleter = deleterAddr;
    }

    function setDeleter(address d) external onlyOwner { deleter = d; }

    // Pflicht in v2.x
    function versionPaymaster() external pure override returns (string memory) {
        return "2.2.6+opengsn.survey-paymaster";
    }

    // Whitelist: claimNFT immer; burnAny/burnAllFor nur vom deleter
    function preRelayedCall(
        GsnTypes.RelayRequest calldata req,
        bytes calldata /*sig*/,
        bytes calldata /*approvalData*/,
        uint256 /*maxPossibleGas*/
    ) external override returns (bytes memory context, bool rejectOnRecipientRevert) {
        require(msg.sender == address(hub), "only RelayHub");     // <-- hier hub nutzen
        require(req.request.to == target, "unauthorized target");

        // Funktions-Selector extrahieren
        bytes4 sel;
        bytes calldata cd = req.request.data;
        assembly { sel := calldataload(cd.offset) }

        if (sel == bytes4(keccak256("claimNFT(uint256,uint8)"))) {
            return ("", false);
        }
        if (
            sel == bytes4(keccak256("burnAny(uint256)")) ||
            sel == bytes4(keccak256("burnAllFor(address,uint256)"))
        ) {
            require(req.request.from == deleter, "not deleter");
            return ("", false);
        }

        // (Optional): Owner-Burn auch sponsern
        // if (sel == bytes4(keccak256("burn(uint256)"))) { return ("", false); }

        revert("fn not allowed");
    }

    function postRelayedCall(
        bytes calldata /*context*/,
        bool /*success*/,
        uint256 /*gasUse*/,
        GsnTypes.RelayData calldata /*relayData*/
    ) external override {
        require(msg.sender == address(hub), "only RelayHub");     // <-- hier hub nutzen
    }

    // Paymaster-Guthaben im RelayHub aufladen
    function deposit() external payable {
        hub.depositFor{value: msg.value}(address(this));          // <-- hier hub nutzen
    }
}
