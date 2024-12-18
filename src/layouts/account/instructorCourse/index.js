import React, { useRef, useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import bgImage from "assets/images/Background/background-Profile.png";
import imgLogo from "assets/images/logos/image.png";
import Navbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

import { Avatar, Card, CardContent, CardMedia, Grid, Paper, Divider, Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import apiClient from "api/apiClient";
import MDButton from "components/MDButton";
import SchedulePopup from "./popup/schedulePopup";

const ProfilePage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");
  const [courses, setCourses] = useState([]);
  const [openSchedulePopup, setOpenSchedulePopup] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const columns = scheduleData;
  const [selectedCourse, setSelectedCourse] = useState(null);

  // useEffect(() => {
  //   const storedName = localStorage.getItem("name");
  //   const storedRegistrationDate = localStorage.getItem("registrationDate");
  //   const storedUserId = localStorage.getItem("userId");

  //   if (storedName) setName(storedName);

  //   if (storedUserId && storedUserId !== "") {
  //     if (userId !== storedUserId) {
  //       setUserId(storedUserId);
  //     }
  //     fetchCourses(storedUserId);
  //   } else if (!isNavigating.current) {
  //     // console.error("Không có userId");
  //     Swal.fire({
  //       title: "Bạn chưa đăng nhập",
  //       text: "Bạn cần đăng nhập mới có thông tin. Bạn có muốn đăng nhập không?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: "Có",
  //       cancelButtonText: "Không",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         isNavigating.current = true;
  //         navigate("/authentication/sign-in");
  //       } else if (result.isDismissed) {
  //         // console.log("Người dùng đã từ chối đăng nhập.");
  //       }
  //     });
  //   }
  // }, [userId, navigate]);

  const fetchSchedules = async (courseId) => {
    if (!courseId) {
      console.error("courseId is undefined");
      return;
    }

    try {
      const response = await apiClient.get(
        `/api/v1/meet/getMeetingSchedulesByCourseId?courseId=${courseId}`
      );
      console.log("data lịch học", response.data);
      setScheduleData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      // console.error("userId is empty, cannot fetch courses");
      return;
    }
    // const fetchUserInfo = async () => {
    //   try {
    //     const response = await apiClient.get("/user-api/getUserByUserId", {
    //       params: { userId },
    //     });

    //     setUserInfo({
    //       name: response.data.data.name || null,
    //       phone: response.data.data.phone || null,
    //       avatarUrl: response.data.data.avatarUrl || null,
    //     });
    //     if (response.data.data.avatarUrl) {
    //       setAvatar(
    //         require(`../../../assets/images/avatar-Account/${response.data.data.avatarUrl}`)
    //       );
    //     }
    //   } catch (error) {
    //     console.error("Error fetching user info:", error);
    //   }
    // };

    // fetchUserInfo();

    const fetchCourses = async () => {
      try {
        const response = await apiClient.get(
          "/course-api/getCoursesByInstructorId??instructorId=",
          {
            params: { instructorId: userId },
          }
        );

        setCourses(response.data.data || []);
        console.log("Data", response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khóa học:", error);
      }
    };

    fetchCourses();
  }, [userId]);
  const handleScheduleClick = (course) => {
    if (course && course.courseId) {
      setCurrentCourseId(course.courseId);
      setSelectedCourse(course); // Sử dụng đúng biến course
      setOpenSchedulePopup(true);
      fetchSchedules(course.courseId);
    } else {
      console.log("Invalid courseId");
    }
  };

  const handleCloseSchedulePopup = () => {
    setOpenSchedulePopup(false);
  };

  return (
    <DashboardLayout>
      <Navbar />
      <Grid padding={3}>
        <MDTypography variant="h3">Khóa học đang quản lý</MDTypography>
        <MDTypography variant="body2" color="secondary">
          Quản lý khóa học bạn đang quản lý và có thể thêm lịch học cho khóa học này
        </MDTypography>
      </Grid>
      <Grid container spacing={3} padding={3}>
        {courses.map((course, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <MDBox
              className="course-item"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              {/* Hình ảnh */}
              <img
                src={
                  course.imgUrl
                    ? require(`assets/images/Background/background-course/${course.imgUrl}`)
                    : null
                }
                alt="Khóa học"
                className="course-image"
                style={{
                  width: "50%",
                  height: "180px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />

              {/* Nội dung chi tiết */}
              <MDBox
                className="course-details"
                style={{
                  width: "50%",
                  paddingLeft: "16px",
                }}
              >
                <MDTypography variant="h6" className="course-title">
                  {course.title}
                </MDTypography>
                <MDTypography
                  variant="body2"
                  className="course-description"
                  style={{ marginTop: "8px" }}
                >
                  {course.description}
                </MDTypography>
                <MDBox className="course-buttons" style={{ marginTop: "16px" }}>
                  <MDButton
                    variant="contained"
                    className="schedule-button"
                    onClick={() => handleScheduleClick(course)}
                    color="primary"
                  >
                    Lịch Học
                  </MDButton>
                  <MDButton
                    variant="contained"
                    className="students-button"
                    style={{ marginLeft: "8px" }}
                    color="secondary"
                  >
                    Học viên
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
          </Grid>
        ))}
      </Grid>
      <SchedulePopup
        open={openSchedulePopup}
        onClose={handleCloseSchedulePopup}
        courseData={scheduleData}
        selectedCourse={selectedCourse}
      />
    </DashboardLayout>
  );
};

export default ProfilePage;
