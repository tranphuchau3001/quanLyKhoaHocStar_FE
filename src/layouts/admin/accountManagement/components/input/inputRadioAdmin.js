import { useState } from "react";
import styles from "./InputAdmin.module.css";

// eslint-disable-next-line react/prop-types
const InputRadioAdmin = ({ label, options = [], name, selectedValue, onChange = () => {} }) => {
  return (
    <div className={styles.InputRadioAdmin}>
      <label className={styles.label}>{label}</label>
      <div>
        {options.length > 0
          ? options.map((option) => (
              <label key={option.value} className={styles.label}>
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={selectedValue === option.value}
                  onChange={() => onChange(option.value)}
                  className={styles.inputRadio}
                />
                <span className={styles.customRadio}></span>
                {option.label}
              </label>
            ))
          : null}
      </div>
    </div>
  );
};
export default InputRadioAdmin;
