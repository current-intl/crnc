pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/token/ERC20/PausableToken.sol';

contract CurrentToken is PausableToken {

    string constant public name = "Current";
    string constant public symbol = "CRNC";
    uint8 constant public decimals = 18;
    uint8 public maxBatchSize = 50;

    address public communityAddress;
    address public presaleAddress;
    address public gibraltarAddress;
    address public distributorAddress;

    constructor(
        uint256 _communityTokens,
        uint256 _presaleTokens,
        uint256 _gibraltarTokens,
        address _communityAddress,
        address _presaleAddress,
        address _gibraltarAddress,
        address _distributorAddress
    ) public {
        //Set initial token holding accounts, non-contract owning accounts
        communityAddress = _communityAddress;
        presaleAddress = _presaleAddress;
        gibraltarAddress = _gibraltarAddress;    
        //create non-token holding distributor account, non-contract owning account
        distributorAddress = _distributorAddress;

        //default initial token supply
        totalSupply_ = 1000000000000000000000000000;

        uint256 _initSupply = _communityTokens.add(_presaleTokens.add(_gibraltarTokens));
        //verify token holding account distributions account for total token supply
        require(_initSupply == totalSupply_);

        //completed initial token balance distributions
        balances[communityAddress] = _communityTokens;
        balances[presaleAddress] = _presaleTokens; 
        balances[gibraltarAddress] = _gibraltarTokens;
    }

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

    function setMaxBatchSize(uint8 _maxBatchSize) 
    public
    onlyOwner 
    {
        require(_maxBatchSize > 0);
        maxBatchSize = _maxBatchSize;
    }

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