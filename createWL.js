require('dotenv').config()
const fs = require('fs');
const AL = require("./ContractData/AL/WL.json")
const ALaddresses = AL.wallets;
// var contract_address = process.env.DEV_CONTRACT_ADDRESS;
var contract_address = process.env.PROD_CONTRACT_ADDRESS;
const signer = web3.eth.accounts.wallet.add(process.env.DEV_WALLET_1_PRIVKEY);

module.exports = async function() {
    let signedAL=[];
    web3.utils.toChecksumAddress(signer.address)
    for(i=0; i < ALaddresses.length ;i ++){
        console.log(i)
        web3.utils.toChecksumAddress(ALaddresses[i].address)
        let signedMessage = await web3.eth.accounts.sign(web3.utils.soliditySha3(ALaddresses[i].address, contract_address, true, true, ALaddresses[i].maxQuantity, ALaddresses[i].isReservedMint), signer.privateKey)
        signedAL.push({[ALaddresses[i].address]: signedMessage})
    }
    let data = JSON.stringify(signedAL)
    fs.writeFileSync('./client/src/AL/signedList.json', data);
    fs.copyFile("./ContractData/AL/WL.json", './client/src/AL/unsignedList.json', (err) => {
        if (err) throw err;
        console.log('File was copied to destination');
      });
}

