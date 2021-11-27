// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    uint256 public numOfFunders;
    mapping(address => bool) public funders;

    receive() external payable {}

    function addFunds() external payable {
        address funder = msg.sender;
        if (!funders[funder]) {
            numOfFunders++;
            funders[funder] = true;
        }
    }

    // function getAllFunders() external view returns (address[] memory) {
    //     address[] memory _funders = new address[](numOfFunders);
    //     for (uint256 i = 0; i < numOfFunders; i++) {
    //         _funders[i] = funders[i];
    //     }
    //     return _funders;
    // }

    // function getFunderAtIndex(uint8 index) external view returns (address) {
    //     return funders[index];
    // }
}
