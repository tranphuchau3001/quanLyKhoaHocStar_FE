import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import fetchBarChartData from "../dashboard/data/reportsBarChartData";
import fetchReportsLineChartData from "../dashboard/data/reportsLineChartData";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
// import fetchBarChartData from "layouts/dashboard/data/reportsBarChartData";
// import fetchReportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { Typography } from "@mui/material";

function Dashboard() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: {
      label: "Revenue",
      data: [],
    },
  });
  console.log("Dữ liệu component chính", chartData); // Kiểm tra dữ liệu
  const [chartData2, setChartData2] = useState({
    labels: [],
    datasets: {
      label: "Revenue",
      data: [],
    },
  });
  const handleYearChange = async (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    await fetchChartData(year);
  };

  const fetchChartData = async (year) => {
    const barData = await fetchBarChartData(year); // Truyền năm làm tham số
    const lineData = await fetchReportsLineChartData(year);
    setChartData(barData);
    setChartData2(lineData);
  };

  useEffect(() => {
    fetchChartData(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBarChartData();
      setChartData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchReportsLineChartData();
      setChartData2(data);
    };

    loadData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Bookings"
                count={281}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid> */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Doanh thu tháng này"
                count="2,300"
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Tổng số người dùng"
                count="34k"
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          {/* <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Followers"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid> */}
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Thống kê doanh thu"
                  // description="Last Campaign Performance"
                  date="Cập nhật 2 ngày trước"
                  chart={chartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Tổng số học viên"
                  // description={
                  //   <>
                  //     (<strong>+15%</strong>) increase in today sales.
                  //   </>
                  // }
                  date="Cập nhật 2 ngày trước"
                  chart={chartData2}
                />
              </MDBox>
            </Grid>
            {/* <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox> */}
            {/* </Grid> */}
          </Grid>
        </MDBox>
        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
