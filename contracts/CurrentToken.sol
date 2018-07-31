pragma solidity ^0.4.24;
import 'zeppelin-solidity/contracts/token/ERC20/PausableToken.sol';

/// @title Current CRNC ERC20 Token
/// @author Current (Gibraltar) Limited 
/// @notice This contract serves as the main Current token bearing entity
contract CurrentToken is PausableToken {

    string constant public name = "Current";
    string constant public symbol = "CRNC";
    uint8 constant public decimals = 18;
    uint8 public maxBatchSize = 50;

    address public communityAddress;
    address public presaleAddress;
    address public gibraltarAddress;
    address public distributorAddress;

    /// @notice ctor with default token balances and non-contract owning Current
    ///         token holding accounts
    constructor(
        uint256 _communityTokens,
        uint256 _presaleTokens,
        uint256 _gibraltarTokens,
        address _communityAddress,
        address _presaleAddress,
        address _gibraltarAddress,
        address _distributorAddress
    ) public {
        communityAddress = _communityAddress;
        presaleAddress = _presaleAddress;
        gibraltarAddress = _gibraltarAddress;    
        distributorAddress = _distributorAddress;

        totalSupply_ = 1000000000000000000000000000;

        uint256 _initSupply = _communityTokens.add(_presaleTokens.add(_gibraltarTokens));

        require(_initSupply == totalSupply_);

        balances[communityAddress] = _communityTokens;
        balances[presaleAddress] = _presaleTokens; 
        balances[gibraltarAddress] = _gibraltarTokens;
    }

    /// @notice Support for initial token distribution for multiple recipients in a single 
    ///         transaction to try and reduce gas costs during token distributions.  This method is available to any token holders 
    ///         to complete batch distributions to multiple recipients with varying distribution amounts.
    /// @dev If the token senders account balance is depleted over the course of the batch transfer
    ///      prior to exhausting the distribution list this call will revert.
    /// @param _recipients List of recipient addresses
    /// @param _distributions matching list of recipient amounts
    function batchTransfer(
        address[] _recipients,
        uint256[] _distributions
    ) 
    public 
    whenNotPaused 
    {
        require(_recipients.length == _distributions.length);
        require(_recipients.length <= maxBatchSize);

        for (uint8 i = 0; i < _recipients.length; i++) {
            transfer(_recipients[i], _distributions[i]);
        }
    }

    /// @notice Setter to modify the max available batch size by owner only
    /// @dev must be greater than 0, and can anticipate overflow on uint8 for values greater than 256
    /// @param _maxBatchSize new max batch size between 1 and 255
    function setMaxBatchSize(uint8 _maxBatchSize) 
    public
    onlyOwner 
    {
        require(_maxBatchSize > 0);
        maxBatchSize = _maxBatchSize;
    }

    /// @notice Whitelisted call to underlying batch transfer when the contract is in a paused state. Subject
    ///         to all restrictions and limitations of the batch transfer method. 
    /// @param _recipients List of recipient addresses
    /// @param _distributions matching list of recipient amounts
    function batchTransferWhenPaused(
        address[] _recipients,
        uint256[] _distributions
    ) 
    public
    whenPaused 
    {
        require(
            msg.sender == communityAddress || msg.sender == gibraltarAddress || msg.sender == presaleAddress || msg.sender == distributorAddress
        );

        paused = false;
        batchTransfer(_recipients, _distributions);
        paused = true;
    }
}

/*
THE OFFER, SALE, AND ISSUANCE OF THE TOKENS HAS NOT BEEN REGISTERED OR QUALIFIED UNDER LAWS OF ANY JURISDICTION IN THE WORLD. 
THE TOKENS MAY NOT BE OFFERED, SOLD OR OTHERWISE TRANSFERRED, PLEDGED OR HYPOTHECATED, EXCEPT AS PERMITTED UNDER ALL APPLICABLE LAWS. 
THE TOKENS MAY ONLY BE OFFERED, SOLD, AND ISSUED ONLY IN JURISDICTIONS WHERE SUCH REGISTRATION OR QUALIFICATION IS NOT REQUIRED, 
INCLUDING PURSUANT TO APPLICABLE EXEMPTIONS THAT LIMIT THE PURCHASERS WHO ARE ELIGIBLE TO PURCHASE THE TOKENS AND THAT RESTRICT 
THEIR RESALE. NO GOVERNMENTAL AUTHORITY HAS REVIEWED THE TOKENS OR ANY RELATED DOCUMENTS OR COMMUNICATIONS OR CONFIRMED THE ACCURACY, 
TRUTHFULNESS, OR COMPLETENESS OF THE TOKENS OR ANY RELATED DOCUMENTS OR COMMUNICATIONS. ANY REPRESENTATION TO THE CONTRARY IS ILLEGAL. 
YOU ARE REQUIRED TO INFORM YOURSELF ABOUT, AND TO OBSERVE ANY RESTRICTIONS RELATING TO THE TOKENS AND ANY RELATED DOCUMENTS.
*/