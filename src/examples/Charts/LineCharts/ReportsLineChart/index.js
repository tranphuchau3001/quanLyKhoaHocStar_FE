// ReportsLineChart.js
import { useMemo, useState, useEffect } from "react";
import fetchLineChartData, { months } from "layouts/dashboard/data/reportsLineChartData";
import SelectYearRegistration from "examples/Charts/BarCharts/ReportsBarChart/data/SelectYearRegistration";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// ReportsLineChart configurations
import configs from "examples/Charts/LineCharts/ReportsLineChart/configs";
import { FormControl, Grid, MenuItem, Select } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ReportsLineChart({ color, title, description, date, chart, initialYear }) {
  const [selectedYear, setSelectedYear] = useState(initialYear || new Date().getFullYear());
  const [chartData, setChartData] = useState({
    labels: months,
    datasets: [
      {
        label: "User",
        data: Array(12).fill(0), // Default empty data for each month
      },
    ],
  });

  // Hàm thay đổi năm và lấy dữ liệu biểu đồ mới
  const handleYearChange = async (event) => {
    const year = Number(event.target.value);
    if (!year || isNaN(year)) return;

    setSelectedYear(year);
    try {
      const data = await fetchLineChartData(year); // Fetch new data based on selected year
      setChartData(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    if (chart && chart.labels && chart.datasets) {
      setChartData(chart);
    }
  }, [chart]);

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
              <Line data={data} options={options} redraw />
            </MDBox>
          ),
          [data, options, color]
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
                <SelectYearRegistration
                  selectedYear={selectedYear}
                  handleYearChange={handleYearChange}
                />
              </FormControl>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of ReportsLineChart
ReportsLineChart.defaultProps = {
  color: "info",
  description: "",
  initialYear: new Date().getFullYear(),
};

// Typechecking props for the ReportsLineChart
ReportsLineChart.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  date: PropTypes.string.isRequired,
  chart: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
  initialYear: PropTypes.number,
};

export default ReportsLineChart;
