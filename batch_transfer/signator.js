/* jslint es6 */
'use strict';
const Web3 = require('web3');
//TODO: Change this to Infura
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
const web3 = new Web3(provider);
const Transaction = require('ethereumjs-tx');
const AWS = require('aws-sdk');
const ssm = new AWS.SSM({apiVersion: '2014-11-06', region:'us-west-2'});


module.exports = async () => {
    let param = {
        Name: process.env.KEY,
        WithDecryption: true
    };

    let secureStorage = await ssm.getParameter(param).promise().catch((err) => {console.log(err)});
    let tx = new Transaction(null, 1);

    let signingKey = new Buffer(secureStorage.Parameter.Value, 'hex')

    tx.nonce = web3.eth.getTransactionCount("0xf02C92B747E0c9B61f2e4cD9C3becF4F0Ba70970");
    tx.gasPrice = 10000000000; // Check ethgasstation to get the latest price
    tx.gas = 5000000;
    tx.value = 0;
    tx.data = '0x7722f1d7000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000006c000000000000000000000000000000000000000000000000000000000000000330000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27e80000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27e90000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27ea0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27eb0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27ec0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27ed0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27ee0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27ef0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27f00000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27f10000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27f20000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27f30000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27f40000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27f50000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27f60000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27f70000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27f80000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27f90000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27fa0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27fb0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27fc0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27fd0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27fe0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe27ff0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28000000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28010000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28020000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28030000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28040000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28050000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28060000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28070000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28080000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28090000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe280a0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe280b0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe280c0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe280d0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe280e0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe280f0000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28100000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28110000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28120000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28130000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28140000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28150000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28160000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28170000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28180000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe28190000000000000000000000002127edab5d08b1e11adf7ae4bae16c2b33fe281a00000000000000000000000000000000000000000000000000000000000000330000000000000000000000000000000000000000000000000000000000000190000000000000000000000000000000000000000000000000000000000000001900000000000000000000000000000000000000000000000000000000000001900000000000000000000000000000000000000000000000000000000000000190000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000c8000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000190000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000000c800000000000000000000000000000000000000000000000000000000000000c800000000000000000000000000000000000000000000000000000000000000c8000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000001900000000000000000000000000000000000000000000000000000000000000190000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000001900000000000000000000000000000000000000000000000000000000000001900000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000c8000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000001900000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000190000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000190000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000190';
    tx.to = '0xb8af41e5fc7790e43fae9877d620c2886be269e4'; // Must be set to deployed CRNC contract address

    // This is the privateKey of the Distributor, pulled from MetaMask. Becomes the "from" address aka msg.sender
}





(async function(){
    try{
        let x = await loadTokenAbi();

        console.log(x)
    }catch(err) {
        console.log(err.message)
    }
 
})();
