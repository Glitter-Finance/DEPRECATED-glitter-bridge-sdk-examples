const { GlitterBridgeSDK, BridgeNetworks,GlitterEnvironment,Sleep,BridgeTokens } = require('glitter-bridge-sdk-dev');
const path = require('path');
const util = require('util');
const fs = require('fs');
const {Keypair, sendAndConfirmTransaction} = require('@solana/web3.js')
run()

async function run() {
    const result = await runMain();
    console.log(result);
}

async function runMain() {

    return new Promise(async (resolve, reject) => {
        try {
            const sdk = new GlitterBridgeSDK()
                .setEnvironment(GlitterEnvironment.mainnet)
                .connect([BridgeNetworks.algorand, BridgeNetworks.solana]);

            const algorandAccounts = sdk.algorand?.accounts;
            const solanaAccounts = sdk.solana?.accounts;
            const algorand = sdk.algorand;
            const solana = sdk.solana;

            if (!algorandAccounts) throw new Error("Algorand Accounts not loaded");
            if (!solanaAccounts) throw new Error("Solana Accounts not loaded");
            if (!algorand) throw new Error("Algorand not loaded");
            if (!solana) throw new Error("Solana not loaded");
            //load/create new algorand account

            console.log();
            console.log("==== Loading/Creating New Algorand Account ============");
            const algorandAccount = await getAlgorandAccount(algorandAccounts);
            console.log(`Algorand Account: ${algorandAccount?.addr}`);

            //load Create new solana account
            console.log();
            console.log("==== Creating New Solana Account ============");
            const solanaAccount = await getSolanaAccount(solanaAccounts);
            console.log(`Solana Account: ${solanaAccount.addr}`);

            // fund Algorand account

            if (!algorandAccount){
                throw new Error("algorand account does not exist")
            }
            console.log();
            console.log("==== Funding Algorand Account  ============");
            console.log("Here is the address of your account.  Click on the link to fund it with **6** or more testnet tokens.");
            console.log(`https://testnet.algoexplorer.io/address/${algorandAccount?.addr}`);
            console.log();
            console.log("Dispenser");
            console.log(`https://testnet.algoexplorer.io/dispenser}`);
            console.log();
            console.log(`Address: ${algorandAccount?.addr}`);
            await algorand.waitForMinBalance(algorandAccount?.addr ?? "", 6, 5 * 60); //You need to send 6 or more testnet algos to the account 
            console.log();
            const algorandBalance = await algorand.getBalance(algorandAccount.addr );

            console.log(`Algorand Balance: ${algorandBalance}`);

            // fund Solana account
            console.log();
            console.log("==== Funding Solana Account  ============");
            console.log("Here is the address of your account.  Click on the link to fund it with **10** testnet tokens.");
            console.log(`https://explorer.solana.com/address/${solanaAccount.addr}?cluster=testnet`);
            console.log();
            console.log("Dispenser");
            console.log(`https://solfaucet.com/}`);
            console.log(`Address: ${solanaAccount.addr}`);
            await solana.waitForMinBalance(solanaAccount.addr, 1, 5 * 60); //You need to send 1 or more testnet sol to the account 
            console.log();
            const solanaBalance = await solana.getBalance(solanaAccount.addr);
            console.log(`Solana Balance: ${solanaBalance}`);

            console.log("====  ALGOUSDC added ============");

            const token = BridgeTokens.get("algorand", "USDC");
            if (!token) throw new Error("Token not found on algo");

            const tokenS = BridgeTokens.get("solana", "USDC");
            if (!tokenS) throw new Error("Token not found on solana ");

            console.log();
            console.log("====  Opting USDC To Algorand  ============");
            let startingBalance = await algorand.getBalance(algorandAccount.addr );
            await algorand.optinToken(algorandAccount, "USDC");
            await algorand.waitForBalanceChange(algorandAccount.addr, startingBalance); //Wait for balance to change
            console.log();
            console.log("Opted  USDC to Algorand");

            //Opt in to USDC
            console.log();
            console.log("==== Opting USDC to solana ============");
            startingBalance = await solana.getBalance(solanaAccount.addr);
            await solana.optinToken(solanaAccount, "USDC");
             if (!(await solana.optinAccountExists(solanaAccount, "USDC"))) {
                
                   await solana.waitForBalanceChange(solanaAccount.addr, startingBalance); //Wait for balance to change
                }
                
            console.log("Opted  USDC to solana");

            console.log();
            startingBalance = await algorand.getBalance(algorandAccount.addr);

            if (!algorandAccount) {
                 throw new Error("algo account does not exist ")
            }
            
            // Send usdc to AlgorandAccount from SolanaAccount
            const txn =  await solana.createUSDCBridgeTransferInstruction(solanaAccount, "USDC", "algorand", algorandAccount.addr, "USDC", 1.1);
            if (!txn) {
                throw  new Error("Txn Failed")
            }

            // const connection = new Connection(clusterApiUrl("mainnet-beta", true), "confirmed");
            const fromWallet = Keypair.fromSecretKey(solanaAccount.sk);

            const txn_signature= await  sendAndConfirmTransaction(
                solana.client,
                txn,
                [fromWallet],
                   
            );
                
            console.log("Solana To Algorand USDC Swap Successful") 
            

            console.log("Transaction Signature on Solana", txn_signature)

            
            //wait for 60 sec
            await Sleep(60000)            

            // Send usdc to SolanaAccount from AlgorandAccount
            const txnA = await algorand.createUSDCBridgeTransfer(algorandAccount,"USDC","solana",solanaAccount.addr,"USDC",1);

            if (!txnA) {
                throw new Error("Txn Failed")
            }

            await algorand.signAndSend_SingleSigner(txnA, algorandAccount);


            console.log(" Algo to Solana USDC Swap Successful");
                    

            resolve(true)

        } catch (err) {
            reject(err)
        }
    })

}



