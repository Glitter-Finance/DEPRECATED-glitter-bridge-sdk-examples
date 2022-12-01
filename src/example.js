
const { GlitterBridgeSDK, BridgeNetworks, GlitterNetworks } = require('glitter-bridge-sdk-dev');
const path = require('path');
const util = require('util');

run()

async function run() {
    const result = await runMain();
    console.log(result);
}

async function runMain() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {

            //Load SDK
            const sdk = new GlitterBridgeSDK()
                .setEnvironment(GlitterNetworks.testnet)
                .connect([BridgeNetworks.algorand, BridgeNetworks.solana]);

            //Reference variables locally for ease of use
            const algorandAccounts = sdk.algorand?.accounts;
            const solanaAccounts = sdk.solana?.accounts;
            const algorand = sdk.algorand;
            const solana = sdk.solana;

            //Ensure SDK variables are loaded
            if (!algorandAccounts) throw new Error("Algorand Accounts not loaded");
            if (!solanaAccounts) throw new Error("Solana Accounts not loaded");
            if (!algorand) throw new Error("Algorand not loaded");
            if (!solana) throw new Error("Solana not loaded");

            //Create new algorand account
            console.log();
            console.log("============================ Creating New Algorand Account ============================");
            const newAlgoAccount = await algorandAccounts.createNew();
            console.log(util.inspect(newAlgoAccount, false, 5, true /* enable colors */));

            //Create new solana account
            console.log();
            console.log("============================ Creating New Solana Account ============================");
            const newSolanaAccount = await solanaAccounts.createNew();
            console.log(util.inspect(newSolanaAccount, false, 5, true /* enable colors */));

            //Get Algorand account balance
            // console.log("============================ Funding Algorand Account  ============================");
            // console.log("Here is the address of your account.  Click on the link to fund it with **10** testnet tokens.");
            // console.log(`https://testnet.algoexplorer.io/address/${newAlgoAccount.addr}`);
            // await algorand.waitForBalance(newAlgoAccount.addr, 6, 5 * 60, 0.001, true); //You need to send 6 or more testnet algos to the account 

            //Get Solana account balance
            console.log("============================ Funding Solana Account  ============================");
            console.log("Here is the address of your account.  Click on the link to fund it with **10** testnet tokens.");
            console.log(`https://solscan.io/account/${newSolanaAccount.addr}?cluster=testnet`);
            await solana.waitForBalance(newSolanaAccount.addr, 1, 5 * 60, 0.001, true); //You need to send 1 or more testnet sol to the account 


            // //Load Local Algorand Accounts    
            // let algoAccount = await algorandAccounts.add(process.env.DEV_ALGORAND_ACCOUNT_TEST);
            // algoAccount = await algorandAccounts.updateAccountDetails(algoAccount, true);
            // let solAccount = await solanaAccounts.add(process.env.DEV_SOLANA_ACCOUNT_TEST);
            // solAccount = await solanaAccounts.updateAccountDetails(solAccount, true);
            // if (!algoAccount || !solAccount) throw console.error("Failed to load accounts");

            // console.log(`============ Setup Algorand Wallet:  ${algoAccount?.addr} =================`)
            // console.log(`============ Setup Solana Wallet:  ${solAccount?.addr} =================`)

            // const algoBalance = await algorand.getBalance(algoAccount.addr);
            // const solBalance = await solana.getBalance(solAccount.addr);
            // console.log(`Algorand Balance: ${algoBalance}`);
            // console.log(`Solana Balance: ${solBalance}`);

            // const xSolBalance = await algorand.getTokenBalance(algoAccount.addr, "xSol");
            // const xAlgoBalance = await solana.getTokenBalance(solAccount.addr, "xAlgo");
            // console.log(`xSol Balance: ${xSolBalance}`);
            // console.log(`xAlgo Balance: ${xAlgoBalance}`);

            //const solBridge = sdk.solana.bridge(solAccount, "sol", "algorand", algoAccount.addr, "xSOL", 0.05);
            //const algoBridge = 



            //let x = await sdk.solana.bridge(solAccount, "xAlgo", "algorand", algoAccount.addr, "algo", 0.05);


            // //Check network health
            // const health = await sdk.algorand?.checkHealth();
            // console.log(`Algorand Health: ${util.inspect(health, false, 5, true /* enable colors */)}`);
            // const version = await sdk.algorand?.checkVersion();
            // console.log(`Algorand Version: ${util.inspect(version, false, 5, true /* enable colors */)}`);





            // //Fund Account
            // const fundResult = await sdk.solana?.fundAccount(solAccount, newSolAccount, 0.1);   
            // let balance = await sdk.solana?.waitForBalance(newSolAccount.addr, 0.1,60);
            // console.log(`Balance: ${balance}`);   

            // //Optin to xALGO
            // const optinResult = await sdk.solana?.optinToken(newSolAccount, "xALGO");           
            // balance = await sdk.solana?.waitForBalance(newSolAccount.addr, 0.09795572,60);
            // console.log(`Balance: ${balance}`);   

            // //Fund xALGO
            // const sendToken = await sdk.solana?.fundAccountTokens(solAccount, newSolAccount, 0.05, "xALGO");   
            // const tokenBalance = await sdk.solana?.waitForTokenBalance(newSolAccount.addr, "xALGO",0.05);
            // console.log(`Token Balance: ${tokenBalance}`);             

            // //Close Token Account
            // const closeTokenAccount = await sdk.solana?.closeOutTokenAccount( newSolAccount,solAccount, "xALGO");  

            // balance = await sdk.solana?.waitForBalance(newSolAccount.addr, 0.09794072,60);
            // console.log(`Balance: ${balance}`);   
            // const closeAccount = await sdk.solana?.closeOutAccount( newSolAccount, solAccount);


















            //const optin = await sdk.solana?.optinAsset(newSolAccount, "xALGO");

            //Close Accounts
            //const closeTokenAccount = await SolanaAccounts.closeOutAsset(newSolAccount, "xALGO", solAccount.addr);
            //const closeAccount = await SolanaAccounts.closeAccount(newSolAccount, solAccount.addr);

            // //Create new algorand account
            // const newAlgoAccount = await AlgorandAccounts.createNew();
            // console.log(util.inspect(newAlgoAccount, false, 5, true /* enable colors */));

            // //Fund Account
            // const fundResult = await AlgorandAccounts.fundAccount(algoAccount, newAlgoAccount, 6);
            // const optin = await AlgorandAccounts.optinAsset(newAlgoAccount, "xSOL");
            // const sendToken = await AlgorandAccounts.fundAccountToken(algoAccount, newAlgoAccount, 1, "xSOL");

            // try {
            //     //Bridge Algo
            //     const bridgeAlgo = await AlgorandAccounts.bridge(newAlgoAccount, "Algo", "Solana", solAccount.addr, "xAlgo", 5);
            //     const bridgexSOL = await AlgorandAccounts.bridge(newAlgoAccount, "xSOL", "Solana", solAccount.addr, "Sol", 0.05);

            // } catch (e) {
            //     console.log(e);
            // }

            // //Close New Account
            // const closeTokenAccount = await AlgorandAccounts.closeOutAsset(newAlgoAccount, "xSOL", algoAccount.addr);
            // const closeAccount = await AlgorandAccounts.closeAccount(newAlgoAccount, algoAccount.addr);

            resolve(true);

        } catch (error) {
            reject(error);
        }
    });

}