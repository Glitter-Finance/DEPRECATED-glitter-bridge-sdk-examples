import React from "react";
import Button from "../../components/Button";
import styles from "./Solana.module.scss";

// Solana
// This is Solana Page Component
const Solana = () => {
  // Connect Phantom Wallet
  const connectPhantomWallet = () => {
    console.log("phatom");
  };

  // Connect Solflare Wallet
  const connectSolflareWallet = () => {
    console.log("solflare");
  };

  // Return
  return (
    <div className={styles.Solana}>
      <h1 className={styles.SolanaTitle}>Solana Wallet Example</h1>
      <div className={styles.SolanaButtonContainer}>
        <Button onClick={connectPhantomWallet} className={styles.SolanaButton}>
          Connect Phantom Wallet
        </Button>
        <Button onClick={connectSolflareWallet}>Connect Solflare Wallet</Button>
      </div>
    </div>
  );
};

export default Solana;
