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
import apiClient from "api/apiClient";

function ForgetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    email: "",
    otp: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const otpRegex = /^[0-9]{6}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = async () => {
    const { email, password, confirmPassword } = formData;

    if (!password || password.length < 6) {
      Swal.fire("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.", "error");
      return false;
    }

    if (password !== confirmPassword) {
      Swal.fire("Lỗi", "Mật khẩu không khớp.", "error");
      return false;
    }

    if (!emailRegex.test(email)) {
      Swal.fire("Lỗi", "Email không hợp lệ.", "error");
      return false;
    }

    return true;
  };

  const handleContinue = async () => {
    if (!(await validateForm())) return;

    setIsSending(true);
    try {
      const { email } = formData;
      const response = await apiClient.post("/user-api/send-otp", { email });

      if (response.data.success) {
        Swal.fire("Thành công", "OTP đã được gửi.", "success");
        setIsOtpSent(true);
      } else {
        Swal.fire("Lỗi", "Không thể gửi OTP.", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi", "Gửi OTP thất bại.", "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleForgetPass = async () => {
    if (!otpRegex.test(formData.otp)) {
      Swal.fire("Lỗi", "OTP phải gồm 6 chữ số.", "error");
      return;
    }

    try {
      const response = await apiClient.put("/user-api/resetPassword", {
        newPassword: formData.password.trim(),
        email: formData.email.trim(),
        otp: formData.otp.trim(),
        confirmPassword: formData.confirmPassword.trim(),
      });

      if (response.data.success) {
        Swal.fire("Thành công", "Bạn đã đặt lại mật khẩu.", "success");
        navigate("/authentication/sign-in");
      } else {
        Swal.fire("Lỗi", "Đặt lại mật khẩu thất bại.", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi", "Có lỗi xảy ra.", "error");
    }
  };

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
          <MDTypography variant="h4" fontWeight="bold" textAlign="center" mt={4}>
            Quên mật khẩu
          </MDTypography>
          <MDBox pb={4} px={4}>
            <MDBox component="form" role="form" display="flex" flexDirection="column" gap={3}>
              <MDInput
                name="email"
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                onChange={handleChange}
                disabled={isSending || isOtpSent}
              />

              <MDInput
                name="password"
                type="password"
                label="Mật khẩu"
                variant="standard"
                fullWidth
                onChange={handleChange}
                disabled={isSending || isOtpSent}
              />

              <MDInput
                name="confirmPassword"
                type="password"
                label="Nhập lại mật khẩu"
                variant="standard"
                fullWidth
                onChange={handleChange}
                disabled={isSending || isOtpSent}
              />

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
                  <MDButton variant="gradient" color="info" fullWidth onClick={handleForgetPass}>
                    Xác thực OTP
                  </MDButton>
                </>
              )}

              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleContinue}
                disabled={isSending || isOtpSent}
              >
                {isSending ? "Đang gửi OTP..." : "Tiếp tục"}
              </MDButton>
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>
    </CoverLayout>
  );
}

export default ForgetPassword;
