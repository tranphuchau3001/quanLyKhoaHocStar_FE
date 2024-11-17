import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
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

function Dashboard() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: {
      label: "Revenue",
      data: [],
    },
  });
  const [chartData2, setChartData2] = useState({
    labels: [],
    datasets: {
      label: "Revenue",
      data: [],
    },
  });
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
  // if (!chartData) {
  //   return <p>Loading...</p>; // Hiển thị khi đang tải dữ liệu
  // // }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
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
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Today's Users"
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
                title="Revenue"
                count="34k"
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
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
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Thống kê doanh thu"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={chartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Tổng số người dùng"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
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
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
