import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

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
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Họ và tên"
                  variant="standard"
                  fullWidth
                  InputLabelProps={{
                    sx: {
                      color: "white", // Màu chữ của label
                    },
                  }}
                  inputProps={{
                    style: { color: "white" }, // Màu chữ khi nhập vào input
                  }}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Tài khoản"
                  variant="standard"
                  fullWidth
                  InputLabelProps={{
                    sx: {
                      color: "white", // Màu chữ của label
                    },
                  }}
                  inputProps={{
                    style: { color: "white" }, // Màu chữ khi nhập vào input
                  }}
                />
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Mật khẩu"
                  variant="standard"
                  fullWidth
                  InputLabelProps={{
                    sx: {
                      color: "white", // Màu chữ của label
                    },
                  }}
                  inputProps={{
                    style: { color: "white" }, // Màu chữ khi nhập vào input
                  }}
                />
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Email"
                  variant="standard"
                  fullWidth
                  InputLabelProps={{
                    sx: {
                      color: "white", // Màu chữ của label
                    },
                  }}
                  inputProps={{
                    style: { color: "white" }, // Màu chữ khi nhập vào input
                  }}
                />
              </MDBox>

              <MDBox mb={2}>
                <Grid container spacing={1} alignItems="center">
                  {/* Phần nhập OTP chiếm 8 phần */}
                  <Grid item xs={8}>
                    <MDInput
                      type="otp"
                      label="Nhập mã OTP"
                      variant="standard"
                      fullWidth
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
                      sx={{
                        height: "20px", // Chiều cao nút
                        backgroundColor: "#6CA5CE", // Màu nền
                        fontWeight: "bold", // Đặt chữ in đậm
                        color: "#030d1e", // Màu chữ
                        "&:hover": {
                          backgroundColor: "info", // Màu nền khi hover
                        },
                      }}
                    >
                      Gửi OTP
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>

              <MDBox mt={4}>
                <MDButton variant="gradient" color="white" fullWidth>
                  sign in
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
