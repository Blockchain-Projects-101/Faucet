// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    uint public numOfFunders;
    mapping(uint=>address) public funders;

    receive() external payable {}

    function addFunds() external payable {
        uint index = numOfFunders++;
        funders[index] = msg.sender;
    }

    // function getAllFunders() public view returns (address[] memory){
    //     return funders;
    // }
    function getFunderAtIndex(uint8 index) external view returns(address){
        return funders[index];
    }
} 
