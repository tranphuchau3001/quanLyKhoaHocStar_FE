import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CircularProgress, Grid, Card, CardContent } from "@mui/material";
import Footer from "examples/Footer";
import PageLayout from "examples/LayoutContainers/PageLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import axios from "axios";

const PaymentResult = () => {
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [orderInfo, setOrderInfo] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [payDate, setPayDate] = useState("");
  const [courseId, setCourseId] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const responseCode = params.get("vnp_ResponseCode");
    const txnRef = params.get("vnp_TxnRef");
    const amount = params.get("vnp_Amount");
    const orderInfo = params.get("vnp_OrderInfo");
    const payDate = params.get("vnp_PayDate");

    const totalAmountInVND = amount ? (amount / 100).toLocaleString() : "";

    const decodedOrderInfo = decodeURIComponent(orderInfo);
    const courseIdValue = parseInt(decodedOrderInfo, 10);

    setCourseId(courseIdValue);

    setCourseId(courseIdValue);

    let formattedPayDate = "N/A";
    if (payDate) {
      const year = payDate.substring(0, 4);
      const month = payDate.substring(4, 6) - 1;
      const day = payDate.substring(6, 8);
      const hour = payDate.substring(8, 10);
      const minute = payDate.substring(10, 12);
      const second = payDate.substring(12, 14);

      const dateObj = new Date(year, month, day, hour, minute, second);
      formattedPayDate = dateObj.toLocaleString();
    }

    if (responseCode === "00") {
      setPaymentStatus("success");
      setTransactionId(txnRef);
      setMessage(`Thanh toán thành công! Mã giao dịch: ${txnRef}`);
      setOrderInfo(orderInfo);
      setTotalAmount(totalAmountInVND);
      setPayDate(formattedPayDate);
      updatePaymentStatus(txnRef, "completed");
      sendPaymentSuccessEmail(txnRef, "completed");
    } else {
      setPaymentStatus("failure");
      setTransactionId(txnRef);
      setMessage("Thanh toán không thành công. Vui lòng thử lại!");
      setOrderInfo(orderInfo);
      setTotalAmount(totalAmountInVND);
      setPayDate(formattedPayDate);
      updatePaymentStatus(txnRef, "failed");
    }

    setLoading(false);
  }, [location]);

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

  const sendPaymentSuccessEmail = (transactionId, paymentStatus) => {
    axios
      .post("http://localhost:3030/api/v1/vnpay/send-payment-success-email", {
        transactionId: transactionId,
        paymentStatus: paymentStatus,
      })
      .then((response) => {
        console.log("Gửi maill thành công", response.data);
      })
      .catch((error) => {
        console.error(
          "Có lỗi xảy ra khi gửi mail:",
          error.response ? error.response.data : error.message
        );
      });
  };

  return (
    <PageLayout>
      <DefaultNavbar />
      <MDBox
        pt={6}
        pb={3}
        mt={6}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={6} mt={3}>
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
                <Grid container spacing={2}>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <>
                      {/* Trạng thái thanh toán */}
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={5} sx={{ ml: 4 }}>
                            <MDTypography
                              sx={{
                                mt: 2,
                                mb: 2,
                                fontWeight: "bold",
                              }}
                            >
                              Trạng thái thanh toán:
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5} sx={{ ml: 4 }}>
                            <MDTypography
                              sx={{
                                mt: 2,
                                mb: 2,
                                fontWeight: "bold",
                                color: paymentStatus === "success" ? "#4caf50" : "#f44336",
                              }}
                            >
                              {paymentStatus === "success" ? "Thành công" : "Thất bại"}
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Thông tin đơn hàng */}
                      {/* <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={5} sx={{ ml: 4 }}>
                            <MDTypography
                              sx={{
                                mt: 2,
                                mb: 2,
                                fontWeight: "bold",
                              }}
                            >
                              Thông tin đơn hàng:
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5} sx={{ ml: 4 }}>
                            <MDTypography
                              sx={{
                                mt: 2,
                                mb: 2,
                                fontWeight: "bold",
                                color: "#4caf50",
                              }}
                            >
                              {orderInfo}
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid> */}

                      {/* Tổng tiền */}
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={5} sx={{ ml: 4 }}>
                            <MDTypography
                              sx={{
                                mt: 2,
                                mb: 2,
                                fontWeight: "bold",
                              }}
                            >
                              Tổng tiền:
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5} sx={{ ml: 4 }}>
                            <MDTypography
                              sx={{
                                mt: 2,
                                mb: 2,
                                fontWeight: "bold",
                                color: "#4caf50",
                              }}
                            >
                              {totalAmount} VND
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Thời gian thanh toán */}
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={5} sx={{ ml: 4 }}>
                            <MDTypography
                              sx={{
                                mt: 2,
                                mb: 2,
                                fontWeight: "bold",
                              }}
                            >
                              Thời gian thanh toán:
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5} sx={{ ml: 4 }}>
                            <MDTypography
                              sx={{
                                mt: 2,
                                mb: 2,
                                fontWeight: "bold",
                                color: "#4caf50",
                              }}
                            >
                              {payDate ? new Date(payDate).toLocaleString() : "N/A"}
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Mã giao dịch */}
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={5} sx={{ ml: 4 }}>
                            <MDTypography
                              sx={{
                                mt: 2,
                                mb: 2,
                                fontWeight: "bold",
                              }}
                            >
                              Mã giao dịch:
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5} sx={{ ml: 4 }}>
                            <MDTypography
                              sx={{
                                mt: 2,
                                mb: 2,
                                fontWeight: "bold",
                                color: "#4caf50",
                              }}
                            >
                              {transactionId}
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Message */}
                      <Grid item xs={12}>
                        <MDTypography
                          sx={{
                            color: "#f44336",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {message}
                        </MDTypography>
                      </Grid>

                      {/* Nút quay lại */}
                      <Grid item xs={12} mt={2}>
                        {paymentStatus === "success" ? (
                          // Nút "Đi đến bài học" khi thanh toán thành công
                          <MDButton
                            variant="outlined"
                            color="primary"
                            href={`/learning/${courseId}`}
                            fullWidth
                          >
                            Đi đến bài học
                          </MDButton>
                        ) : (
                          // Nút "Quay lại trang chủ" khi thanh toán thất bại
                          <MDButton variant="outlined" color="primary" href="/home" fullWidth>
                            Quay lại trang chủ
                          </MDButton>
                        )}
                      </Grid>
                    </>
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

export default PaymentResult;
