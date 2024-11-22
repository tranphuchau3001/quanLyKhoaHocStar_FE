import React, { useRef, useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import bgImage from "assets/images/Background/background-Profile.png";
import imgLogo from "assets/images/logos/image.png";
import Navbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
  const [name, setName] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [userId, setUserId] = useState("");
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const isNavigating = useRef(false);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedRegistrationDate = localStorage.getItem("registrationDate");
    const storedUserId = localStorage.getItem("userId");

    if (storedName) setName(storedName);
    if (storedRegistrationDate) setRegistrationDate(storedRegistrationDate);

    if (storedUserId && storedUserId !== "") {
      if (userId !== storedUserId) {
        setUserId(storedUserId);
      }
      fetchCourses(storedUserId);
    } else if (!isNavigating.current) {
      console.error("Không có userId");
      Swal.fire({
        title: "Bạn chưa đăng nhập",
        text: "Bạn cần đăng nhập mới có thông tin. Bạn có muốn đăng nhập không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then((result) => {
        if (result.isConfirmed) {
          isNavigating.current = true;
          navigate("/authentication/sign-in");
        } else if (result.isDismissed) {
          console.log("Người dùng đã từ chối đăng nhập.");
        }
      });
    }
  }, [userId, navigate]);

  const fetchCourses = async () => {
    if (!userId) {
      console.error("userId is empty, cannot fetch courses");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3030/api/v1/enrollment/getEnrollmentByUserId?userId=${userId}`
      );
      if (!response.ok) {
        console.error("Network response was not ok:", response.status);
        return;
      }

      const result = await response.json();
      console.log(result.data);
      if (result.success) {
        setCourses(result.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleCourseClick = async (courseId) => {
    navigate(`/learning/${courseId}`);
  };

  return (
    <DashboardLayout>
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
          {name || "Tên chưa được cập nhật"}
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
                Thành viên của Start Dev vào{" "}
                {new Date(registrationDate).toLocaleDateString() || "Ngày chưa được cập nhật"}
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
              {courses.map((course, index) => {
                const imagePath = require(`assets/images/Background/background-course/${course.imgUrl}`);
                return (
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
                          image={imagePath}
                          alt="Course"
                          onClick={() => handleCourseClick(course.courseId)}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        {" "}
                        <CardContent sx={{ paddingLeft: "16px" }}>
                          <Typography variant="h6">{course.courseName}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {course.description}
                          </Typography>
                        </CardContent>
                      </Grid>
                    </Grid>
                  </Card>
                );
              })}
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </DashboardLayout>
  );
};

export default ProfilePage;
