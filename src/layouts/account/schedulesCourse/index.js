import React, { useRef, useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Navbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

import { Avatar, Card, CardContent, CardMedia, Grid, Paper, Divider, Button } from "@mui/material";
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
      console.error("userId is empty, cannot fetch courses");
      return;
    }

    const fetchCourses = async () => {
      console.log("User ID:", userId);

      try {
        // Gọi API đầu tiên để lấy danh sách enrollments
        const enrollmentResponse = await apiClient.get("/api/v1/enrollment/getEnrollmentByUserId", {
          params: { userId: userId },
        });

        const enrollments = enrollmentResponse.data.data || [];
        console.log("Enrollments:", enrollments);

        // Duyệt qua từng enrollment để lấy thông tin chi tiết khóa học
        const validCourses = await Promise.all(
          enrollments.map(async (enrollment) => {
            try {
              // Gọi API lấy thông tin chi tiết khóa học
              const courseResponse = await apiClient.get("/course-api/getCourseById", {
                params: { courseId: enrollment.courseId },
              });

              const course = courseResponse.data.data;

              // Chỉ lấy các khóa học có giá > 0
              if (course.price > 0) {
                return {
                  ...enrollment, // Dữ liệu từ API đầu tiên
                  ...course, // Dữ liệu từ API thứ hai
                };
              } else {
                console.warn(
                  `Khóa học với courseId=${enrollment.courseId} có giá trị không hợp lệ.`
                );
                return null; // Loại bỏ nếu price <= 0
              }
            } catch (error) {
              console.error(
                `Lỗi khi lấy thông tin khóa học với courseId=${enrollment.courseId}`,
                error
              );
              return null; // Nếu lỗi, trả về null
            }
          })
        );

        // Lọc ra các khóa học hợp lệ (loại bỏ null hoặc undefined)
        const filteredCourses = validCourses.filter(
          (course) => course !== null && course !== undefined
        );
        setCourses(filteredCourses);

        console.log("Filtered Courses:", filteredCourses);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khóa học:", error);
      }
    };

    fetchCourses();
  }, [userId]); // Chạy lại khi userId thay đổi

  const handleSchedulesClick = (course) => {
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
        <MDTypography variant="h3">Lịch Học</MDTypography>
        <MDTypography variant="body2" color="secondary">
          Bạn có thể xem các lịch học của khóa học đã tham gia ở trang này
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
                    className="students-button"
                    style={{ marginLeft: "80px" }}
                    color="primary"
                    onClick={() => handleSchedulesClick(course)}
                  >
                    Xem lịch học
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
