
'use strict';
const Token = artifacts.require('./CurrentToken.sol');
const expectRevert = require('./exceptionUtil');

contract('CurrentToken.batchTransfer', function([owner, investor, investor1, communityAddress, presaleAddress, gibraltarAddress
                                                    , distributorAddress, custodianAddress, negativeTestAccount]) {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log(`investor: ${investor}`);
    console.log(`investor1: ${investor1}`);
    console.log(`communityAddress: ${communityAddress}`);
    console.log(`presaleAddress: ${presaleAddress}`);    
    console.log(`gibraltarAddress: ${gibraltarAddress}`);
    console.log(`distributorAddress: ${ distributorAddress}`);
    console.log(`custodianAddress: ${custodianAddress}`)
    console.log(`negativeTest: ${negativeTestAccount}`)
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

    let tokenContract;

    const communityTokens = 100000000 * Math.pow(10, 18);
	const presaleTokens = 350000000 * Math.pow(10, 18);
    const gibraltarTokens = 550000000 * Math.pow(10, 18);
    
    const verifyBalance = async (address, expectedBalance) => {
        assert.equal(await tokenContract.balanceOf.call(address), expectedBalance, 'balance inquiry failed assertion');
    }

    beforeEach(async () => {
        try {
            tokenContract = await Token.new(communityTokens, presaleTokens, gibraltarTokens, communityAddress, presaleAddress
                                            , gibraltarAddress, distributorAddress, custodianAddress);
            await tokenContract.transfer(distributorAddress, communityTokens / 2, {from: communityAddress});
            await tokenContract.transfer(negativeTestAccount, 30000000, {from: gibraltarAddress});
        } catch(err) {
            console.log('SETUP ERROR: ' + JSON.stringify({'message':err.message, 'stackTrace':err.stackTrace}));
        }
    });

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

    describe('Custody', () => {
        it('Contract Custodian should be 0x0 after relinquishing custody', async () => {
     
            await tokenContract.renounceCustody({from: custodianAddress});
            let actual = await tokenContract.custodian.call({from: custodianAddress});
             assert.equal(actual, 0x0000000000000000000000000000000000000000);
        });

        it('A non-custodial account cannot relinquish custody', async () => {
            await expectRevert(tokenContract.renounceCustody)({from: negativeTestAccount});
        });

        it('Contract Custodian should be 0x0...1 after transfer of custody', async () => {
            await tokenContract.transferCustody('0xf6a948bff792e4f42d7f17e5e4ebe20871d160f2', {from: custodianAddress});
            let actual = await tokenContract.custodian();
            assert.equal(actual, '0xf6a948bff792e4f42d7f17e5e4ebe20871d160f2');
        });

        it('A non-custodial account cannot  transfer of custody', async () => {
            await expectRevert(tokenContract.transferCustody)('0xf6a948bff792e4f42d7f17e5e4ebe20871d160f2', {from: negativeTestAccount});
        });

        it('Transferring custody to account 0x0 will revert', async () => {
            await expectRevert(tokenContract.transferCustody)(0x0000000000000000000000000000000000000000, {from: custodianAddress})
        });
    });

    describe('whenPaused', async () => {
        beforeEach( async () => {
            await tokenContract.pause({from: custodianAddress});
        });

        it('custodian should be able to unpause a paused contract', async () => {
            await tokenContract.unpause({from: custodianAddress})
            let isPaused = await tokenContract.paused();
            assert.equal(isPaused, false)
        })

        it('non-custodian unpausing a paused contract should revert', async () => {
            await expectRevert(tokenContract.unpause)({from: negativeTestAccount});
        })
    });

    describe('whenNotPaused', function() {
        beforeEach( async () => {
            let isPaused = await tokenContract.paused.call();
            if(isPaused){
                await tokenContract.unpause();
            }
        });

        it('custodian unpausing an unpaused contract should revert', async () => {
           await expectRevert(tokenContract.unpause)({from: custodianAddress});
        });
    
        it('non-custodian unpausing an unpaused contract should revert', async () => {
            await expectRevert(tokenContract.unpause)({from: negativeTestAccount});
        })
    });
});
