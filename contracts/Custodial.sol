pragma solidity ^0.4.23;


/**
 * @title Custodial
 * @dev The Custodial contract has an custodian address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Custodial {
    address public custodian;

    event CustodyRenounced(address indexed previousCustodian);
    event CustodyTransferred(
      address indexed previousCustodian,
      address indexed newCustodian
    );

    /**
    * @dev The Ownable constructor sets the original `owner` of the contract to the sender
    * account.
    */
    constructor(address _custodianAddres) internal {
        custodian = _custodianAddres;
    }

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyCustodian() {
        require(msg.sender == custodian);
        _;
    }

    /**
    * @dev Allows the current custodian to relinquish control of the contract.
    */
    function renounceCustody() public onlyCustodian {
        emit CustodyRenounced(custodian);
        custodian = address(0);
    }

    /**
    * @dev Allows the current owner to transfer control of the contract to a newOwner.
    * @param _newCustodian The address to transfer ownership to.
    */
    function transferCustody(address _newCustodian) public onlyCustodian {
        transferCustody(_newCustodian);
    }

    /**
    * @dev Transfers control of the contract to a newOwner.
    * @param _newCustodian The address to transfer ownership to.
    */
    function _transferCustody(address _newCustodian) internal {
        require(_newCustodian != address(0));
        emit CustodyTransferred(custodian, _newCustodian);
        custodian = _newCustodian;
    }
}
