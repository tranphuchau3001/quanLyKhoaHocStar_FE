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
import fetchLineChartData from "layouts/dashboard/data/reportsLineChartData";
import { fetchTodayUsers, fetchAllUsers } from "layouts/dashboard/data/fetchDataUsers";

function Dashboard() {
  const [revenueChartData, setRevenueChartData] = useState(null);
  const [userChartData, setUserChartData] = useState(null);
  const [initialYear, setInitialYear] = useState(new Date().getFullYear());
  const [totalYearRevenue, setTotalYearRevenue] = useState(0);
  const [previousYearRevenue, setPreviousYearRevenue] = useState(0);
  const [totalYearUser, setTotalYearUser] = useState(0);
  const [previousYearUser, setPreviousYearUser] = useState(0);
  const [yearlyRevenuePercentageChange, setYearlyRevenuePercentageChange] = useState(0);
  const [yearlyUserPercentageChange, setYearlyUserPercentageChange] = useState(0);
  const [todayUsers, setTodayUsers] = useState(0);
  const [allUsers, setAllUsers] = useState(0);

  const currentMonthIndex = new Date().getMonth();
  const previousMonthIndex = currentMonthIndex - 1 >= 0 ? currentMonthIndex - 1 : 11;

  // revenue
  const currentMonthRevenue = revenueChartData?.datasets.data[currentMonthIndex] || 0;
  const previousMonthRevenue = revenueChartData?.datasets.data[previousMonthIndex] || 0;
  const calculateRevenuePercentageChange = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
  };
  const revenuePercentageChange = calculateRevenuePercentageChange(
    currentMonthRevenue,
    previousMonthRevenue
  );
  const calculatePercentageChangeInAnnualRevenue = (currentYearRevenue, previousYearRevenue) => {
    if (previousYearRevenue === 0) {
      return currentYearRevenue > 0 ? 100 : 0;
    }
    return ((currentYearRevenue - previousYearRevenue) / previousYearRevenue) * 100;
  };
  const getYearlyRevenueChangeSign = (yearlyChange) => {
    return yearlyChange >= 0 ? `+${yearlyChange.toFixed(1)}%` : `${yearlyChange.toFixed(1)}%`;
  };
  console.log("previousYearUser: ", previousYearUser);
  console.log("previousYearRevenue: ", previousYearRevenue);

  // user
  const currentMonthUsers = userChartData?.datasets.data[currentMonthIndex] || 0;
  const previousMonthUsers = userChartData?.datasets.data[previousMonthIndex] || 0;
  const calculateUserPercentageChange = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
  };
  const userPercentageChange = calculateUserPercentageChange(currentMonthUsers, previousMonthUsers);
  const calculatePercentageChangeInAnnualUser = (currentYearRevenue, previousYearRevenue) => {
    if (previousYearRevenue === 0) {
      return currentYearRevenue > 0 ? 100 : 0;
    }
    return ((currentYearRevenue - previousYearRevenue) / previousYearRevenue) * 100;
  };
  const getYearlyUserChangeSign = (yearlyUserChange) => {
    return yearlyUserChange >= 0
      ? `+${yearlyUserChange.toFixed(1)}%`
      : `${yearlyUserChange.toFixed(1)}%`;
  };

  const fetchInitialData = async () => {
    try {
      const dataRevenue = await fetchBarChartData(initialYear);
      setRevenueChartData(dataRevenue);

      const dataUser = await fetchLineChartData(initialYear);
      setUserChartData(dataUser);

      // revenue
      const totalYearRevenue = dataRevenue.datasets.data.reduce((acc, value) => acc + value, 0);
      setTotalYearRevenue(totalYearRevenue);

      // user
      const totalYearUser = dataUser.datasets.data.reduce((acc, value) => acc + value, 0);
      setTotalYearUser(totalYearUser);

      // today users
      const todayUserData = await fetchTodayUsers();
      const todayUserCount = todayUserData?.[0]?.userCount || 0;
      setTodayUsers(todayUserCount);

      // All users
      const allUserData = await fetchAllUsers();
      setAllUsers(allUserData);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchInitialData();
      // revenue
      const previousYearRevenueData = await fetchBarChartData(initialYear - 1);
      const previousYearTotalRevenue = previousYearRevenueData.datasets.data.reduce(
        (acc, value) => acc + value,
        0
      );
      setPreviousYearRevenue(previousYearTotalRevenue);

      const yearlyRevenueChange = calculatePercentageChangeInAnnualRevenue(
        totalYearRevenue,
        previousYearTotalRevenue
      );
      setYearlyRevenuePercentageChange(yearlyRevenueChange);

      // user
      const previousYearUserData = await fetchLineChartData(initialYear - 1);
      const previousYearTotalUser = previousYearUserData.datasets.data.reduce(
        (acc, value) => acc + value,
        0
      );
      setPreviousYearUser(previousYearTotalUser);

      const yearlyUserChange = calculatePercentageChangeInAnnualUser(
        totalYearUser,
        previousYearTotalUser
      );
      setYearlyUserPercentageChange(yearlyUserChange);
    };

    fetchData();
  }, [initialYear, totalYearRevenue, totalYearUser]);

  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (revenueChartData === null || userChartData == null) {
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
                color="dark"
                icon="insert_chart_outlined"
                title="Tổng doanh thu"
                count={formatCurrencyVND(currentMonthRevenue)}
                percentage={{
                  color: revenuePercentageChange >= 0 ? "success" : "error",
                  label: `Cập nhật lần cuối: ${new Date().toLocaleDateString("vi-VN")}`,
                  amount: ``,
                  // amount: `${revenuePercentageChange.toFixed(1)}%`,
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="add_chart"
                title="Doanh thu năm nay"
                count={formatCurrencyVND(totalYearRevenue)}
                percentage={{
                  color: yearlyRevenuePercentageChange >= 0 ? "success" : "error",
                  amount: getYearlyRevenueChangeSign(yearlyRevenuePercentageChange),
                  label: "So với năm trước",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="add_chart"
                title="Doanh thu tháng này"
                count={formatCurrencyVND(currentMonthRevenue)}
                percentage={{
                  color: revenuePercentageChange >= 0 ? "success" : "error",
                  label:
                    revenuePercentageChange >= 0
                      ? "So với tháng trước tăng "
                      : "So với tháng trước giảm ",
                  amount: `${revenuePercentageChange.toFixed(1)}%`,
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="add_chart"
                title="Doanh thu hôm nay"
                count={formatCurrencyVND(totalYearRevenue)}
                percentage={{
                  color: yearlyRevenuePercentageChange >= 0 ? "success" : "error",
                  label: `Cập nhật lần cuối: ${new Date().toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`,
                  amount: "",
                  // amount: getYearlyRevenueChangeSign(yearlyRevenuePercentageChange),
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <Grid container spacing={3} marginTop={0}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="groups"
                title="Tổng số người dùng"
                count={`${allUsers} người`}
                percentage={{
                  color: yearlyUserPercentageChange >= 0 ? "success" : "error",
                  label: `Cập nhật lần cuối: ${new Date().toLocaleDateString("vi-VN")}`,
                  amount: "",
                  // amount: getYearlyUserChangeSign(yearlyUserPercentageChange),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="group_add"
                title="Số người dùng năm nay"
                count={`+${totalYearUser} người`}
                percentage={{
                  color: yearlyUserPercentageChange >= 0 ? "success" : "error",
                  amount: getYearlyUserChangeSign(yearlyUserPercentageChange),
                  label: "So với năm trước",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="group_add"
                title="Số người dùng tháng này"
                count={`+${currentMonthUsers} người`}
                percentage={{
                  color: userPercentageChange >= 0 ? "success" : "error",
                  label:
                    userPercentageChange >= 0
                      ? "So với tháng trước tăng "
                      : "So với tháng trước giảm ",
                  amount: `${userPercentageChange.toFixed(1)}%`,
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="group_add"
                title="Số người dùng hôm nay"
                count={`+${todayUsers} người`}
                percentage={{
                  color: "success",
                  label: `Cập nhật lần cuối: ${new Date().toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`,
                  amount: "",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <Grid container spacing={3} marginTop={0}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="library_books"
                title="Tổng doanh thu"
                count={formatCurrencyVND(currentMonthRevenue)}
                percentage={{
                  color: revenuePercentageChange >= 0 ? "success" : "error",
                  label: `Cập nhật lần cuối: ${new Date().toLocaleDateString("vi-VN")}`,
                  amount: ``,
                  // amount: `${revenuePercentageChange.toFixed(1)}%`,
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="approval"
                title="Doanh thu năm nay"
                count={formatCurrencyVND(totalYearRevenue)}
                percentage={{
                  color: yearlyRevenuePercentageChange >= 0 ? "success" : "error",
                  amount: getYearlyRevenueChangeSign(yearlyRevenuePercentageChange),
                  label: "So với năm trước",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="leaderboard_add"
                title="Doanh thu tháng này"
                count={formatCurrencyVND(currentMonthRevenue)}
                percentage={{
                  color: revenuePercentageChange >= 0 ? "success" : "error",
                  label:
                    revenuePercentageChange >= 0
                      ? "So với tháng trước tăng "
                      : "So với tháng trước giảm ",
                  amount: `${revenuePercentageChange.toFixed(1)}%`,
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="leaderboard"
                title="Doanh thu hôm nay"
                count={formatCurrencyVND(totalYearRevenue)}
                percentage={{
                  color: yearlyRevenuePercentageChange >= 0 ? "success" : "error",
                  label: `Cập nhật lần cuối: ${new Date().toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`,
                  amount: "",
                  // amount: getYearlyRevenueChangeSign(yearlyRevenuePercentageChange),
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
                  description=""
                  date={`Cập nhật lần cuối: ${new Date().toLocaleDateString("vi-VN")}`}
                  chart={revenueChartData}
                  initialYear={initialYear}
                  color="info"
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Tổng số học viên"
                  description=""
                  date={`Cập nhật lần cuối: ${new Date().toLocaleDateString("vi-VN")}`}
                  chart={userChartData}
                  initialYear={initialYear}
                />
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
