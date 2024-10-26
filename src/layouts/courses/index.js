import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, CardContent, Typography } from "@mui/material";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ListIcon from "@mui/icons-material/List";

function Courses() {
  const [open, setOpen] = useState({});

  const handleClick = (index) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index],
    }));
  };

  const items = [
    {
      label: "Giới thiệu",
      icon: <ListIcon />,
      content: "Thông tin về khóa học.",
    },
    {
      label: "Nội dung",
<<<<<<< HEAD
      icon: <ListIcon />,
=======
      icon: <InboxIcon />,
      // eslint-disable-next-line prettier/prettier
>>>>>>> main
      content: ["1. Tìm hiểu về HTML, CSS", "2. Làm quen với Dev tools", "3. Cài đặt VS Code"],
    },
    {
      label: "Bài tập",
<<<<<<< HEAD
      icon: <ListIcon />,
=======
      icon: <InboxIcon />,
      // eslint-disable-next-line prettier/prettier
>>>>>>> main
      content: ["1. Bài 1", "2. Bài 2"],
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <MDTypography variant="h5" color="white" textAlign="center">
                      Khóa Học: tên khóa học
                    </MDTypography>
                  </MDBox>
                  <MDTypography sx={{ mt: 2, ml: 3, mb: 3 }}>Mô tả</MDTypography>
                  <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Nội dung khóa học
                      </ListSubheader>
                    }
                  >
                    {items.map((item, index) => (
                      <div key={index}>
                        <ListItemButton onClick={() => handleClick(index)}>
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.label} />
                          {open[index] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={open[index]} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            {Array.isArray(item.content) ? (
                              item.content.map((subItem, subIndex) => (
                                <ListItemButton key={subIndex} sx={{ pl: 4 }}>
                                  <ListItemText primary={subItem} />
                                </ListItemButton>
                              ))
                            ) : (
                              <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary={item.content} />
                              </ListItemButton>
                            )}
                          </List>
                        </Collapse>
                      </div>
                    ))}
                  </List>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardMedia
                    sx={{ height: { xs: 200, sm: 300 } }}
                    image={require("assets/images/html-css.png")}
                    title="Khóa học HTML-CSS"
                  />
                  <CardContent>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Box display="flex" alignItems="center">
                          <GroupsOutlinedIcon />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            10 thành viên
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Box display="flex" alignItems="center">
                          <PlayCircleOutlineIcon />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            10 video
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Box display="flex" alignItems="center">
                          <AccessTimeIcon />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            10 giờ 45 phút
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <MDBox mt={4} mb={1}>
                      <MDButton
                        href="http://localhost:3000/learning"
                        variant="gradient"
                        color="success"
                        fullWidth
                      >
                        Đăng ký học
                      </MDButton>
                    </MDBox>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Để biết thêm thông tin chi tiết và nhận hỗ trợ vui lòng liên hệ với Star Dev
                      qua email hoặc số điện thoại
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Courses;
