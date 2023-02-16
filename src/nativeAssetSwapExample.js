const { GlitterBridgeSDK, BridgeNetworks,GlitterEnvironment,Sleep } = require('glitter-bridge-sdk-dev');
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
   const solanaBalance = await solana.getBalance(solanaAccount.addr);
   console.log(`Solana Balance: ${solanaBalance}`);

   //Opt in to xSOL
   console.log();
   console.log("==== Opting Algorand Account In to xSOL  ============");
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
    
   Sleep(40000);
   console.log();
   console.log("==== Bridging ALGO to xALGO  ============");
   startingBalance = await solana.getTokenBalance(solanaAccount.addr, "xALGO");
   const bridge_transaction_algo_a =  await algorand.bridgeTransaction(algorandAccount.addr, "algo", "solana", solanaAccount.addr, "xalgo", 5.5);
   if(! bridge_transaction_algo_a){
     throw new Error("bridge_transaction_algo_a failed ")
   }
   const usdc_bridge_txn_algo_a_res = await algorand.signAndSend_SingleSigner(bridge_transaction_algo_a,algorandAccount);
   
   await solana.waitForTokenBalanceChange(solanaAccount.addr, "xAlgo", startingBalance,90);
   console.log();
   console.log("Bridged ALGO to xALGO");
   console.log(" Algo to Solana Bridge transactions  Successful");
   //Bridge xALGO to Algo
   console.log();
   console.log("=================xALGO to ALGO SUCCESSFULL============");
   startingBalance = await algorand.getBalance(algorandAccount.addr);
   const bridge_txn_sol_a =   await solana.bridgeTransactions(solanaAccount.addr, "xalgo", "algorand", algorandAccount.addr, "algo", 5);
   if(!bridge_txn_sol_a){
     throw new Error("bridge_txn_sol_a failed")
   }
   const bridge_txn_sol_a_hash = await solana.sendAndConfirmTransaction(bridge_txn_sol_a,solanaAccount);
   if (!bridge_txn_sol_a_hash) {
    console.log("usdc bridge transaction failed")
   }else {
    console.log(`   ✅ - Transaction sent to network ${bridge_txn_sol_a_hash}`);

   }

   await algorand.waitForBalanceChange(algorandAccount.addr, startingBalance,90);
   console.log();
   console.log("================xALGO to ALGO SWAP SUCCESSFULL=================");

   await Sleep(30000);

    //Bridge SOL to xSOL
    console.log();
    console.log("===============Bridging SOL to xSOL============");
    startingBalance = await algorand.getTokenBalance(algorandAccount.addr, "xSOL");
    console.log("Starting Balance: ", startingBalance);
    const bridge_txn_sol_b = await solana.bridgeTransactions(solanaAccount.addr, "sol", "algorand", algorandAccount.addr, "xsol", 0.1);
    if(!bridge_txn_sol_b){
     throw new Error("bridge_txn_sol_b failed")
   }
   const bridge_txn_sol_b_hash = await solana.sendAndConfirmTransaction(bridge_txn_sol_b,solanaAccount);
   if (!bridge_txn_sol_b_hash) {
    console.log(" bridge transaction failed")
   }else {
    console.log(`   ✅ - Transaction sent to network ${bridge_txn_sol_b_hash}`);

   }
    await algorand.waitForTokenBalanceChange(algorandAccount.addr, "xSOL", startingBalance,90);
    console.log();
    console.log("==============SOL TO XSOL SWAP SUCCESSFULL===========");

    await Sleep(30000);

    //Bridge xSOL to SOL
    console.log();
    console.log("=================Bridging xSOL to SOL============");
    startingBalance = await solana.getBalance(solanaAccount.addr);
    const bridge_transaction_algo_b =  await algorand.bridgeTransaction(algorandAccount.addr, "xsol", "solana", solanaAccount.addr, "sol", 0.09);
    if(! bridge_transaction_algo_b){
     throw new Error("bridge_transaction_algo_a failed ")
   }
    const usdc_bridge_txn_algo_b_res = await algorand.signAndSend_SingleSigner(bridge_transaction_algo_b,algorandAccount);
    await solana.waitForBalanceChange(solanaAccount.addr, startingBalance,90);
    console.log();
    console.log("===============xSOL to SOL SWAP SUCCESSFULL===============");

    resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
 
  async function getAlgorandAccount(
    algorandAccounts
  ) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        //Check file path for saved config:
        const algoAccountFile = path.join(__dirname, "local/algoAccount.txt");
  
        //Load account if exists in file
        if (fs.existsSync(algoAccountFile)) {
          //file exists
          const mnemonic = fs.readFileSync(algoAccountFile, "utf8");
  
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
        console.log(
          util.inspect(newAlgoAccount, false, 5, true /* enable colors */)
        );
  
        //Get mnemonic
        const mnemonic = algorandAccounts.getMnemonic(newAlgoAccount);
        console.log("Algorand Mnemonic: " + mnemonic);
  
        //Save algorand account to file
        console.log("Saving Algorand Account to file " + algoAccountFile);
  
        var getDirName = require('path').dirname;
  
        fs.mkdir(getDirName(algoAccountFile), { recursive: true }, function (err) {
          if (err) {
            console.log(
              "An error occured while writing algorand Object to File."
            );
            return console.log(err);
          } else {
  
            //Write account to file
            fs.writeFile(algoAccountFile, mnemonic, "utf8", function (err) {
              if (err) {
                console.log(
                  "An error occured while writing algorand Object to File."
                );
                return console.log(err);
              }
  
              console.log("algorand file has been saved.");
            });
          }
        });
  
        resolve(newAlgoAccount);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async function getSolanaAccount(
    solanaAccounts
  ) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        //Check file path for saved config:
        const solanaAccountFile = path.join(__dirname, "local/solanaAccount.txt");
  
        //Load account if exists in file
        if (fs.existsSync(solanaAccountFile)) {
          //file exists
          const mnemonic = fs.readFileSync(solanaAccountFile, "utf8");
  
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
        console.log(
          util.inspect(newSolanaAccount, false, 5, true /* enable colors */)
        );
  
        let mnemonic = newSolanaAccount.mnemonic;
        console.log("Solana Mnemonic: " + mnemonic);
  
        //Save solana account to file
        console.log("Saving Solana Account to file " + solanaAccountFile);
  
        var getDirName = require('path').dirname;
        fs.mkdir(getDirName(solanaAccountFile), { recursive: true }, function (err) {
          if (err) {
            console.log(
              "An error occured while writing algorand Object to File."
            );
            return console.log(err);
          } else {
  
            //Write account to file
            fs.writeFile(solanaAccountFile, mnemonic, "utf8", function (err) {
              if (err) {
                console.log("An error occured while writing solana Object to File.");
                return console.log(err);
              }
  
              console.log("Solana file has been saved.");
            });
          }
        });
  
        resolve(newSolanaAccount);
      } catch (error) {
        reject(error);
      }
    });
  }
  