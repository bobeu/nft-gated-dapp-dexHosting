// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, Ownable{
  uint public testAmount;
  mapping(address => bool) public isClaimed;

  constructor() ERC20('CELOG Token', 'CELOG') {
    testAmount = 5000 * (10 ** 18);
    _mint(msg.sender, testAmount);
  }

  function selfClaimDrop() public {
    require(!isClaimed[msg.sender], "User already Claimed");
    isClaimed[msg.sender] = true;
    _mint(msg.sender, testAmount);
  }

  function specialDrop(address to) public onlyOwner {
    _mint(to, testAmount);
  }
}