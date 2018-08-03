'use strict'
const Token = artifacts.require('./CurrentToken.sol');
const expectRevert = require('./exceptionUtil');

contract('CurrentToken', ([owner, communityAddress, presaleAddress, gibraltarAddress, distributorAddress, custodianAddress, testAddress]) => {

    let tokenContract;

    const communityTokens = 100000000 * Math.pow(10, 18);
    const presaleTokens = 350000000 * Math.pow(10, 18);
    const gibraltarTokens = 550000000 * Math.pow(10, 18);
    const totalSupply = 1000000000 * Math.pow(10, 18);

    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log(`running ${__filename}`)
    console.log(`Community Address: ${communityAddress}`)
    console.log(`Custodian Address: ${custodianAddress}`)
    console.log(`new Custodian Address: ${testAddress}`)
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

    beforeEach(async () => {

        tokenContract = await Token.new(communityTokens, presaleTokens, gibraltarTokens, communityAddress, presaleAddress, gibraltarAddress, distributorAddress, custodianAddress);
    });

    describe('Custody', () => {
        it('Contract Custodian should be 0x0 after relinquishing custody', async () => {
     
            await tokenContract.renounceCustody({from: custodianAddress});
            let actual = await tokenContract.custodian.call({from: custodianAddress});
             assert.equal(actual, 0x0000000000000000000000000000000000000000);
        });

        it('A non-custodial account cannot relinquish custody', async () => {
            await expectRevert(tokenContract.renounceCustody)({from: testAddress});
        });

        it('Contract Custodian should be 0x0...1 after transfer of custody', async () => {
            await tokenContract.transferCustody('0xf6a948bff792e4f42d7f17e5e4ebe20871d160f2', {from: custodianAddress});
            let actual = await tokenContract.custodian();
            assert.equal(actual, '0xf6a948bff792e4f42d7f17e5e4ebe20871d160f2');
        });

        it('A non-custodial account cannot  transfer of custody', async () => {
            await expectRevert(tokenContract.transferCustody)('0xf6a948bff792e4f42d7f17e5e4ebe20871d160f2', {from: testAddress});
        });

        it('Transferring custody to account 0x0 will revert', async () => {
            await expectRevert(tokenContract.transferCustody)(0x0000000000000000000000000000000000000000, {from: custodianAddress})
        });
    });

    describe('Verify Token Construction', () => {
        it('Should verify decimals', async () => {
            let actual = await tokenContract.decimals.call();
            assert.equal(actual, 18, 'Decimals do not match');
        });
    
        it('Should verify total supply', async () => {
            let actual = await tokenContract.totalSupply.call();
            assert.equal(actual, totalSupply, 'Total supply is incorrect');
        });
    
        it('Should verify token symbol', async () => {
            let actual = await tokenContract.symbol.call();
            assert.equal(actual, 'CRNC', 'Token symbol is incorrect');
        })
    
        it('Should verify token name', async () => {
            let actual = await tokenContract.name.call();
            assert.equal(actual, 'Current', 'Token name is incorrect');
        })
    
        it('Should verify an airdrop allocation address', async () => {
            let actual = await tokenContract.communityAddress.call();
            assert.equal(actual, communityAddress, 'communityTokens allocation address is incorrect')
        });
    
        it('Should verify an airdrop allocation address balance', async () => {
            let actual =  await tokenContract.balanceOf.call(communityAddress);
            assert.equal(actual, communityTokens, 'communityTokens allocation balance is incorrect');
        });
    
        it('Should verify a presale allocation address', async () => {
            let actual = await tokenContract.presaleAddress.call();
            assert.equal(actual, presaleAddress, 'Presale allocation address is incorrect');
        });
    
        it('Should verify a presale allocation address balance', async () => {
            let actual = await tokenContract.balanceOf.call(presaleAddress);
            assert.equal(actual, presaleTokens,'Presale allocation address balance is incorrect');
        });
    
        it('Should verify the foundation reserve address', async () => {
            let actual = await tokenContract.gibraltarAddress.call();
            assert.equal(actual, gibraltarAddress, 'Foundation reserve address is incorrect');
        });
    
        it('Should verify the foundation reserve balance', async () => {
            let balance = await tokenContract.balanceOf.call(gibraltarAddress);
            assert.equal(balance, gibraltarTokens,'Foundation reserve balance is incorrect');
        });

        it('incorrect supplies should revert contract deployment', async () => {
            await expectRevert(Token.new)(100000000, 700000000, 100000000, communityAddress, presaleAddress, gibraltarAddress, distributorAddress, custodianAddress);
        })
    })

    describe('PausableToken', () => {
        beforeEach(async () => {
            if(await tokenContract.paused()){
                await tokenContract.unpause({from: custodianAddress});
            }
            assert.isFalse(await tokenContract.paused())
        })

        it('transferFrom credits and debits correct amounts from source and target accounts', async () => {
            await tokenContract.approve(presaleAddress, 10,  {from: communityAddress});
            const trx = await tokenContract.transferFrom.sendTransaction(communityAddress, custodianAddress, 10, {from: presaleAddress});
            assert.match(trx, /^0x([A-Fa-f0-9]{64})$/)
        });

        it('it completes approval with available spender balance', async () => {
            const approvalComplete = await tokenContract.approve.sendTransaction(custodianAddress, 10, {from: communityAddress});
            assert.match(approvalComplete, /^0x([A-Fa-f0-9]{64})$/)
        })

        it('it completes increaseApproval with available spender balance', async () => {
            const approvalComplete = await tokenContract.increaseApproval.sendTransaction(custodianAddress, 10, {from: communityAddress});
            assert.match(approvalComplete, /^0x([A-Fa-f0-9]{64})$/)
        })

        it('it completes decreaseApproval with available spender balance', async () => {
            const approvalComplete = await tokenContract.decreaseApproval.sendTransaction(custodianAddress, 10, {from: communityAddress});
            assert.match(approvalComplete, /^0x([A-Fa-f0-9]{64})$/)
        })
    })
});
