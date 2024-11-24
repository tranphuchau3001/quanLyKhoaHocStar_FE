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

// Data
import adminTableData from "layouts/admin/admin-account-manager/data/adminTableData";
import lecturerTableData from "layouts/admin/admin-account-manager/data/lecturerTableData";
import userTableData from "layouts/admin/admin-account-manager/data/userTableData";
import { useState } from "react";

function AdminAccountManager() {
  const { columns, rows } = adminTableData();
  const { columns: lColumns, rows: lRows } = lecturerTableData();
  const { columns: pColumns, rows: pRows } = userTableData();

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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
                <Tab label="Admin" />
                <Tab label="Giảng viên" />
                <Tab label="Người dùng" />
              </Tabs>
              <MDBox pt={3}>
                {activeTab === 0 && (
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
                {activeTab === 1 && (
                  <DataTable
                    table={{ columns: lColumns, rows: lRows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
                {activeTab === 2 && (
                  <DataTable
                    table={{ columns: pColumns, rows: pRows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
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
