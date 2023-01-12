import React from "react";
import styles from "./Input.module.scss";

const Input = ({ title, value, onChange, name, id }) => {
  return (
    <div className={styles.Input}>
      <label className={styles.label} htmlFor={id}>
        {title}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className={styles.Input}
        id={id}
      />
    </div>
  );
};

export default Input;
