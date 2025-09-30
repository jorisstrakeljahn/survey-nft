pragma solidity ^0.8.20;
import "@openzeppelin/contracts/metatx/ERC2771Forwarder.sol";
contract OZERC2771Forwarder is ERC2771Forwarder {
    constructor() ERC2771Forwarder("Survey Forwarder") {}
}
