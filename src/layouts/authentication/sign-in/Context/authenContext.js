// AuthContext.js
import React, { createContext, useState } from "react";
import PropTypes from "prop-types"; //

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user sẽ là null nếu chưa đăng nhập

  const login = (userData) => {
    setUser(userData); // thiết lập dữ liệu người dùng khi đăng nhập
  };

  const logout = () => {
    setUser(null); // xóa dữ liệu người dùng khi đăng xuất
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

// Kiểm tra kiểu dữ liệu cho props
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Đảm bảo children là bắt buộc và là một node
};

export default AuthContext;
