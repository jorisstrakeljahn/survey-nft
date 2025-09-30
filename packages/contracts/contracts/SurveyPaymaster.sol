// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@opengsn/contracts/src/BasePaymaster.sol";
import "@opengsn/contracts/src/utils/GsnTypes.sol";

contract SurveyPaymaster is BasePaymaster {
    address public target;      // SurveyNFT
    address public deleter;     // Wallet, das DELETER_ROLE im NFT hat

    constructor(address relayHub, address forwarder, address targetContract, address deleterAddr) {
        _setRelayHub(IRelayHub(relayHub));
        _setTrustedForwarder(forwarder);
        target = targetContract;
        deleter = deleterAddr;
    }

    function setDeleter(address d) external onlyOwner {
        deleter = d;
    }

    function preRelayedCall(
        GsnTypes.RelayRequest calldata req,
        bytes calldata /*sig*/,
        bytes calldata /*approvalData*/,
        uint256 /*maxGas*/
    ) external override returns (bytes memory, bool) {
        require(msg.sender == address(getRelayHub()), "only RelayHub");
        require(req.request.to == target, "unauthorized target");

        // Funktions-Selector extrahieren (erste 4 Bytes der call data)
        bytes4 sel;
        bytes calldata cd = req.request.data;
        assembly { sel := calldataload(cd.offset) }

        // claimNFT immer erlauben (gaslos)
        if (sel == bytes4(keccak256("claimNFT(uint256,uint8)"))) {
            return ("", false);
        }

        // burnAny / burnAllFor nur erlauben, wenn Absender = deleter
        if (
            sel == bytes4(keccak256("burnAny(uint256)")) ||
            sel == bytes4(keccak256("burnAllFor(address,uint256)"))
        ) {
            require(req.request.from == deleter, "not deleter");
            return ("", false);
        }

        revert("fn not allowed");
    }

    function postRelayedCall(
        bytes calldata, bool, uint256, GsnTypes.RelayData calldata
    ) external override {
        require(msg.sender == address(getRelayHub()), "only RelayHub");
    }

    // Deposit zum RelayHub
    function deposit() external payable {
        getRelayHub().depositFor{value: msg.value}(address(this));
    }
}
