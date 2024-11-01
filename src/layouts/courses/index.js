import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, CardContent, ListItemIcon, Typography } from "@mui/material";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ListIcon from "@mui/icons-material/List";

function CourseDetail() {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [open, setOpen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams();

  const fetchLessons = async (moduleId) => {
    try {
      const response = await axios.get("http://localhost:3030/api/v1/lesson/getLessonsByModuleId", {
        params: { moduleId },
      });
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error("Error fetching lessons:", error);
      return [];
    }
  };

  const fetchCourse = async () => {
    try {
      const courseResponse = await axios.get("http://localhost:3030/course-api/getCourseById", {
        params: { courseId },
      });
      setCourse(courseResponse.data.data);

      const modulesResponse = await axios.get(
        "http://localhost:3030/api/v1/module/getModulesByCourseId",
        {
          params: { courseId },
        }
      );
      setModules(modulesResponse.data.data);
      setOpen(new Array(modulesResponse.data.data.length).fill(false));

      const allLessons = await Promise.all(
        modulesResponse.data.data.map((module) => fetchLessons(module.moduleId))
      );
      setLessons(allLessons);
      setLoading(false);
    } catch (error) {
      console.error("Error calling API:", error.response ? error.response.data : error.message);
      setError("Không thể tải chi tiết khóa học. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const handleClick = (index) => {
    setOpen((prevOpen) => {
      const newOpen = [...prevOpen];
      newOpen[index] = !newOpen[index];
      return newOpen;
    });
  };

  // Tổng số bài học của khóa học
  const totalLessons = lessons.reduce(
    (total, lessonArray) => total + (lessonArray ? lessonArray.length : 0),
    0
  );

  // Tổng thời gian video của khóa học
  const totalDuration = lessons.reduce((total, lessonArray) => {
    return (
      total + (lessonArray ? lessonArray.reduce((sum, lesson) => sum + lesson.duration, 0) : 0)
    );
  }, 0);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!course) {
    return <div>Không tìm thấy khóa học.</div>;
  }

  const imagePath = course.imgUrl
    ? require(`assets/images/Background/background-course/${course.imgUrl}`)
    : require(`assets/images/Background/background-course/java.jpg`);

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
                      Khóa Học: {course.title}
                    </MDTypography>
                  </MDBox>
                  <MDTypography sx={{ mt: 2, ml: 3, mb: 3 }}>{course.description}</MDTypography>
                  <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Nội dung khóa học
                      </ListSubheader>
                    }
                  >
                    {modules.map((module, index) => (
                      <div key={module.moduleId}>
                        <ListItemButton onClick={() => handleClick(index)}>
                          <ListItemIcon>
                            <ListIcon />
                          </ListItemIcon>
                          <ListItemText primary={module.title} />
                          {open[index] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={open[index]} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            {lessons[index] && lessons[index].length > 0 ? (
                              lessons[index].map((lesson, lessonIndex) => (
                                <ListItemButton key={lesson.lessonId} sx={{ pl: 4 }}>
                                  <ListItemText primary={`${lessonIndex + 1}. ${lesson.title}`} />
                                </ListItemButton>
                              ))
                            ) : (
                              <ListItemText primary="Không có bài học nào." sx={{ pl: 4 }} />
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
                    image={imagePath}
                    title={`Khóa học ${course.title || "Khóa học không xác định"}`}
                  />
                  <CardContent>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Box display="flex" alignItems="center">
                          <GroupsOutlinedIcon />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {course.participantCount || "Thông tin không có"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Box display="flex" alignItems="center">
                          <PlayCircleOutlineIcon />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {totalLessons + " video" || "Thông tin không có"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Grid item>
                          <Box display="flex" alignItems="center">
                            <AccessTimeIcon />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {totalDuration > 0
                                ? totalDuration < 3600
                                  ? `${Math.floor(totalDuration / 60)} phút ${
                                      totalDuration % 60
                                    } giây`
                                  : `${Math.floor(totalDuration / 3600)} giờ ${Math.floor(
                                      (totalDuration % 3600) / 60
                                    )} phút`
                                : "Thông tin không có"}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    <MDBox mt={4} mb={1}>
                      <MDButton
                        href={`http://localhost:3000/learning/${courseId}`}
                        variant="gradient"
                        color="success"
                        fullWidth
                      >
                        Đăng ký học
                      </MDButton>
                    </MDBox>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Để biết thêm thông tin chi tiết và nhận hỗ trợ vui lòng liên hệ với Star Dev
                      qua email hoặc số điện thoại.
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

export default CourseDetail;
