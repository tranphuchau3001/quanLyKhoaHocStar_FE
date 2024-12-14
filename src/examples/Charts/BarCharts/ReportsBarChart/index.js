// ReportsBarChart.js
import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import fetchBarChartData, { months } from "layouts/dashboard/data/reportsBarChartData";
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
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import configs from "examples/Charts/BarCharts/ReportsBarChart/configs";
import YearSelect from "examples/Charts/BarCharts/ReportsBarChart/data/dataYearSelect";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ReportsBarChart({ color, title, description, date, chart, initialYear }) {
  const [selectedYear, setSelectedYear] = useState(initialYear || new Date().getFullYear());
  const [chartData, setChartData] = useState({
    labels: months,
    datasets: [
      {
        label: `Revenue (${selectedYear})`,
        data: months.map(() => 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  // Hàm thay đổi năm và lấy dữ liệu biểu đồ mới
  const handleYearChange = async (event) => {
    const year = Number(event.target.value);
    if (!year || isNaN(year)) return;

    setSelectedYear(year);
    try {
      const data = await fetchBarChartData(year);
      setChartData(data);
      // console.log("Data fetchBarChartData:", data);
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
              <Bar data={data} options={options} redraw />
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
                <YearSelect selectedYear={selectedYear} handleYearChange={handleYearChange} />
              </FormControl>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </Card>
  );
}

ReportsBarChart.defaultProps = {
  color: "info",
  description: "",
  initialYear: new Date().getFullYear(),
};

ReportsBarChart.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  date: PropTypes.string.isRequired,
  chart: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
  initialYear: PropTypes.number,
};

export default ReportsBarChart;
