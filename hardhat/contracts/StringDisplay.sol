// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "hardhat/console.sol";

contract StringDisplay {
    string public display = 'initial';
    address owner;
    address opsProxy;
    bool public active = false;
    event NewString();

    constructor() {
        owner = msg.sender;
    }

    function toggleChange() external {
        active = !active;
    }

    function setString(string memory _string) external onlyOpsProxy {
        display = _string;
        emit NewString();
    }

    function setMockString(string memory _string) external {
        display = _string;
        emit NewString();
    }

    function setOpsProxy(address _opsProxy) external onlyOwner {
        opsProxy = _opsProxy;
    }

    modifier onlyOpsProxy() {
        require(msg.sender == opsProxy, "NOT ALLOWED");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }
}
