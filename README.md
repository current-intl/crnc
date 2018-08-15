<img width="360" alt="current" src="./assets/current.png">

# Current Smart Contracts
[![npm](https://img.shields.io/npm/v/npm.svg)](https://github.com/nodejs/node)
[![truffle](https://img.shields.io/badge/truffle-docs-orange.svg)](http://truffleframework.com/docs/)
[![ganache-cli](https://img.shields.io/badge/ganache-cli-yellowgreen.svg)](http://truffleframework.com/ganache/)
[![solidity](https://img.shields.io/badge/solidity-docs-red.svg)](https://solidity.readthedocs.io/en/develop/)
[![OpenZeppelin](https://img.shields.io/badge/openzeppelin-contracts-lightgrey.svg)](https://github.com/OpenZeppelin/zeppelin-solidity)

THE OFFER, SALE, AND ISSUANCE OF THE TOKENS HAS NOT BEEN REGISTERED OR QUALIFIED UNDER LAWS OF ANY JURISDICTION IN THE WORLD. THE TOKENS MAY NOT BE OFFERED, SOLD OR OTHERWISE TRANSFERRED, PLEDGED OR HYPOTHECATED, EXCEPT AS PERMITTED UNDER ALL APPLICABLE LAWS. THE TOKENS MAY ONLY BE OFFERED, SOLD, AND ISSUED ONLY IN JURISDICTIONS WHERE SUCH REGISTRATION OR QUALIFICATION IS NOT REQUIRED, INCLUDING PURSUANT TO APPLICABLE EXEMPTIONS THAT LIMIT THE PURCHASERS WHO ARE ELIGIBLE TO PURCHASE THE TOKENS AND THAT RESTRICT THEIR RESALE. NO GOVERNMENTAL AUTHORITY HAS REVIEWED THE TOKENS OR ANY RELATED DOCUMENTS OR COMMUNICATIONS OR CONFIRMED THE ACCURACY, TRUTHFULNESS, OR COMPLETENESS OF THE TOKENS OR ANY RELATED DOCUMENTS OR COMMUNICATIONS. ANY REPRESENTATION TO THE CONTRARY IS ILLEGAL. YOU ARE REQUIRED TO INFORM YOURSELF ABOUT, AND TO OBSERVE ANY RESTRICTIONS RELATING TO THE TOKENS AND ANY RELATED DOCUMENTS.

The CRNC Token is a derivative of the Open Zeppelin, [PausableToken](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC20/PausableToken.sol) ERC20 smart contract.

The Pausable and PausableToken were ported to allow for a variant on the Pausable life cycle contract providing a mechanism for a non-contract owner to manage the paused state of the ERC20 token. In lieu of the Ownable implementation, a new Custodial contract has been created which allows a constructor based address assignment. All methods, modifiers and general functionality have been carried over from the original Open Zeppelin contracts with the applicable modifications and supporting test suit.

## Project description
Current is a blockchain-enabled media network that rewards users for streaming media.

## Dependencies
We use [Truffle](http://truffleframework.com/) to compile, test and deploy smart contracts.

You will also need a running node with an active JSON-RPC (required). For testing purposes, we suggest using [Ganache](http://truffleframework.com/ganache).
We strongly recommend you to use latest **node** and  **npm** versions.<br />

For more information about Truffle visit [http://truffleframework.com/docs/](http://truffleframework.com/docs/).

## Modifications

```Javascript
    function batchTransfer(
        address[] _recipients,
        uint256[] _distributions
    )
    public
    whenNotPaused
    {
        require(_recipients.length == _distributions.length, "Recipient and distribution arrays do not match");

        for (uint256 i = 0; i < _recipients.length; i++) {
            transfer(_recipients[i], _distributions[i]);
        }
    }
```
The **batchTransfer** method was added support the initial token distribution for multiple recipients in a single transaction to try and reduce gas costs during token distributions.  This method is available to any token holders to complete batch distributions to multiple recipients with varying distribution amounts.

```Javascript
    function batchTransferWhenPaused(
        address[] _recipients,
        uint256[] _distributions
    )
    public
    whenPaused
    {
        require(
            msg.sender == communityAddress || msg.sender == presaleAddress || msg.sender == distributorAddress,
            "Attempting to batch transfer when contract is paused with a non-whitelisted account"
        );

        paused = false;
        batchTransfer(_recipients, _distributions);
        paused = true;
    }
}

```
The **batchTransferWhilePaused** is in place to allow Current (Gibraltar) Ltd the ability to distribute tokens from the initial balance holding accounts to investors, bounty and referral participants while the contract is paused initially.  Current (Gibraltar) Ltd is committed to ensuring the CRNC tokens are used, sold and transferred responsibly and within the legal and compliance boundaries of governing authorities.

## Testing

Make sure ganache-cli is running prior to execute solidity-covert or truffle test

For code coverage results run ./node_modules/.bin/solidity-coverage

## Security Scanning
Pre-audit security scans were completed utilizing Mythril static analysis.  To replicate the security scan please use the following instructions:

1. [Install](https://docs.docker.com/install/) Docker

Since we will be testing a truffle based project...

2. change your terminal to the root of downloaded git repository
    ``` bash
    cd ~/code/CRNC
    ```
3. run the following command:
    ```bash
    $ docker run -v $(pwd):/tmp -w "/tmp/" mythril/myth --truffle
    ```
    The docker run will mount the docker containers /tmp directory to the terminal present working directory, and then set the container working directory to /tmp/ providing access to all of your *.sol code.

## Contracts on Etherscan
Token address:
 [???](https://etherscan.io/)

## Licensing
MIT License

Copyright © 2018 Current (Gibraltar) Limited

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
