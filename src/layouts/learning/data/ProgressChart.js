import React from "react";
import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ProgressChart({ completionPercentage }) {
  const data = {
    labels: ["Hoàn thành", "Chưa hoàn thành"],
    datasets: [
      {
        data: [completionPercentage, 100 - completionPercentage],
        backgroundColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        hoverBackgroundColor: ["rgba(75, 192, 192, 0.8)", "rgba(255, 99, 132, 0.8)"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(1)}%`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Pie data={data} options={options} />
    </div>
  );
}

ProgressChart.propTypes = {
  completionPercentage: PropTypes.number.isRequired,
};

export default ProgressChart;
