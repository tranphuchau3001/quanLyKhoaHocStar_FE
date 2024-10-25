import { useState } from "react";

import Swal from "sweetalert2";

// react-router-dom components
import { useNavigate } from "react-router-dom";

import axios from "axios";

import Checkbox from "@mui/material/Checkbox";
// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-login-layout.png";
import { Button, Stack, SvgIcon } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
function Basic() {
  // Khởi tạo state cho checkbox với giá trị mặc định là false
  const [checked, setChecked] = useState(false);
  const [success, setSuccess] = useState("");

  // Hàm để xử lý sự kiện khi checkbox thay đổi
  const handleChange = (event) => {
    setChecked(event.target.checked); // Cập nhật state theo trạng thái mới của checkbox
  };
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const [email, setEmail] = useState("");
  const [passwordHash, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    setError(""); // Reset thông báo lỗi
    setSuccess(""); // Reset thông báo thành công

    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      return false;
    }

    // Kiểm tra mật khẩu
    if (!passwordHash) {
      setError("Mật khẩu không được để trống.");
      return false;
    }

    return true;
  };
  const handleLogin = async () => {
    if (!email || !passwordHash) {
      Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin", "error");
      return;
    }
    if (!isEmailValid(email)) {
      Swal.fire("Lỗi", "Email sai định dạng. Vui lòng nhập lại.", "warning");
      return;
    }
    try {
      // Gửi yêu cầu đăng nhập
      const response = await axios.post("http://localhost:3030/user-api/login", {
        email,
        passwordHash,
      });

      console.log("Đăng nhập thành công:", response.data);
      // Lưu token vào localStorage
      localStorage.setItem("token", response.data.token);
      Swal.fire("Thành công", "Đăng nhập thành công!", "success").then(() => {
        navigate("/home");
      });
    } catch (error) {
      // Xử lý lỗi
      console.error("Đăng nhập thất bại:", error.response ? error.response.data : error.message);
      setError("Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.");
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card
        sx={{
          borderRadius: "15px",
          backgroundColor: "rgba(0, 0, 0, 0.2)", // Nền đen hơi trong suốt
          backdropFilter: "blur(1px)", // Giảm blur để nền rõ hơn, hoặc xóa nếu không cần
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)", // Đổ bóng cho khung đăng nhập
          border: "1px solid rgba(255, 255, 255, 0.6)", // Viền mờ sáng
        }}
      >
        <MDBox textAlign="center">
          <MDTypography variant="h4" fontWeight="bold" color="white" mt={2}>
            Đăng nhập
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {/* Hiển thị thông báo lỗi ở trên cùng */}
          {error && (
            <MDBox mb={2} textAlign="center">
              <MDTypography variant="body2" color="red">
                {error}
              </MDTypography>
            </MDBox>
          )}
          {/* Hiển thị thông báo thành công ở trên cùng */}
          {success && (
            <MDBox mb={2} textAlign="center">
              <MDTypography variant="body2" color="green">
                {success}
              </MDTypography>
            </MDBox>
          )}
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Tài khoản"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
                InputLabelProps={{
                  sx: {
                    color: "white", // Màu chữ của label
                    fontWeight: "bold", // Làm cho label đậm
                    "&.Mui-focused": { color: "white" }, // Màu trắng khi có focus
                  },
                }}
                inputProps={{
                  style: { color: "white" }, // Màu chữ khi nhập vào input
                }}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "white", // Màu viền dưới trước khi có focus
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "white", // Màu viền dưới khi có focus
                  },
                }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Mật khẩu"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{
                  sx: {
                    color: "white", // Màu chữ của label
                    fontWeight: "bold", // Làm cho label đậm
                    "&.Mui-focused": { color: "white" }, // Màu trắng khi có focus
                  },
                }}
                inputProps={{
                  style: { color: "white" }, // Màu chữ khi nhập vào input
                }}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "white", // Màu viền dưới trước khi có focus
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "white", // Màu viền dưới khi có focus
                  },
                }}
              />
            </MDBox>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="row" alignItems="center">
                <Checkbox checked={checked} onChange={handleChange} color="primary" />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="white"
                  onClick={handleSetRememberMe}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  &nbsp;Nhớ mật khẩu
                </MDTypography>
              </Stack>
              <MDTypography
                variant="button"
                color="white"
                component="a"
                href="#"
                fontWeight="regular"
              >
                Quên mật khẩu?
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="black"
                fullWidth
                onClick={handleLogin}
                sx={{ color: "#111b2a" }} // Màu chữ đen
              >
                Đăng Nhập
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="white">
                Bạn chưa có tài khoản?{" "}
                <MDTypography
                  component="a"
                  href="/authentication/sign-up"
                  variant="button"
                  color="white"
                  fontWeight="medium"
                >
                  Tạo tài khoản
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
