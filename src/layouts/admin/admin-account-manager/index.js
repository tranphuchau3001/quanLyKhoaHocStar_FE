import React, { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Custom Data Fetch and Row Generation
import { fetchData } from "layouts/admin/admin-account-manager/data/fetchData/fetchData";
import { generateRows } from "layouts/admin/admin-account-manager/data/generateRows";
import avt from "assets/images/favicon.png";
function AdminAccountManager() {
  const [users, setUsers] = useState({ admin: [], lecturer: [], student: [] });
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchData(setUsers);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEdit = (user) => {
    setSelectedAccount(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAccount(null);
  };

  const commonColumns = [
    { Header: "STT", accessor: "stt", width: "5%", align: "center" },
    { Header: "Họ tên", accessor: "fullName", width: "25%", align: "left" },
    { Header: "Vai trò", accessor: "role", align: "center" },
    { Header: "Số điện thoại", accessor: "phone", align: "center" },
    { Header: "Trạng thái", accessor: "status", align: "center" },
    { Header: "Hành động", accessor: "action", align: "center" },
  ];

  const tabs = [
    { label: "Admin", data: users.admin, badgeColor: "primary", roleLabel: "Admin" },
    { label: "Giảng viên", data: users.lecturer, badgeColor: "info", roleLabel: "Giảng viên" },
    { label: "Người dùng", data: users.student, badgeColor: "success", roleLabel: "Học viên" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-4}
                mb={2}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h5" color="white" textAlign="center">
                  Quản lý tài khoản
                </MDTypography>
              </MDBox>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                {tabs.map((tab, index) => (
                  <Tab key={index} label={tab.label} />
                ))}
              </Tabs>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: commonColumns,
                    rows: generateRows(
                      tabs[activeTab].data,
                      tabs[activeTab].badgeColor,
                      tabs[activeTab].roleLabel,
                      handleEdit,
                      avt,
                      open,
                      handleClose,
                      selectedAccount,
                      () => fetchData(setUsers)
                    ),
                  }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AdminAccountManager;
