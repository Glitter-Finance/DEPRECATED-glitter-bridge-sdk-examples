const { GlitterBridgeSDK, BridgeNetworks,GlitterEnvironment,Sleep } = require('glitter-bridge-sdk-dev');
const ethers = require('ethers')
const path = require('path');
const util = require('util');
const fs = require('fs');
run()

async function run() {
    const result = await runMain();
    console.log(result);
}

async function runMain() {

 return new Promise(async (resolve, reject) => {
      try {
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
   
console.log("s",evmAccounts)
   //Ensure SDK variables are loaded
   if (!algorandAccounts) throw new Error("Algorand Accounts not loaded");
   if (!solanaAccounts) throw new Error("Solana Accounts not loaded");
   if (!algorand) throw new Error("Algorand not loaded");
   if (!solana) throw new Error("Solana not loaded");

   //load/create new algorand account
   console.log();
   console.log("==== Loading/Creating New Algorand Account ============");
   const algorandAccount = await getAlgorandAccount(algorandAccounts);
   if (!algorandAccount) {
    throw new Error("algorand account not defines")
   }
   console.log(`Algorand Account: ${algorandAccount.addr}`);
   
   //load Create new solana account
   console.log();
   console.log("==== Creating New Solana Account ============");
   const solanaAccount = await getSolanaAccount(solanaAccounts);
   console.log(`Solana Account: ${solanaAccount.addr}`);

   //fund Algorand account
   console.log();
   console.log("==== Funding Algorand Account  ============");
   console.log("Here is the address of your account.  Click on the link to fund it with **6** or more testnet tokens.");
   console.log(`https://testnet.algoexplorer.io/address/${algorandAccount.addr}`);
   console.log();
   console.log("Dispenser");
   console.log(`https://testnet.algoexplorer.io/dispenser}`);
   console.log();
   console.log(`Address: ${algorandAccount.addr}`);
   await algorand.waitForMinBalance(algorandAccount.addr, 6, 5 * 60); //You need to send 6 or more testnet algos to the account 
   console.log();
   const algorandBalance = await algorand.getBalance(algorandAccount.addr);
   console.log(`Algorand Balance: ${algorandBalance}`);

   //fund Solana account
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
   Sleep(10000)
   const solanaBalance = await solana.getBalance(solanaAccount.addr);
   console.log(`Solana Balance: ${solanaBalance}`);

   //Opt in to xSOL
   console.log("\n");
   console.log("==========================Opting Algorand Account In to xSOL========================");
   let startingBalance = await algorand.getBalance(algorandAccount.addr);
   await algorand.optinToken(algorandAccount, "xSOL");
   await algorand.waitForBalanceChange(algorandAccount.addr, startingBalance); //Wait for balance to change
   console.log();
   console.log("Opted in to xSOL");

   //Opt in to xALGO
   console.log();
   console.log("==== Opting Solana Account In to xALGO  ============");
   startingBalance = await solana.getBalance(solanaAccount.addr);
   await solana.optinToken(solanaAccount, "xALGO");


   //Check if the account exists - if not, wait for the RPC to confirm txn
   if (!(await solana.optinAccountExists(solanaAccount, "xALGO"))) {
       await solana.waitForBalanceChange(solanaAccount.addr, startingBalance); //Wait for balance to change
   }
      console.log("Opted in to xALGO");

      console.log("\n");
      console.log("===========================Opting USDC To Algorand=======================");
      startingBalance = await algorand.getBalance(algorandAccount.addr);
      await algorand.optinToken(algorandAccount , "USDC");
      await algorand.waitForBalanceChange(
        algorandAccount.addr,
        startingBalance
      ); 
      //Wait for balance to change
      console.log();
      console.log("Opted algorand account to USDC");

      //Opt in to USDC
      console.log("\n");
      console.log("=========================Opting Solana Account In to USDC ========================");
      startingBalance = await solana.getBalance(solanaAccount.addr);
      await solana.optinToken(solanaAccount, "USDC");
      if (!(await solana.optinAccountExists(solanaAccount, "USDC"))) {
        await solana.waitForBalanceChange(solanaAccount.addr, startingBalance); //Wait for balance to change
      }

     console.log("Opted solana account to  USDC to");

     console.log("\n");
      
      /**
       * from: Source address
       * fromToken:"USDC"
       * to: Destination address
       * toNetwork: 
       * toAddress
       * toToken:"USDC"
       * amountToSwap:number
       * returns : Transaction 
       */
      const txn = await solana.bridge(
        solanaAccount,
        "USDC",
        "algorand",
        algorandAccount.addr,
        "USDC",
        1
      );
      if (!txn) {
        throw new Error("Txn Failed");
      }
    
    
     console.log("\n");
     console.log("==================Solana To Algorand USDC Swap Successful==================");
     if (!algorandAccount) throw new Error("Algorand Client not defined");

    //wait for 60 sec 
    await Sleep(60000);

    /**
     * from: Source address
     * fromToken:"USDC"
     * to: Destination address
     * toNetwork: 
     * toAddress
     * toToken:"USDC"
     * amountToSwap:number
     * returns : Transaction 
     */
    const txnA = await algorand.bridge(
    algorandAccount,
    "USDC",
    "solana",
    solanaAccount.addr,
    "USDC",
    1
    );

    if (!txnA) {
    throw new Error("Txn Failed");
    }  

    // Send usdc to SolanaAccount from AlgorandAccount
    if (!txnA) {
    throw new Error("Txn Failed");
    }

    console.log("\n");
    console.log("===========================Algo to solana Usdc Swap Successful===================");

    resolve(true);

} catch (err) {
        reject(err);
      }
    });
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
        const newEvmAccount =  ethers.Wallet.createRandom()
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


