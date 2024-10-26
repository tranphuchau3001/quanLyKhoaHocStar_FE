import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import styles from "./Statistical.module.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Đăng ký các thành phần
ChartJS.register(ArcElement, Tooltip, Legend);

// eslint-disable-next-line react/prop-types
const Tab = ({ activeTab, tab, onClick, nameTab }) => (
  <button className={activeTab === tab ? styles.active : ""} onClick={() => onClick(tab)}>
    {nameTab}
  </button>
);

// eslint-disable-next-line react/prop-types
const TabContent = ({ activeTab }) => {
  const days = ["1/10", "2/10", "3/10", "4/10", "5/10"];
  const revenueData = [4000000, 5000000, 6000000, 3000000, 8000000];
  const totalRevenue = revenueData.reduce((acc, curr) => acc + curr, 0);
  const formattedTotalRevenue = totalRevenue
    .toLocaleString("vi-VN", { minimumFractionDigits: 0 })
    .replace("₫", "VNĐ");
  const barData = {
    labels: days,
    datasets: [
      {
        label: "Doanh thu: (Triệu VNĐ)",
        data: revenueData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const gender = ["Nữ", "Nam"];
  const revenueGenderData = [299, 1000];
  const totalGenderRevenue = revenueGenderData.reduce((acc, curr) => acc + curr, 0);

  const pieData = {
    labels: gender,
    datasets: [
      {
        label: "Số lượng",
        data: revenueGenderData,
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)"],
        borderColor: "rgba(255, 255, 255, 1)",
        borderWidth: 2,
      },
    ],
  };

  switch (activeTab) {
    case "Tab1":
      return (
        <div>
          <div className={styles.headerTab}>
            <h3>Tổng doanh thu: {formattedTotalRevenue} VNĐ </h3>
            <h3>Tháng: {days[0].split("/")[1]} </h3>
          </div>
          <Bar data={barData} />
        </div>
      );
    case "Tab2":
      return (
        <div>
          <div className={styles.headerTab}>
            <h2>Số lượng đăng ký:{totalGenderRevenue}</h2>
            <h3>Tháng: {days[0].split("/")[1]} </h3>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ width: "500px", height: "500px" }}>
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

function Statistical() {
  const [activeTab, setActiveTab] = useState("Tab1");

  return (
    <DashboardLayout>
      <div className="container">
        <div>
          <div>
            <Tab activeTab={activeTab} tab="Tab1" onClick={setActiveTab} nameTab="Doanh thu" />
            <Tab activeTab={activeTab} tab="Tab2" onClick={setActiveTab} nameTab="Người tham gia" />
          </div>
          <TabContent activeTab={activeTab} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Statistical;
