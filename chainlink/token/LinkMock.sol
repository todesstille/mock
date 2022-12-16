// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../../ERC20/ERC20Mock.sol";
import "./interface/ERC677Receiver.sol";

contract ERC677 is ERC20Mock {

    constructor() ERC20Mock("ChainLink Token", "LINK", 18) {
        _mint(msg.sender, 10**27);
    }

  function transferAndCall(address _to, uint _value, bytes memory _data)
    public
    returns (bool success)
  {
    super.transfer(_to, _value);
    emit Transfer(msg.sender, _to, _value);
    if (isContract(_to)) {
      contractFallback(_to, _value, _data);
    }
    return true;
  }


  // PRIVATE

  function contractFallback(address _to, uint _value, bytes memory _data)
    private
  {
    ERC677Receiver receiver = ERC677Receiver(_to);
    receiver.onTokenTransfer(msg.sender, _value, _data);
  }

  function isContract(address _addr)
    private
    view
    returns (bool hasCode)
  {
    uint length;
    assembly { length := extcodesize(_addr) }
    return length > 0;
  }

}