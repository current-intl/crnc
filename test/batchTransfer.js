
'use strict';
const Token = artifacts.require('./CurrentToken.sol');
const BigNumber = require('./bignumber.js');
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

    describe('whenPaused', async () => {
        beforeEach( async () => {
            await tokenContract.pause({from: custodianAddress});
        });

        it('distributorAddress batchTransfer() exception whenPaused', async () => {
            const recipients = [investor, investor1];
            const amounts = [100000000000000000, 100000000000000000];
            await expectRevert(tokenContract.batchTransfer)(recipients, amounts, {from: distributorAddress});
        });

        it('distributorAddress batchTransferWhenPaused transfers whenPaused', async () => {
            const recipients = [investor, investor1];
            const amounts = [100000000000000000, 100000000000000000];
            await tokenContract.batchTransferWhenPaused(recipients, amounts, {from: distributorAddress});
            await verifyBalance(recipients[0], amounts[0]);
        });

        it('gibraltarAddress batchTransfer reverts whenPaused', async () => {
            const recipients = [investor, investor1];
            const amounts = [100000000000000000, 100000000000000000];
            await expectRevert(tokenContract.batchTransfer)(recipients, amounts, {from: gibraltarAddress});
        });

        it('gibraltarAddress batchTransferWhenPaused reverts whenPaused', async () => {
            const recipients = [investor, investor1];
            const amounts = [100000000000000000, 100000000000000000];
            await expectRevert(tokenContract.batchTransferWhenPaused)(recipients, amounts, {from: gibraltarAddress});
        });

        it('communityAddress batchTransfer reverts whenPaused', async () => {
            const recipients = [investor, investor1];
            const amounts = [100000000000000000, 100000000000000000];
            await expectRevert(tokenContract.batchTransfer)(recipients, amounts, {from: communityAddress});
        });

        it('communityAddress batchTransferWhenPaused transfers whenPaused', async () => {
            const recipients = [investor, investor1];
            const amounts = [1000000000, 10000000000];
            await tokenContract.batchTransferWhenPaused(recipients, amounts, {from: communityAddress});
            await verifyBalance(recipients[0], amounts[0]);
        });

        it('presaleAddress batchTransfer reverts whenPaused', async () => {
            const recipients = [investor, investor1];
            const amounts = [100000000000000000, 100000000000000000];
            await expectRevert(tokenContract.batchTransfer)(recipients, amounts, {from: presaleAddress});
        });

        it('presaleAddress batchTransferWhenPaused transfers whenPaused', async () => {
            const recipients = [investor, investor1];
            const amounts = [100000000000000000, 100000000000000000];
            await tokenContract.batchTransferWhenPaused(recipients, amounts, {from: presaleAddress});
            await verifyBalance(recipients[0], amounts[0]);
        });

        it('Token remains paused after a successful batch transfer', async () => {
            const recipients = [investor, investor1];
            const amounts = [100000000000000000, 100000000000000000];
            await tokenContract.batchTransferWhenPaused(recipients, amounts, {from: presaleAddress});
            await verifyBalance(recipients[0], amounts[0]);
            const isStillPaused = await tokenContract.paused();
            assert.equal(isStillPaused, true);
        });

        it('Token remains paused after a processing on guard failure attempt on batch transfer', async () => {
            try {
                const recipients = [investor, investor1];
                const amounts = [100000000000000000000000000, 100000000000000000000000000];
                await tokenContract.batchTransferWhenPaused(recipients, amounts, {from: presaleAddress});
                await verifyBalance(recipients[0], amounts[0]);
            } catch (err) {
                assert.exists(err);
            }
            const isStillPaused = await tokenContract.paused();
            assert.equal(isStillPaused, true);
        });

        it('Non-White-listed batchTransfer reverts whenPaused', async () => {
            const recipients = [investor, investor1];
            const amounts = [100000000000000000, 100000000000000000];
            await expectRevert(tokenContract.batchTransfer)(recipients, amounts, {from: negativeTestAccount});
        });

        it('Non-white-listed address batchTransferWhenPaused reverts whenPaused', async () => {
            const recipients = [investor, investor1];
            const amounts = [10000000, 10000000];
 
            await expectRevert(tokenContract.batchTransferWhenPaused, 'Non-whitelisted account successfully transferred tokens while contract was paused')(recipients, amounts, {from: negativeTestAccount});
        });

        
        it('batchTransferWhenPaused in excess of available balance reverts', async () => {
            const recipients = [investor, investor1];
            const distributorBalance = await tokenContract.balanceOf(distributorAddress);
            const tooLargeBalance = distributorBalance * 1.25;
            const amounts = [tooLargeBalance, tooLargeBalance];
            await expectRevert(tokenContract.batchTransferWhenPaused)(recipients, amounts, {from: distributorAddress});
        })

        it('batchTransferWhenPaused with non-matching array arguments reverts', async () => {
            const recipients = [investor, investor1];
            const amounts = [100000000000000000];
           await expectRevert(tokenContract.batchTransferWhenPaused)(recipients, amounts, {from: distributorAddress});
        })
    });

    describe('whenNotPaused', function() {
        beforeEach( async () => {
            let isPaused = await tokenContract.paused.call();
            if(isPaused){
                await tokenContract.unpause();
            }
        });

        it('batchTransferWhenPaused reverts whenNotPaused', async () => {
            const recipients = [investor, investor1];
            const amounts = [50000000, 50000000];
            await expectRevert(tokenContract.batchTransferWhenPaused)(recipients, amounts, {from: distributorAddress});
        });

        it('distributorAddress account can batchTransfer() whenNotPaused', async () => {
            const recipients = [investor, investor1];
            const amounts = [50000000, 50000000];
            await tokenContract.batchTransfer(recipients, amounts, {from: distributorAddress});
            
            for(let i = 0; i < recipients.length; i++) {
               await verifyBalance(recipients[i], amounts[i]);
            }
        });

        it('gibraltarAddress account can batchTransfer() whenNotPaused', async () => {
            const recipients = [investor, investor1];
            const amounts = [40000000, 4000000];
            await tokenContract.batchTransfer(recipients, amounts, {from: gibraltarAddress});

            for(let i = 0; i < recipients.length; i++) {
                await verifyBalance(recipients[i], amounts[i]);
             }
        });

        it('communityAddress account can batchTransfer() whenNotPaused', async () => {
            const recipients = [investor, investor1];
            const amounts = [30000, 60000];
            await tokenContract.batchTransfer(recipients, amounts, {from: communityAddress});

            for(let i = 0; i < recipients.length; i++) {
                await verifyBalance(recipients[i], amounts[i]);
             }
        });

        it('presaleAddress account can batchTransfer() whenNotPaused', async () => {
            const recipients = [investor, investor1];
            const amounts = [10000, 20000];
            await tokenContract.batchTransfer(recipients, amounts, {from: presaleAddress});

            for(let i = 0; i < recipients.length; i++) {
                await verifyBalance(recipients[i], amounts[i]);
             }
        });

        it('Non-white-list accounts can batchTransfer() whenNotPaused', async () => {
            await tokenContract.transfer(negativeTestAccount, 1000000000000, {from: gibraltarAddress} )
            const recipients = [investor, investor1];
            const amounts = [33333, 44444];
            await tokenContract.batchTransfer(recipients, amounts, {from: presaleAddress});

            for(let i = 0; i < recipients.length; i++) {
                await verifyBalance(recipients[i], amounts[i]);
             }
        });

        it('batchTransfer with non-matching array arguments reverts', async () => {
            const recipients = [investor, investor1];
            const amounts = [100000000000000000];
            await expectRevert(tokenContract.batchTransfer)(recipients, amounts, {from: distributorAddress});
        })

        it('batchTransfer in excess of senders available balance reverts', async () => {
            const recipients = [investor, investor1];
            const amounts = [100000000000000000, 100000000000000000000000000];
            await expectRevert(tokenContract.batchTransfer)(recipients, amounts, {from: distributorAddress});
        })
    });
});
