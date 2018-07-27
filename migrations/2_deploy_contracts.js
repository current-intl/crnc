let Token = artifacts.require("./CurrentToken.sol");

module.exports = function(deployer, network, accounts) {
	const communityTokens = 100000000 * Math.pow(10, 18);
	const presaleTokens = 350000000 * Math.pow(10, 18);
	const gibraltarTokens = 550000000 * Math.pow(10, 18);

	const communityAddress = accounts[0]; // TODO: replace this on mainnet
	const presaleAddress = '0x2acb2fe21209aaf7e29fbb32cd0c80dadb116f9c';
	const gibraltarAddress = '0x1dca0155060ef9c34b1c8bc1bdde747fa2bca0eb';
	const distributorAddress = '0x978cc863F949e31f8cCC9BD544683bfA5f98d09c';

	deployer.deploy(
		Token, communityTokens, presaleTokens, gibraltarTokens, communityAddress, presaleAddress, gibraltarAddress, distributorAddress
	).catch(console.log);
};
