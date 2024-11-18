import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CircularProgress, Grid, Card, CardContent } from "@mui/material";
import Footer from "examples/Footer";
import PageLayout from "examples/LayoutContainers/PageLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import axios from "axios"; // Thêm axios để gọi API

const PaymentResult = () => {
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(""); // Trạng thái thanh toán
  const [transactionId, setTransactionId] = useState(""); // ID giao dịch
  const [message, setMessage] = useState(""); // Thông báo từ hệ thống
  const [error, setError] = useState(""); // Lỗi nếu có
  const [orderInfo, setOrderInfo] = useState(""); // Thông tin đơn hàng
  const [totalAmount, setTotalAmount] = useState(""); // Tổng tiền
  const [payDate, setPayDate] = useState(""); // Thời gian thanh toán

  const location = useLocation(); // Lấy tham số từ URL

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const responseCode = params.get("vnp_ResponseCode");
    const txnRef = params.get("vnp_TxnRef");
    const amount = params.get("vnp_Amount");
    const orderInfo = params.get("vnp_OrderInfo");
    const payDate = params.get("vnp_PayDate");

    // Chuyển đổi số tiền từ cent sang VND
    const totalAmountInVND = amount ? (amount / 100).toLocaleString() : "";

    if (responseCode === "00") {
      setPaymentStatus("success");
      setTransactionId(txnRef);
      setMessage(`Thanh toán thành công! Mã giao dịch: ${txnRef}`);
      setOrderInfo(orderInfo);
      setTotalAmount(totalAmountInVND);
      setPayDate(payDate);
      updatePaymentStatus(txnRef, "completed");
    } else {
      setPaymentStatus("failure");
      setMessage("Thanh toán không thành công. Vui lòng thử lại!");
      updatePaymentStatus(txnRef, "failed");
    }

    setLoading(false);
  }, [location]);

  // Hàm gọi API để cập nhật trạng thái thanh toán
  const updatePaymentStatus = (transactionId, paymentStatus) => {
    axios
      .post("http://localhost:3030/api/v1/vnpay/update-status", {
        transactionId: transactionId,
        paymentStatus: paymentStatus,
      })
      .then((response) => {
        console.log("Cập nhật thành công", response.data);
      })
      .catch((error) => {
        console.error(
          "Có lỗi xảy ra khi cập nhật trạng thái thanh toán:",
          error.response ? error.response.data : error.message
        );
      });
  };
  return (
    <PageLayout>
      <DefaultNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} pt={6}>
          <Grid item xs={12}>
            <Grid container spacing={6} padding={3}>
              <Grid item xs={12} md={7}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <MDTypography variant="h5" color="white" textAlign="center">
                      Kết quả thanh toán
                    </MDTypography>
                  </MDBox>
                  <CardContent>
                    <Grid container spacing={2} justifyContent="center">
                      {loading ? (
                        <CircularProgress />
                      ) : (
                        <>
                          <Grid item xs={12}>
                            <MDTypography
                              variant="h5"
                              sx={{ mt: 2, mb: 2, fontWeight: "bold", textAlign: "center" }}
                            >
                              Trạng thái thanh toán:{" "}
                              <span
                                style={{
                                  color: paymentStatus === "success" ? "#4caf50" : "#f44336",
                                }}
                              >
                                {paymentStatus === "success" ? "Thành công" : "Thất bại"}
                              </span>
                            </MDTypography>
                          </Grid>

                          <Grid item xs={12}>
                            <MDTypography
                              variant="h6"
                              sx={{ mt: 2, mb: 2, fontWeight: "bold", textAlign: "center" }}
                            >
                              Thông tin đơn hàng:{" "}
                              <span style={{ color: "#4caf50" }}>{orderInfo}</span>
                            </MDTypography>
                          </Grid>

                          <Grid item xs={12}>
                            <MDTypography
                              variant="h6"
                              sx={{ mt: 2, mb: 2, fontWeight: "bold", textAlign: "center" }}
                            >
                              Tổng tiền: <span style={{ color: "#4caf50" }}>{totalAmount} VND</span>
                            </MDTypography>
                          </Grid>

                          <Grid item xs={12}>
                            <MDTypography
                              variant="h6"
                              sx={{ mt: 2, mb: 2, fontWeight: "bold", textAlign: "center" }}
                            >
                              Thời gian thanh toán:{" "}
                              <span style={{ color: "#4caf50" }}>
                                {payDate ? new Date(payDate).toLocaleString() : "N/A"}
                              </span>
                            </MDTypography>
                          </Grid>

                          <Grid item xs={12}>
                            <MDTypography
                              variant="h6"
                              sx={{ mt: 2, mb: 2, fontWeight: "bold", textAlign: "center" }}
                            >
                              Mã giao dịch:{" "}
                              <span style={{ color: "#4caf50" }}>{transactionId}</span>
                            </MDTypography>
                          </Grid>

                          <Grid item xs={12}>
                            <MDTypography
                              sx={{ color: "#f44336", fontWeight: "bold", textAlign: "center" }}
                            >
                              {message}
                            </MDTypography>
                          </Grid>

                          <Grid item xs={12} mt={2}>
                            <MDButton variant="outlined" color="primary" href="/courses" fullWidth>
                              Quay lại trang khóa học
                            </MDButton>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </PageLayout>
  );
};

export default PaymentResult;
