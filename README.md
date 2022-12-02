# glitter-bridge-sdk-examples
This repo will go over some examples of how to use the Glitter Bridge SDK.  New examples will be posted as functionality is added, so please continue to check for updates periodically.

Any issues, please create a post on the [issues](https://github.com/Glitter-Finance/glitter-bridge-sdk-examples/issues) page.

# Setup
The sdk is written in typescript, but compiled to JS and added to this repo using npm packages.  

## Ensure Node is installed

first, make sure you have node installed. 

To see if you already have Node.js and npm installed and check the installed version, run the following commands in your terminal:

```
node -v
npm -v
```

If you do not have node installed, follow the installation process here:  
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

## Download project and packages
Once node is installed, download and open this project in your editor of choice.  VScode is preferred.  Once open, run this command in your editor's terminal.  This will download all the node packages

```
npm i
```

## Run Example

Once the packages are up to date and node is installed, you can just run the following command in your editor's terminal 

```
node src/example.js
```

This will compile and run the example.js file in the source directory.  

### Funding wallets
The first time the example is run, a new wallet for algorand and solana is created and saved in the src/local folder.  You will need to fund these with testnet tokens in order for the bridged examples to work. 

You can follow the directions in ther console, which shows links to both of your new accounts, as well as links to the testnet faucets.
