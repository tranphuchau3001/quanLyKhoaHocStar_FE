import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import axios from "axios";

import Swal from "sweetalert2";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
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

  // Countdown state
  const [otpCountdown, setOtpCountdown] = useState(0); // Timer for OTP countdown
  const [isOtpSent, setIsOtpSent] = useState(false); // State to disable button after OTP is sent

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Phone number validation regex (assumes a 10-digit phone number)
  const phoneRegex = /^[0-9]{10}$/;
  // OTP must be exactly 6 digits
  const otpRegex = /^[0-9]{6}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { email, phone, otp } = formData;

    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Email không hợp lệ",
        text: "Vui lòng nhập email đúng định dạng.",
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
      return; // Stop if validation fails
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
      Swal.fire({
        icon: "success",
        title: "Đăng ký thành công",
        text: "Bạn đã đăng ký thành công!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Đăng ký thất bại",
        text: error.response ? error.response.data : error.message,
      });
    }
  };

  const handleSendOtp = async () => {
    if (!formData.username || !formData.password || !formData.email || !formData.phone) {
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
      setIsOtpSent(true); // Set the OTP sent flag
      setOtpCountdown(60); // Start 60s countdown
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

      return () => clearInterval(timerId); // Cleanup the timer when the component unmounts
    } else {
      setIsOtpSent(false); // Enable OTP button again when countdown finishes
    }
  }, [otpCountdown]);

  return (
    <CoverLayout image={bgImage}>
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh" // Đảm bảo toàn bộ chiều cao màn hình được sử dụng
      >
        <Card
          sx={{
            borderRadius: "15px",
            backgroundColor: "rgba(0, 0, 0, 0.2)", // Nền đen hơi trong suốt
            backdropFilter: "blur(1px)", // Giảm blur để nền rõ hơn, hoặc xóa nếu không cần
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)", // Đổ bóng cho khung đăng nhập
            border: "1px solid rgba(255, 255, 255, 0.6)", // Viền mờ sáng
            width: "100%",
            maxWidth: "400px", // Giới hạn chiều rộng của thẻ
          }}
        >
          <MDTypography textAlign="center" variant="h4" fontWeight="bold" color="white" mt={2}>
            Đăng ký
          </MDTypography>
          <MDBox pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}></MDBox>
              <MDBox mb={2}>
                <MDInput
                  name="username" // Thêm thuộc tính name
                  type="text" // Đổi type thành 'text' cho trường tên
                  label="Họ và tên"
                  variant="standard"
                  fullWidth
                  onChange={handleChange}
                  InputLabelProps={{
                    sx: {
                      color: "white",
                    },
                  }}
                  inputProps={{
                    style: { color: "white" },
                  }}
                />

                <MDInput
                  name="password" // Thêm thuộc tính name
                  type="password"
                  label="Mật khẩu"
                  variant="standard"
                  fullWidth
                  onChange={handleChange}
                  InputLabelProps={{
                    sx: {
                      color: "white",
                    },
                  }}
                  inputProps={{
                    style: { color: "white" },
                  }}
                />

                <MDInput
                  name="email" // Thêm thuộc tính name
                  type="email"
                  label="Email"
                  variant="standard"
                  fullWidth
                  onChange={handleChange}
                  InputLabelProps={{
                    sx: {
                      color: "white",
                    },
                  }}
                  inputProps={{
                    style: { color: "white" },
                  }}
                />

                <MDInput
                  name="phone" // Thêm thuộc tính name
                  type="text" // Đổi type thành 'text' cho trường điện thoại
                  label="Số điện thoại"
                  variant="standard"
                  fullWidth
                  onChange={handleChange}
                  InputLabelProps={{
                    sx: {
                      color: "white",
                    },
                  }}
                  inputProps={{
                    style: { color: "white" },
                  }}
                />
              </MDBox>

              <MDBox mb={2}>
                <Grid container spacing={1} alignItems="center">
                  {/* Phần nhập OTP chiếm 8 phần */}
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
                          color: "white", // Màu chữ của label
                        },
                      }}
                      inputProps={{
                        style: { color: "white" }, // Màu chữ khi nhập vào input
                      }}
                    />
                  </Grid>
                  {/* Nút gửi OTP chiếm 4 phần */}
                  <Grid item xs={4}>
                    <MDButton
                      variant="gradient"
                      fullWidth
                      disabled={isOtpSent} // Disable button if OTP was sent
                      onChange={handleChange}
                      sx={{
                        height: "20px", // Chiều cao nút
                        backgroundColor: "#6CA5CE", // Màu nền
                        fontWeight: "bold", // Đặt chữ in đậm
                        color: "#030d1e", // Màu chữ
                        "&:hover": {
                          backgroundColor: "info", // Màu nền khi hover
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
                  sx={{ color: "#111b2a" }} // Màu chữ đen
                >
                  Đăng ký
                </MDButton>
              </MDBox>
              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography variant="button" color="white">
                  Bạn đã có tài khoản?{" "}
                  <MDTypography
                    component="a"
                    href="/authentication/sign-in"
                    variant="button"
                    color="white"
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
