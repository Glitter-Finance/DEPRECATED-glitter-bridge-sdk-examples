import React, { useState } from "react";
import Button from "../../components/Button";
import styles from "./Solana.module.scss";
import {
  SolanaConnect,
  GlitterBridgeSDK,
  AlgorandWallet,
  SolanaWallet,
} from "glitter-bridge-sdk-dev";
import { BridgeMainnet } from "../../config";
import Input from "../../components/Input";

// Solana
// This is Solana Page Component
const Solana = () => {
  // useState
  const [address, setAddress] = useState("");
  const [wallet, setWallet] = useState(null);
  const [values, setValues] = useState({ from: "", to: "", amount: "" });

  // Connect Phantom Wallet
  const connectPhantomWallet = async () => {
    try {
      // Initialize Solana Wallet class
      const solana = new SolanaWallet();

      // Solana wallet on connect
      solana.on("connect", (publicKey, wallet) => {
        setWallet(wallet);
        setAddress(publicKey.toString());
      });

      // Connect solana wallet (phantom)
      // Specifying network will be hardcoded to all wallets apart from Phantom, but still requires network type
      // If phantom is connected you would manually switch networks in the wallet to sign transaction
      await solana.connectSolanaWallet("phantom", "mainnet");
    } catch (error) {
      // Console log error
      console.log("Error:", error);
    }
  };

  // Connect Solflare Wallet
  const connectSolflareWallet = async () => {
    try {
      // Initialize Solana Wallet class
      const solana = new SolanaWallet();

      // Solana wallet on connect
      solana.on("connect", (publicKey, wallet) => {
        setWallet(wallet);
        setAddress(publicKey.toString());
      });

      // This disconnect will only work for pop up browser wallets like Solflare
      solana.on("disconnect", () => {
        setWallet(null);
        setAddress("");
      });

      // Connect solana wallet (solflare - "devnet")
      // Specifying network will be hardcoded in the wallet
      await solana.connectSolanaWallet("solflare", "devnet");
    } catch (error) {
      // Console log error
      console.log("Error:", error);
    }
  };

  // Sign transaction Solana
  const signTransaction = async () => {
    try {
      const { solana } = new GlitterBridgeSDK()
        .setEnvironment("mainnet")
        .connect(["Algorand", "Solana"]);
      const txn = await solana.createUSDCBridgeTransferInstruction(
        { addr: "B2S2u5CfJA4wdmpeczZMoLvzXSABigmBvBqk3Lg1ZwKb" },
        "USDC",
        "algorand",
        "D5665XX4ITTYMVTVK4ECXD4MHTLXUR43WWOHA5EM5HIGMWSZQZDSTIYP4M",
        "USDC",
        2
      );
      console.log("bridge", txn);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Disconnect
  const disconnect = () => {
    setWallet(null);
    setAddress("");
  };

  // onChange
  const onChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  // Return
  return (
    <div className={styles.Solana}>
      <h1 className={styles.SolanaTitle}>Solana Wallet Example</h1>
      {address ? (
        <div className={styles.SolanaConnectedContainer}>
          <p className={styles.SolanaAddressHeader}>Connected:</p>
          <h1 className={styles.SolanaAddress}>{address}</h1>
          <Button onClick={disconnect} className={styles.SolanaDisconnect}>
            Disconnect
          </Button>
          <Input
            title={"Amount"}
            value={values.amount}
            onChange={onChange}
            name={"amount"}
            id={"amount"}
          />

          <Input
            title={"From"}
            value={values.from}
            onChange={onChange}
            name={"from"}
            id={"from"}
          />

          <Input
            title={"To"}
            value={values.to}
            onChange={onChange}
            name={"to"}
            id={"to"}
          />

          <Input title={"Coin"} value={"USDC"} name={"coin"} id={"from"} />
          <Button onClick={() => {}} className={styles.SolanaSignButton}>
            Sign Bridge Transaction (Mainnet)
          </Button>
        </div>
      ) : (
        <div className={styles.SolanaButtonContainer}>
          <Button
            onClick={connectPhantomWallet}
            className={styles.SolanaButton}
          >
            Connect Phantom Wallet
          </Button>
          <Button onClick={connectSolflareWallet}>
            Connect Solflare Wallet
          </Button>
        </div>
      )}
    </div>
  );
};

export default Solana;
