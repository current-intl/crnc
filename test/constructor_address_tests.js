'use strict'
const Token = artifacts.require('./CurrentToken.sol');
const expectRevert = require('./exceptionUtil');

contract('CurrentToken', ([owner, communityAddress, presaleAddress, gibraltarAddress, distributorAddress, custodianAddress, testAddress]) => {


    const communityTokens = 100000000 * Math.pow(10, 18);
    const presaleTokens = 350000000 * Math.pow(10, 18);
    const gibraltarTokens = 550000000 * Math.pow(10, 18);
    const totalSupply = 1000000000 * Math.pow(10, 18);

    describe('Verify Token Construction - Addresses', () => {        
   
        it('0x0 address should fail construction in any address position', async () => {
            const controlArray = [communityAddress, presaleAddress, gibraltarAddress, distributorAddress, custodianAddress];

            for(let i = 0; i < controlArray.length; i++) 
            {
                let copy = controlArray.slice(0);
                copy[i] = 0x0;
                await expectRevert(Token.new)(communityTokens, presaleTokens, gibraltarTokens, copy[0], copy[1], copy[2], copy[3], copy[4]);
            }
        })


        it('duplicate token holding address should cause an incorrect total supply verification', async () => {
            await expectRevert(Token.new)(communityTokens, presaleTokens, gibraltarTokens,communityAddress, communityAddress, gibraltarAddress, distributorAddress, custodianAddress);
        })
        
        it('duplicate non-token accounts should revert contract deployment', async () => {
            await expectRevert(Token.new)(communityTokens, presaleTokens, gibraltarTokens,communityAddress, presaleAddress, gibraltarAddress, distributorAddress, distributorAddress);
        })

        it('distributor assigned a token holding address reverts contract deployment', async () => {
            await expectRevert(Token.new)(communityTokens, presaleTokens, gibraltarTokens,communityAddress, presaleAddress, gibraltarAddress, gibraltarAddress, custodianAddress);
        })
        it('custodian assigned a token holding address reverts contract deployment', async () => {
            await expectRevert(Token.new)(communityTokens, presaleTokens, gibraltarTokens,communityAddress, presaleAddress, gibraltarAddress, distributorAddress, gibraltarAddress);
        })
    })
});
