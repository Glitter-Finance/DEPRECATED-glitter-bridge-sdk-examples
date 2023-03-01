const { GlitterBridgeSDK, BridgeNetworks,GlitterEnvironment,Sleep } = require('glitter-bridge-sdk-dev');
const ethers = require('ethers')
const path = require('path');
const util = require('util');
const fs = require('fs');
const { resolve } = require('path');
run()

async function run() {
    const result = await runMain();
    console.log(result);
}



async function runMain() {


    return new Promise(async(resolve,reject) =>{
        try{

        //Load SDK
        const sdk = new GlitterBridgeSDK()
        .setEnvironment(GlitterEnvironment.mainnet)
        .connect([BridgeNetworks.algorand, BridgeNetworks.solana, BridgeNetworks.Ethereum]);
        //Reference variables locally for ease of use
        const algorandAccounts = sdk.algorand?.accounts;
        const solanaAccounts = sdk.solana?.accounts;
        const algorand = sdk.algorand;
        const solana = sdk.solana;
        const evm = sdk.ethereum;

        //Ensure SDK variables are loaded
        if (!algorandAccounts) throw new Error("Algorand Accounts not loaded");
        if (!solanaAccounts) throw new Error("Solana Accounts not loaded");
        if (!algorand) throw new Error("Algorand not loaded");
        if (!solana) throw new Error("Solana not loaded");
        if (!evm) throw new Error("Solana not loaded");
        // const solanaAccount = await getSolanaAccount(solanaAccounts);
        // console.log(`Solana Account: ${solanaAccount.addr}`);

        ///CREATE ETHEREUM WALLET 
        const wallet = await getEthAccount();
            
        /// OPT IN 
        // const result = await evm.bridge(BridgeNetworks.solana, "USDC", "25",solanaAccount.pk);
            


        }catch(e) {

        }
    })

}



async function getEthAccount() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async(resolve,reject) =>{
        try{

     //Check file path for saved config:
     const evmAccountFile = path.join(__dirname, 'local/evmAccount.txt');

     //Load account if exists in file
     if (fs.existsSync(evmAccountFile)) {
         //file exists
         const mnemonic = fs.readFileSync(evmAccountFile, 'utf8');

         if (mnemonic) {
             //Add to loaded accounts
             let solanaAccount = await solanaAccounts.add(mnemonic);
             resolve(solanaAccount);
             return;
         }
     }

        //Create new solana account
        console.log("Creating new EVM Account");
        const newEvmAccount =  ethers.Wallet
        console.log(util.inspect(newEvmAccount, false, 5, true /* enable colors */));

        let mnemonic = newEvmAccount.mnemonic.phrase;
        console.log("EVM Mnemonic: " + mnemonic);

        //Save solana account to file
        console.log("Saving EVM Account to file " + evmAccountFile);

        //Write account to file
        fs.writeFile(evmAccountFile, mnemonic, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing solana Object to File.");
                return console.log(err);
            }

            console.log("EVM file has been saved.");
        });

        resolve(newEvmAccount);
        }catch(e) {

        }
    })

}


