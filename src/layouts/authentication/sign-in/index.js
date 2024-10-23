import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

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

  // Hàm để xử lý sự kiện khi checkbox thay đổi
  const handleChange = (event) => {
    setChecked(event.target.checked); // Cập nhật state theo trạng thái mới của checkbox
  };

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

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
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Tài khoản"
                fullWidth
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
              <MDButton variant="gradient" color="white" fullWidth>
                Đăng nhập
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
