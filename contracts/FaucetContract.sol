// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    uint256 public numOfFunders;
    mapping(address => bool) public funders;
    mapping(uint256 => address) public lutFunders;

    modifier limitWithdraw(uint256 withdrawAmount) {
        require(
            withdrawAmount <= 100000000000000000,
            "You can't withdraw more than 0.1 ether"
        );
        _;
    }

    receive() external payable {}

    function addFunds() external payable {
        address funder = msg.sender;
        if (!funders[funder]) {
            uint256 index = numOfFunders++;
            funders[funder] = true;
            lutFunders[index] = funder;
        }
    }

    function withdraw(uint256 withdrawAmount) external limitWithdraw(withdrawAmount) {
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);
        for (uint256 i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }
        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        return lutFunders[index];
    }
}

// const instance = await Faucet.deployed()
// instance.addFunds({from:accounts[0],value:"2000000000000000000"})
// instance.addFunds({from:accounts[1],value:"2000000000000000000"})
// instance.addFunds({from:accounts[2],value:"2000000000000000000"})
// instance.getAllFunders()
// instance.withdraw("5000000000000",{from:accounts[0]})
