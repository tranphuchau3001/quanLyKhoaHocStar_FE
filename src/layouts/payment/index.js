import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CardContent, CircularProgress } from "@mui/material";
import Footer from "examples/Footer";
import PageLayout from "examples/LayoutContainers/PageLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Swal from "sweetalert2";

const PaymentVNPay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courseName, setCourseName] = useState("");
  const [amount, setAmount] = useState(0);
  const [enrollmentId, setEnrollmentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("courseName");
    const price = params.get("price");
    const enrollmentId = params.get("enrollmentId");
    const courseId = params.get("courseId");

    if (!userId) {
      Swal.fire({
        title: "Bạn chưa đăng nhập!",
        text: "Vui lòng đăng nhập để tiếp tục. Bạn có muốn đăng nhập không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/authentication/sign-in");
        } else if (result.isDismissed) {
          navigate("/home");
          console.log("Người dùng đã từ chối đăng nhập.");
        }
      });
      return;
    }

    if (name && price) {
      setCourseName(decodeURIComponent(name));
      setAmount(parseInt(price));
    }

    if (enrollmentId) {
      setEnrollmentId(enrollmentId);
    }

    if (courseId) {
      setCourseId(courseId);
    }

    console.log(name, price, enrollmentId, userId, courseId);
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const orderData = {
        amount,
        orderInfo: `${courseId}`,
        enrollmentId,
      };

      const response = await axios.post(
        "http://localhost:3030/api/v1/vnpay/submitOrder",
        orderData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(response);

      if (response.status === 200) {
        const paymentUrl = response.data;
        console.log("Redirecting to:", paymentUrl);
        console.log(orderData);
        Swal.fire({
          title: "Thành công!",
          text: "Đơn hàng đã được tạo thành công!",
          icon: "success",
        });
        window.location.href = paymentUrl;
      } else {
        console.error("Failed to submit order:", response.status, response.data);
        Swal.fire({
          title: "Thất bại!",
          text: "Tạo đơn hàng không thành công!",
          icon: "error",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Error during payment:", err);
      Swal.fire({
        title: "Thất bại!",
        text: "Có lỗi xảy ra khi kết nối với server. Vui lòng thử lại!",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <DefaultNavbar />
      <MDBox
        pt={3}
        pb={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 100px)",
        }}
      >
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox
                mx={2}
                mt={-4}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h5" color="white" textAlign="center">
                  Thông tin thanh toán
                </MDTypography>
              </MDBox>
              <CardContent>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={6}>
                    <MDTypography sx={{ ml: 5, fontWeight: "bold" }}>Tên khóa học:</MDTypography>
                  </Grid>
                  <Grid item xs={6}>
                    <MDTypography sx={{ color: "#4caf50", fontWeight: "bold" }}>
                      {courseName}
                    </MDTypography>
                  </Grid>
                  {/* <Grid item xs={2}>
                  <MDButton
                    variant="outlined"
                    color="primary"
                    onClick={() => navigator.clipboard.writeText(amount.toLocaleString())}
                    fullWidth
                  >
                    Sao chép
                  </MDButton>
                </Grid> */}

                  <Grid item xs={6}>
                    <MDTypography sx={{ ml: 5, fontWeight: "bold" }}>Số tiền:</MDTypography>
                  </Grid>
                  <Grid item xs={6}>
                    <MDTypography sx={{ color: "#4caf50", fontWeight: "bold" }}>
                      {amount.toLocaleString()} VND
                    </MDTypography>
                  </Grid>
                  {/* <Grid item xs={2}>
                  <MDButton
                    variant="outlined"
                    color="primary"
                    onClick={() => navigator.clipboard.writeText(amount.toLocaleString())}
                    fullWidth
                  >
                    Sao chép
                  </MDButton>
                </Grid> */}

                  <Grid item xs={12}>
                    <MDButton
                      sx={{ mt: 2 }}
                      variant="gradient"
                      color="primary"
                      fullWidth
                      onClick={handlePayment}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : "Thanh toán"}
                    </MDButton>
                  </Grid>
                  {error && (
                    <MDTypography variant="caption" color="error" textAlign="center" sx={{ mt: 2 }}>
                      {error}
                    </MDTypography>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </PageLayout>
  );
};

export default PaymentVNPay;
