import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-login-layout.png";
import { Grid } from "@mui/material";
import apiClient from "api/apiClient";

function Cover() {
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    otp: "",
  });

  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const navigate = useNavigate();
  const emailRegex =
    /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:\\[\x01-\x7F]|[^\x00-\x1F\x7F\\"])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:[\x01-\x7F]+)\]))$/;
  const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  const otpRegex = /^[0-9]{6}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkEmailRegistered = async (email) => {
    try {
      const response = await apiClient.get("/user-api/check-email", {
        params: { email },
      });
      return response.data.success === false;
    } catch (error) {
      console.error("Lỗi khi gọi API check-email:", error);
      return false;
    }
  };

  const checkPhoneRegistered = async (phone) => {
    try {
      const response = await apiClient.get("/user-api/check-phone", {
        params: { phone },
      });
      return response.data.success === false;
    } catch (error) {
      console.error("Lỗi khi gọi API check-phone:", error);
      return false;
    }
  };

  const validateForm = async () => {
    const { fullName, email, phone, password, confirmPassword } = formData;

    if (!fullName || fullName.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Họ tên không được để trống",
        text: "Vui lòng nhập họ tên của bạn.",
      });
      return false;
    }

    if (!password || password.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Mật khẩu không được để trống",
        text: "Vui lòng nhập mật khẩu.",
      });
      return false;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Mật khẩu quá ngắn",
        text: "Mật khẩu phải có ít nhất 6 ký tự.",
      });
      return false;
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Nhập lại mật khẩu không được để trống",
        text: "Vui lòng nhập lại mật khẩu.",
      });
      return false;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Mật khẩu không khớp",
        text: "Vui lòng nhập lại mật khẩu đúng.",
      });
      return false;
    }

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

    const isEmailRegistered = await checkEmailRegistered(email);
    if (isEmailRegistered) {
      Swal.fire({
        icon: "error",
        title: "Email đã được đăng ký",
        text: "Email này đã được sử dụng cho một tài khoản khác.",
      });
      return false;
    }

    const isPhoneRegistered = await checkPhoneRegistered(phone);
    if (isPhoneRegistered) {
      Swal.fire({
        icon: "error",
        title: "Số điện thoại đã được đăng ký",
        text: "Số điện thoại này đã được sử dụng cho một tài khoản khác.",
      });
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (isOtpVerified && !otpRegex.test(otp)) {
      Swal.fire({
        icon: "error",
        title: "OTP không hợp lệ",
        text: "OTP phải gồm 6 chữ số.",
      });
      return;
    }

    try {
      const response = await apiClient.post("/user-api/register", {
        name: formData.fullName,
        passwordHash: formData.password,
        email: formData.email,
        phone: formData.phone,
      });

      Swal.fire({
        icon: "success",
        title: "Đăng ký thành công",
        text: "Bạn đã đăng ký thành công!",
      });

      navigate("/authentication/sign-in");
    } catch (error) {
      if (error.response && error.response.data) {
        Swal.fire({
          icon: "error",
          title: "Đăng ký thất bại",
          text: "Bạn đăng ký tài khoản thất bại!",
        });
      }
    }
  };

  const handleContinue = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    setIsOtpSent(true);
    setOtpCountdown(60);
    setIsFormDisabled(true);

    try {
      const email = formData.email.trim();
      if (!emailRegex.test(email)) {
        alert("Email không hợp lệ");
        setIsNotificationShown(true);
        return;
      }

      const response = await apiClient.post("/user-api/send-otp", { email });

      if (response.data.success) {
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi khi gửi OTP.",
        });
        setIsNotificationShown(true);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gửi OTP thất bại",
        text: error.message,
      });
      setIsNotificationShown(true);
    }

    const handleVerifyOtp = async () => {
      try {
        const response = await apiClient.post("/user-api/verify-otp", {
          email: formData.email,
          otp: formData.otp,
        });

        if (response.data.success) {
          setIsOtpVerified(true);
          await handleRegister();
        } else {
          Swal.fire({
            icon: "error",
            title: "Mã OTP không hợp lệ",
            text: "Vui lòng kiểm tra lại mã OTP.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Xác thực thất bại",
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
            <MDTypography textAlign="center" variant="h4" fontWeight="bold" color="dark" mt={4}>
              Đăng ký
            </MDTypography>
            <MDBox pb={4} px={4}>
              <MDBox component="form" role="form" display="flex" flexDirection="column" gap={3}>
                {/* Form đăng ký */}
                <MDInput
                  name="fullName"
                  type="text"
                  label="Họ và tên"
                  variant="standard"
                  fullWidth
                  onChange={handleChange}
                  disabled={isFormDisabled || isNotificationShown}
                />
                <MDInput
                  name="password"
                  type="password"
                  label="Mật khẩu"
                  variant="standard"
                  fullWidth
                  onChange={handleChange}
                  disabled={isFormDisabled || isNotificationShown}
                />
                <MDInput
                  name="confirmPassword"
                  type="password"
                  label="Nhập lại mật khẩu"
                  variant="standard"
                  fullWidth
                  onChange={handleChange}
                  disabled={isFormDisabled || isNotificationShown}
                />
                <MDInput
                  name="email"
                  type="email"
                  label="Email"
                  variant="standard"
                  fullWidth
                  onChange={handleChange}
                  disabled={isFormDisabled || isNotificationShown}
                />
                <MDInput
                  name="phone"
                  type="text"
                  label="Số điện thoại"
                  variant="standard"
                  fullWidth
                  onChange={handleChange}
                  disabled={isFormDisabled || isNotificationShown}
                />

                {/* OTP Form */}
                {isOtpSent && !isOtpVerified && (
                  <>
                    <MDInput
                      name="otp"
                      type="text"
                      label="Nhập mã OTP"
                      variant="standard"
                      fullWidth
                      onChange={handleChange}
                    />
                    <MDButton variant="gradient" color="info" fullWidth onClick={handleVerifyOtp}>
                      Xác thực OTP
                    </MDButton>
                  </>
                )}
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  onClick={handleContinue}
                  disabled={isOtpSent}
                >
                  {isOtpSent ? "Đang gửi OTP..." : "Tiếp tục"}
                </MDButton>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>
      </CoverLayout>
    );
  };
}
export default Cover;
