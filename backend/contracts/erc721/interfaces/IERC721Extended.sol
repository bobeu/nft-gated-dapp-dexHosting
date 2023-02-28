// SPDX-License-Identifier: MIT

pragma solidity  0.8.17;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";
import "@openzeppelin/contracts/interfaces/IERC721Metadata.sol";

interface IERC721Extended is IERC721, IERC721Receiver, IERC721Metadata {
  function burn(uint256 tokenId) external returns(bool);
  function mint() external payable returns(bool);
}