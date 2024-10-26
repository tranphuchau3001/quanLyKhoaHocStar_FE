import { useState } from "react";
import styles from "./InputAdmin.module.css";

// eslint-disable-next-line react/prop-types
const InputAdmin = ({ label, placeholder, onChange = () => {}, type, name, value }) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={styles.InputAdmin}>
      <label className={styles.label}>{label}</label>
      <div className={`${styles.input} ${isFocused ? styles.isFocused : ""}`}>
        <input
          className={styles.inputText}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          name={name}
          value={value}
        />
      </div>
    </div>
  );
};
export default InputAdmin;
