import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-login-layout.png";
import { Button, Stack, SvgIcon } from "@mui/material";
function Basic() {
  const [checked, setChecked] = useState(false);
  const [success, setSuccess] = useState("");
  const handleChange = (event) => {
    setChecked(event.target.checked);
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
    setError("");
    setSuccess("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      return false;
    }

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
      const response = await axios.post("http://localhost:3030/user-api/login", {
        email,
        passwordHash,
      });
      if (response.data.success) {
        const { userId, name, phone, email, avatarUrl, roleId, registrationDate, status } =
          response.data.data;

        console.log(response);

        // Lưu thông tin vào localStorage
        localStorage.setItem("userId", userId);
        localStorage.setItem("name", name); // Sửa 'username' thành 'name'
        localStorage.setItem("phone", phone);
        localStorage.setItem("email", email);
        localStorage.setItem("avatarUrl", avatarUrl);
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("registrationDate", registrationDate);
        localStorage.setItem("status", status);
        Swal.fire("Thành công", "Đăng nhập thành công!", "success").then(() => {
          navigate("/home");
        });
      } else {
        Swal.fire("Thất bại", "Đăng nhập thất bại. Vui lòng thử lại.", "error");
      }
    } catch (error) {
      // Xử lý lỗi nếu API không trả về kết quả như mong muốn
      Swal.fire("Thất bại", "Vui lòng kiểm tra email và mật khẩu.", "error");
      console.error("Đăng nhập thất bại:", error.response ? error.response.data : error.message);
    }
  };
  return (
    <BasicLayout image={bgImage}>
      <Card
        sx={{
          borderRadius: "15px",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(1px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
        }}
      >
        <MDBox textAlign="center">
          <MDTypography variant="h4" fontWeight="bold" color="white" mt={2}>
            Đăng nhập
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {error && (
            <MDBox mb={2} textAlign="center">
              <MDTypography variant="body2" color="red">
                {error}
              </MDTypography>
            </MDBox>
          )}
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
                    color: "white",
                    fontWeight: "bold",
                    "&.Mui-focused": { color: "white" },
                  },
                }}
                inputProps={{
                  style: { color: "white" },
                }}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "white",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "white",
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
                    color: "white",
                    fontWeight: "bold",
                    "&.Mui-focused": { color: "white" },
                  },
                }}
                inputProps={{
                  style: { color: "white" },
                }}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "white",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "white",
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
                sx={{ color: "#111b2a" }}
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
