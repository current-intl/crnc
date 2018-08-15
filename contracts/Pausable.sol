pragma solidity 0.4.24;

import "./Custodial.sol";

/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is Custodial {
    event Pause();
    event Unpause();

    constructor (address _custodian) internal Custodial(_custodian) {}

    bool public paused = false;

    /**
    * @dev Modifier to make a function callable only when the contract is not paused.
    */
    modifier whenNotPaused() {
        require(!paused, "Expected paused to be false, but found true.");
        _;
    }

    /**
    * @dev Modifier to make a function callable only when the contract is paused.
    */
    modifier whenPaused() {
        require(paused, "Expected paused to be true, but found false");
        _;
    }

    /**
    * @dev called by the owner to pause, triggers stopped state
    */
    function pause() public onlyCustodian whenNotPaused {
        paused = true;
        emit Pause();
    }

    /**
    * @dev called by the owner to unpause, returns to normal state
    */
    function unpause() public onlyCustodian whenPaused {
        paused = false;
        emit Unpause();
    }
}
