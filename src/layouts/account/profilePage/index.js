import React from "react";
import PageLayout from "examples/LayoutContainers/PageLayout";
import bgImage from "assets/images/Background/background-Profile.png";
import imgLogo from "assets/images/logos/image.png";
import Navbar from "examples/Navbars/DashboardNavbar";
import {
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "./profille.scss";

const ProfilePage = () => {
  return (
    <PageLayout>
      <Navbar />
      <Box className="profile-page__header" textAlign="center" pb={5} mt={2}>
        <img
          src={bgImage}
          alt="Background"
          className="profile-page__background"
          style={{
            height: "270px",
            width: "70%",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
        <Avatar
          src={imgLogo}
          alt="Avatar"
          className="profile-page__avatar"
          sx={{
            width: 120,
            height: 120,
            border: "4px solid #fff",
            margin: "0 auto",
            mt: -7,
          }}
        />
        <Typography variant="h5" className="profile-page__name" mt={2}>
          Lê Thanh Tùng
        </Typography>
      </Box>
      <Box className="profile-page__content" display="flex" justifyContent="center" p={3}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Giới thiệu
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                Thành viên của Start Dev vào
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Hoạt động gần đây</Typography>
              <Typography variant="body2" color="textSecondary">
                Chưa có hoạt động gần đây
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" mb={2}>
                Các khóa học đã tham gia
              </Typography>
              {[1, 2, 3].map((course, index) => (
                <Card sx={{ display: "flex", alignItems: "center", mb: 2 }} key={index}>
                  <Grid container alignItems="center">
                    <Grid item xs={4} padding={1}>
                      {" "}
                      <CardMedia
                        component="img"
                        sx={{
                          width: "100%",
                          height: 80,
                          borderRadius: 2,
                          height: 100,
                          marginTop: 0,
                          marginBottom: 1,
                        }}
                        image={bgImage}
                        alt="Course"
                      />
                    </Grid>
                    <Grid item xs={8}>
                      {" "}
                      <CardContent sx={{ paddingLeft: "16px" }}>
                        <Typography variant="h6">HTML CSS từ Zero đến Hero</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Trong khóa này chúng ta sẽ cùng nhau xây dựng giao diện 2 trang web là The
                          Band & Shopee.
                        </Typography>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </PageLayout>
  );
};

export default ProfilePage;
