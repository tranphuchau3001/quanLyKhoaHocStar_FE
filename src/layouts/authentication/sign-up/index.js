import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-login-layout.png";
import { Grid } from "@mui/material";

function Cover() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    otp: "",
  });

  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const otpRegex = /^[0-9]{6}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { email, phone, otp } = formData;
    if (!email || email.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Email không được để trống",
        text: "Vui lòng nhập email của bạn.",
      });
      return false;
    }

    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Email không hợp lệ",
        text: "Vui lòng nhập email đúng định dạng.",
      });
      return false;
    }

    if (!phone || phone.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Số điện thoại không được để trống",
        text: "Vui lòng nhập số điện thoại của bạn.",
      });
      return false;
    }

    if (!phoneRegex.test(phone)) {
      Swal.fire({
        icon: "error",
        title: "Số điện thoại không hợp lệ",
        text: "Vui lòng nhập số điện thoại gồm 10 chữ số.",
      });
      return false;
    }

    if (!otpRegex.test(otp)) {
      Swal.fire({
        icon: "error",
        title: "OTP không hợp lệ",
        text: "OTP phải gồm 6 chữ số.",
      });
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    if (!formData.password) {
      Swal.fire({
        icon: "error",
        title: "Vui lòng điền mật khẩu",
        text: "Mật khẩu không được để trống.",
      });
      return false;
    }

    console.log("Dữ liệu gửi đi:", {
      email: formData.email,
      otp: formData.otp,
    });

    try {
      const response = await axios.post("http://localhost:3030/user-api/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });
      if (response.data.success) {
        // OTP hợp lệ
        Swal.fire({
          icon: "success",
          title: "Đăng ký thành công",
          text: "Bạn đã đăng ký thành công!",
        });
        navigate("/authentication/sign-in");
      } else {
        // OTP không hợp lệ
        Swal.fire({
          icon: "error",
          title: "Mã OTP không hợp lệ",
          text: "Vui lòng kiểm tra lại mã OTP.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Đăng ký thất bại",
        text: error.response ? error.response.data : error.message,
      });
    }
  };

  const handleSendOtp = async () => {
    if (!formData.password || !formData.email) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng điền đầy đủ thông tin để gửi OTP.",
      });
      return;
    }

    console.log("Dữ liệu gửi đi:", {
      name: formData.username,
      phone: formData.phone,
      email: formData.email,
      passwordHash: formData.password,
    });

    try {
      const response = await axios.post("http://localhost:3030/user-api/register", {
        name: formData.username,
        passwordHash: formData.password,
        email: formData.email,
        phone: formData.phone,
      });
      Swal.fire({
        icon: "success",
        title: "Gửi OTP thành công",
        text: "OTP đã được gửi đến email của bạn! Otp sẽ hết hạn sau 5 phút",
      });
      setIsOtpSent(true);
      setOtpCountdown(60);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gửi OTP thất bại",
        text: error.response ? error.response.data : error.message,
      });
    }
  };

  useEffect(() => {
    if (otpCountdown > 0) {
      const timerId = setInterval(() => {
        setOtpCountdown((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      setIsOtpSent(false);
    }
  }, [otpCountdown]);

  return (
    <CoverLayout image={bgImage}>
      <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Card
          sx={{
            borderRadius: "15px",
            backgroundColor: "rgba(255, 255, 255)",
            backdropFilter: "blur(1px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <MDTypography textAlign="center" variant="h4" fontWeight="bold" color="black" mt={2}>
            Đăng ký
          </MDTypography>
          <MDBox pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}></MDBox>
              <MDBox mb={2}>
                <MDInput
                  name="username"
                  type="text"
                  label="Họ và tên"
                  variant="standard"
                  fullWidth
                  onChange={handleChange}
                  InputLabelProps={{
                    sx: {
                      color: "black",
                    },
                  }}
                  inputProps={{
                    style: { color: "black" },
                  }}
                />

                <MDInput
                  name="password"
                  type="password"
                  label="Mật khẩu"
                  variant="standard"
                  fullWidth
                  onChange={handleChange}
                  InputLabelProps={{
                    sx: {
                      color: "black",
                    },
                  }}
                  inputProps={{
                    style: { color: "black" },
                  }}
                />

                <MDInput
                  name="email"
                  type="email"
                  label="Email"
                  variant="standard"
                  fullWidth
                  onChange={handleChange}
                  InputLabelProps={{
                    sx: {
                      color: "black",
                    },
                  }}
                  inputProps={{
                    style: { color: "black" },
                  }}
                />

                <MDInput
                  name="phone"
                  type="text"
                  label="Số điện thoại"
                  variant="standard"
                  fullWidth
                  onChange={handleChange}
                  InputLabelProps={{
                    sx: {
                      color: "black",
                    },
                  }}
                  inputProps={{
                    style: { color: "black" },
                  }}
                />
              </MDBox>

              <MDBox mb={2}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={8}>
                    <MDInput
                      name="otp"
                      type="text"
                      label="Nhập mã OTP"
                      variant="standard"
                      fullWidth
                      onChange={handleChange}
                      InputLabelProps={{
                        sx: {
                          color: "black",
                        },
                      }}
                      inputProps={{
                        style: { color: "black" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <MDButton
                      variant="gradient"
                      fullWidth
                      disabled={isOtpSent}
                      onChange={handleChange}
                      sx={{
                        height: "20px",
                        backgroundColor: "#6CA5CE",
                        fontWeight: "bold",
                        color: "#030d1e",
                        "&:hover": {
                          backgroundColor: "info",
                        },
                      }}
                      onClick={handleSendOtp}
                    >
                      {isOtpSent ? `Gửi lại (${otpCountdown}s)` : "Gửi OTP"}
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox mt={4}>
                <MDButton
                  variant="gradient"
                  color="black"
                  fullWidth
                  onClick={handleRegister}
                  sx={{ color: "white", backgroundColor: "#00ff00" }}
                >
                  Đăng ký
                </MDButton>
              </MDBox>
              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography variant="button" color="black">
                  Bạn đã có tài khoản?{" "}
                  <MDTypography
                    component="a"
                    href="/authentication/sign-in"
                    variant="button"
                    color="black"
                    fontWeight="medium"
                  >
                    Đăng nhập
                  </MDTypography>
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>
    </CoverLayout>
  );
}

export default Cover;
