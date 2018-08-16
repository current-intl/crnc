pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "./Pausable.sol";

/**
 * @title Pausable token
 * @dev StandardToken modified with custodial pausable transfers.
 **/
contract PausableToken is StandardToken, Pausable {

    constructor(address _custodian) public Pausable(_custodian) { }

    function transfer(
        address _to,
        uint256 _value
    )
      public
      whenNotPaused
      returns (bool)
    {
        return super.transfer(_to, _value);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    )
      public
      whenNotPaused
      returns (bool)
    {
        return super.transferFrom(_from, _to, _value);
    }

    function approve(
        address _spender,
        uint256 _value
    )
      public
      whenNotPaused
      returns (bool)
    {
        return super.approve(_spender, _value);
    }

    function increaseApproval(
        address _spender,
        uint _addedValue
    )
      public
      whenNotPaused
      returns (bool success)
    {
        return super.increaseApproval(_spender, _addedValue);
    }

    function decreaseApproval(
        address _spender,
        uint _subtractedValue
    )
      public
      whenNotPaused
      returns (bool success)
    {
        return super.decreaseApproval(_spender, _subtractedValue);
    }
}
