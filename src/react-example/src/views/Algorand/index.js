import React from "react";
import Button from "../../components/Button";
import styles from "./Algorand.module.scss";

// Algorand
// This is Algorand Page Component
const Algorand = () => {
  // Connect Pera Wallet
  const connectPeraWallet = () => {
    console.log("yes");
  };

  // Connect MyAlgo Wallet
  const connectMyAlgo = () => {
    console.log("myAlgo");
  };

  // Return
  return (
    <div className={styles.Algorand}>
      <h1 className={styles.AlgorandTitle}>Algorand Wallet Example</h1>
      <div className={styles.AlgorandButtonContainer}>
        <Button className={styles.AlgorandButton} onClick={connectPeraWallet}>
          Connect Pera Wallet
        </Button>
        <Button onClick={connectMyAlgo}>Connect MyAlgo Wallet</Button>
      </div>
    </div>
  );
};

export default Algorand;
