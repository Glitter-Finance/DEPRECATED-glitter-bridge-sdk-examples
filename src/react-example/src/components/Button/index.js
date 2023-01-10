import React from "react";
import styles from "./Button.module.scss";
import cx from "classnames";
import { Link } from "react-router-dom";

const Button = ({ className, isLink, to, onClick, children }) => {
  return isLink ? (
    <Link to={to}>
      <button className={cx(styles.Button, className)}>{children}</button>
    </Link>
  ) : (
    <button className={cx(styles.Button, className)} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
