import { useMemo, useState, useEffect } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

import YearSelect from "./data/dataYearSelect";
import fetchBarChartData from "../../../../layouts/dashboard/data/reportsBarChartData";

// react-chartjs-2 components
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// ReportsBarChart configurations
import configs from "examples/Charts/BarCharts/ReportsBarChart/configs";
import { FormControl, Grid, MenuItem, Select, Typography } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ReportsBarChart({ color, title, description, date, chart, initialYear }) {
  // const { data, options } = configs(chart.labels || [], chart.datasets || {});
  const [selectedYear, setSelectedYear] = useState("");
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  console.log("Data being passed to BarChart:", chartData);

  const handleYearChange = async (event) => {
    const year = Number(event.target.value);

    if (!year || isNaN(year)) {
      console.error("Invalid year selected:", year);
      return; // Không gọi API nếu năm không hợp lệ
    }

    setSelectedYear(year);

    try {
      console.log("Year being passed to fetchBarChartData:", typeof year, year);
      const data = await fetchBarChartData(Number(year));
      setChartData(data);
    } catch (error) {
      console.error("Failed to fetch data:", error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBarChartData();
      setChartData(data);
    };

    fetchData();
  }, [initialYear]);

  const { data, options } = configs(chartData.labels, chartData.datasets);
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox padding="1rem">
        {useMemo(
          () => (
            <MDBox
              variant="gradient"
              bgColor={color}
              borderRadius="lg"
              coloredShadow={color}
              py={2}
              pr={0.5}
              mt={-5}
              height="12.5rem"
            >
              <Bar data={data} options={options} redraw />
            </MDBox>
          ),
          [color, chart]
        )}
        <MDBox pt={3} pb={1} px={1}>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <MDTypography variant="h6" textTransform="capitalize">
                {title}
              </MDTypography>
              <MDTypography component="div" variant="button" color="text" fontWeight="light" mb={1}>
                {description}
              </MDTypography>
              <MDBox display="flex" alignItems="center">
                <MDTypography
                  variant="button"
                  color="text"
                  lineHeight={1}
                  sx={{ mt: 0.15, mr: 0.5 }}
                >
                  <Icon>schedule</Icon>
                </MDTypography>
                <MDTypography variant="button" color="text" fontWeight="light">
                  {date}
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <YearSelect selectedYear={selectedYear} handleYearChange={handleYearChange} />
              </FormControl>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of ReportsBarChart
ReportsBarChart.defaultProps = {
  color: "info",
  description: "",
  initialYear: new Date().getFullYear(),
};

// Typechecking props for the ReportsBarChart
ReportsBarChart.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  date: PropTypes.string.isRequired,
  chart: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
  initialYear: PropTypes.number, // Năm khởi tạo
};

export default ReportsBarChart;
