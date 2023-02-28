// SPDX-License-Identifier: Unlicense

pragma solidity  0.8.17;

import "./ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Membership is Ownable, ERC721Pausable {
  error ZeroAddress(address);

  uint public tokenId;
  mapping (address => bool) public isMember;

  /**
    @dev Enforces that @param target - must not be empty
          address.
   */
  modifier notZeroAddress(address target) {
    if(target == address(0)) revert ZeroAddress(target);
    _;
  }

  //Initialize state vars
  constructor () ERC721("SwapLab User", "SLU") {
  }

  receive() external payable {
    revert();
  }

  /**
    @notice Mint Membership NFT
           Owner's privilege.
            o 'TokenId' must not have been minted before now.
              o No user can have more than one membership NFT.
  */
  function mint() public payable returns(bool) {
    require(msg.value >= 1e16 wei, "Insufficient value");
    require(!isMember[_msgSender()], "Already a user");
    isMember[_msgSender()] = true;
    tokenId ++;
    uint tk = tokenId;
    (bool sent,) = owner().call{value: msg.value}('');
    require(sent, "Failed");
    _safeMint(_msgSender(), tk);
    _approve(_msgSender(), tk);

    return true;
  }

  ///@dev Burns 'tokenId' Note - Owner's privilege
  function burn(uint _tokenId) external onlyOwner returns(bool) {
    _burn(_tokenId);

    return true;
  } 

  /** See ERC721 _transfer. Membership is not transferable*/
  function _transfer(address from, address to, uint256 _tokenId ) internal override
  {
    require(paused() || _msgSender() == owner(), "Tansfer not alloowed");
    super._transfer(from, to, _tokenId);
  }

  /** @dev Halts contract execution */
  function pause() public onlyOwner 
  {
    _pause();
  }

  /** @dev Continues contract execution */
  function unpause() public onlyOwner 
  {
    _unpause();
  }

  function onERC721Received(
      address operator,
      address from,
      uint256 _tokenId,
      bytes calldata data
  ) external override returns (bytes4) {}
}