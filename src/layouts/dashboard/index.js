// Dashboard.js
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import fetchBarChartData from "layouts/dashboard/data/reportsBarChartData";
import { textAlign } from "@mui/system";

function Dashboard() {
  const [revenueChartData, setRevenueChartData] = useState(null);
  const [userChartData, setUserChartData] = useState(null);
  const [initialYear, setInitialYear] = useState(new Date().getFullYear());

  // Hàm lấy dữ liệu cho doanh thu
  const fetchInitialData = async () => {
    try {
      const dataRevenue = await fetchBarChartData(initialYear);
      setRevenueChartData(dataRevenue);
      // Nếu có dữ liệu khác, bạn cũng có thể gọi thêm hàm cho userChartData
      // const dataUser = await fetchReportsLineChartData();
      // setUserChartData(dataUser);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [initialYear]);

  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  console.log("revenueChartData Dashboard: ", revenueChartData);
  console.log("userChartData Dashboard: ", userChartData);

  const currentMonthIndex = new Date().getMonth();
  const previousMonthIndex = currentMonthIndex - 1 >= 0 ? currentMonthIndex - 1 : 11;

  const currentMonthRevenue = revenueChartData?.datasets.data[currentMonthIndex] || 0;
  const previousMonthRevenue = revenueChartData?.datasets.data[previousMonthIndex] || 0;

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
  };

  const percentageChange = calculatePercentageChange(currentMonthRevenue, previousMonthRevenue);

  console.log("currentMonthRevenue: " + currentMonthRevenue);

  if (revenueChartData === null) {
    return (
      <MDTypography variant="h6" sx={{ textAlign: "center" }}>
        Loading...
      </MDTypography>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Doanh thu tháng này"
                count={formatCurrencyVND(currentMonthRevenue)}
                percentage={{
                  color: percentageChange >= 0 ? "success" : "error",
                  label:
                    percentageChange >= 0 ? "So với tháng trước tăng " : "So với tháng trước giảm ",
                  amount: `${percentageChange.toFixed(1)}%`,
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="leaderboard"
                title="Tổng doanh thu năm"
                count={281}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "So với năm trước",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Số người dùng tháng này"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "+2.5%",
                  label: "So với tháng trước",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="person"
                title="Tổng số người dùng"
                count="34k"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Vừa cập nhật",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsBarChart
                  title="Doanh thu hàng tháng"
                  description="Thống kê doanh thu hàng tháng"
                  date={`Cập nhật lần cuối: ${new Date().toLocaleDateString()}`}
                  chart={revenueChartData}
                  initialYear={initialYear}
                  color="info"
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                {/* <ReportsLineChart
                  color="success"
                  title="Tổng số học viên"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="Cập nhật 2 ngày trước"
                  chart={userChartData}
                /> */}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
