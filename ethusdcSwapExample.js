const ethWallet = require('ethereumjs-wallet').default;
const ethers = require('ethers')

main();
function main() {
    const wallet = ethers.Wallet.createRandom()
	
    console.log('address:', wallet.address)
    console.log('mnemonic:', wallet.mnemonic.phrase)
    console.log('privateKey:', wallet.privateKey)
} 

