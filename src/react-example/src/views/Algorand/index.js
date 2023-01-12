import React, { useState } from "react";
import Button from "../../components/Button";
import styles from "./Algorand.module.scss";
import { AlgorandWallet } from "glitter-bridge-sdk-dev/dist";
import Input from "../../components/Input";

// Algorand
// This is Algorand Page Component
const Algorand = () => {
  // useState
  const [address, setAddress] = useState("");
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ from: "", to: "", amount: "" });

  // We need this type to see which wallet is connected
  // To disconnect pera wallet we need to use realtime disconnect function
  const [type, setType] = useState(null);

  // Connect Pera Wallet
  const connectPeraWallet = async () => {
    try {
      // Initialize Algorand Wallet
      const algorand = new AlgorandWallet();

      // On disconnect event
      algorand.on("disconnect", () => {
        // Set wallet null and address empty string if pera wallet disconnects
        setWallet(null);
        setAddress("");
        setType("");
      });

      // Wait for pera wallet to connect...
      const { address, wallet } = await algorand.connectPeraWallet();

      // Set wallet and address
      setWallet(wallet);
      setAddress(address);
      setType("perawallet");
    } catch (error) {
      // Console log error
      console.log("Error:", error);
    }
  };

  // Connect MyAlgo Wallet
  const connectMyAlgo = async () => {
    try {
      // Initialize Algorand Wallet
      const algo = new AlgorandWallet();
      // Connect myAlgo wallet
      const { address, wallet } = await algo.connectMyAlgo();

      // Set wallet, address and type
      setWallet(wallet);
      setAddress(address);
      setType("myAlgo");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    // If type is perawallet
    if (type === "perawallet") {
      try {
        // Initialize AlgorandWallet
        const pera = new AlgorandWallet();
        // Disconnect pera wallet
        // This will disconnect your pera wallet session from your browser
        await pera.disconnectPeraWallet();

        // Set wallet null, address empty string and type empty string
        setWallet(null);
        setAddress("");
        setType("");
      } catch (error) {
        // Console.log error
        console.log("Error:", error);
      }

      // Return
      return;
    }

    // Otherwise set wallet null, address empty string and type empty string
    setWallet(null);
    setAddress("");
    setType("");
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
    <div className={styles.Algorand}>
      <h1 className={styles.AlgorandTitle}>Algorand Wallet Example</h1>

      {address ? (
        <div className={styles.AlgorandConnectedContainer}>
          <p className={styles.AlgorandAddressHeader}>Connected:</p>
          <h1 className={styles.AlgorandAddress}>{address}</h1>
          <Button onClick={disconnect} className={styles.AlgorandDisconnect}>
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
          <Button onClick={() => {}} className={styles.AlgorandSignButton}>
            Sign Bridge Transaction (Mainnet)
          </Button>
        </div>
      ) : (
        <div className={styles.AlgorandContainer}>
          <div className={styles.AlgorandButtonContainer}>
            <Button
              className={styles.AlgorandButton}
              onClick={connectPeraWallet}
            >
              Connect Pera Wallet
            </Button>
            <Button onClick={connectMyAlgo}>Connect MyAlgo Wallet</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Algorand;
