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
import { color } from "@mui/system";

function Basic() {
  const [checked, setChecked] = useState(false);
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => setChecked(event.target.checked);

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    setError("");
    setSuccess("");

    if (!email || !isEmailValid(email)) {
      setError("Email không hợp lệ.");
      return false;
    }

    if (!password) {
      setError("Mật khẩu không được để trống.");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:3030/api/v1/auth/login", {
        email,
        password,
      });

      if (response.data && response.data.token && response.data.userId) {
        const { token, userId, name, email, avatarUrl, roleId, registrationDate, status } =
          response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("avatarUrl", avatarUrl);
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("registrationDate", registrationDate);
        localStorage.setItem("status", status);

        console.log("Dữ liệu đã lưu vào localStorage:", { token, userId, name, email });

        Swal.fire("Thành công", "Đăng nhập thành công!", "success").then(() => {
          navigate("/home");
        });
      } else {
        console.log("Đăng nhập thất bại: Không có dữ liệu hợp lệ.");
        Swal.fire("Thất bại", "Đăng nhập thất bại. Vui lòng thử lại.", "error");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);

      if (error.response) {
        Swal.fire(
          "Thất bại",
          `Đăng nhập thất bại. Lỗi: ${error.response?.data?.message || error.response.statusText}`,
          "error"
        );
      } else if (error.request) {
        Swal.fire("Thất bại", "Không thể kết nối đến server. Vui lòng thử lại.", "error");
      } else {
        Swal.fire("Thất bại", "Lỗi: " + error.message, "error");
      }
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card
        sx={{
          borderRadius: "15px",
          backgroundColor: "rgba(255, 255, 255)",
          backdropFilter: "blur(1px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
        }}
      >
        <MDBox textAlign="center">
          <MDTypography variant="h4" fontWeight="bold" color="black" mt={2}>
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
                  sx: { color: "black", fontWeight: "bold", "&.Mui-focused": { color: "black" } },
                }}
                inputProps={{ style: { color: "black" } }}
                sx={{
                  "& .MuiInput-underline:before": { borderBottomColor: "white" },
                  "& .MuiInput-underline:after": { borderBottomColor: "white" },
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
                  sx: { color: "black", fontWeight: "bold", "&.Mui-focused": { color: "black" } },
                }}
                inputProps={{ style: { color: "black" } }}
                sx={{
                  "& .MuiInput-underline:before": { borderBottomColor: "white" },
                  "& .MuiInput-underline:after": { borderBottomColor: "white" },
                }}
              />
            </MDBox>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="row" alignItems="center">
                <Checkbox checked={checked} onChange={handleChange} color="primary" />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="black"
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  &nbsp;Nhớ mật khẩu
                </MDTypography>
              </Stack>
              <MDTypography
                variant="button"
                color="black"
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
                color="#000000"
                fullWidth
                onClick={handleLogin}
                sx={{
                  backgroundColor: "#00ff00",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary",
                  },
                }}
              >
                Đăng Nhập
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="black">
                Bạn chưa có tài khoản?{" "}
                <MDTypography
                  component="a"
                  href="/authentication/sign-up"
                  variant="button"
                  color="black"
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
