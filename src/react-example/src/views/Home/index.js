import React from "react";
import Button from "../../components/Button";
import styles from "./Home.module.scss";

const Home = () => {
  const chains = ["Solana", "Algorand"];

  return (
    <div className={styles.HomeBody}>
      <h1 className={styles.HomeTitle}>
        Glitter Finance SDK Wallet Connection Tutorial
      </h1>
      <p className={styles.HomeParagraph}>
        Connect and sign transactions with your wallet by one function using
        Glitter SDK library
      </p>

      <div className={styles.HomeButtonContainer}>
        {chains.map((chain) => (
          <Button
            isLink
            to={chain.toLowerCase()}
            key={chain.toLowerCase()}
            className={
              chain.toLowerCase() !== "algorand" ? styles.HomeButton : ""
            }
          >
            {chain}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Home;