async function getAlgorandAccount(algorandAccounts) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {

            //Check file path for saved config:
            const algoAccountFile = path.join(__dirname, 'local/algoAccount.txt');

            //Load account if exists in file
            if (fs.existsSync(algoAccountFile)) {
                //file exists
                const mnemonic = fs.readFileSync(algoAccountFile, 'utf8');

                if (mnemonic) {
                    //Add to loaded accounts
                    let algoAccount = await algorandAccounts.add(mnemonic);
                    resolve(algoAccount);
                    return;
                }
            }

            //Create new algorand account
            console.log("Creating new Algorand Account");
            const newAlgoAccount = await algorandAccounts.createNew();
            console.log(util.inspect(newAlgoAccount, false, 5, true /* enable colors */));

            //Get mnemonic
            const mnemonic = algorandAccounts.getMnemonic(newAlgoAccount);
            console.log("Algorand Mnemonic: " + mnemonic);

            //Save algorand account to file
            console.log("Saving Algorand Account to file " + algoAccountFile);

            //Write account to file
            fs.writeFile(algoAccountFile, mnemonic, 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing algorand Object to File.");
                    return console.log(err);
                }

                console.log("algorand file has been saved.");
            });

            resolve(newAlgoAccount);

        } catch (error) {
            reject(error);
        }
    });

}


async function getSolanaAccount(solanaAccounts) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {

            //Check file path for saved config:
            const solanaAccountFile = path.join(__dirname, 'local/solanaAccount.txt');

            //Load account if exists in file
            if (fs.existsSync(solanaAccountFile)) {
                //file exists
                const mnemonic = fs.readFileSync(solanaAccountFile, 'utf8');

                if (mnemonic) {
                    //Add to loaded accounts
                    let solanaAccount = await solanaAccounts.add(mnemonic);
                    resolve(solanaAccount);
                    return;
                }
            }

            //Create new solana account
            console.log("Creating new Solana Account");
            const newSolanaAccount = await solanaAccounts.createNew();
            console.log(util.inspect(newSolanaAccount, false, 5, true /* enable colors */));

            let mnemonic = newSolanaAccount.mnemonic;
            console.log("Solana Mnemonic: " + mnemonic);

            //Save solana account to file
            console.log("Saving Solana Account to file " + solanaAccountFile);

            //Write account to file
            fs.writeFile(solanaAccountFile, mnemonic, 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing solana Object to File.");
                    return console.log(err);
                }

                console.log("Solana file has been saved.");
            });

            resolve(newSolanaAccount);

        } catch (error) {
            reject(error);
        }
    });

}
