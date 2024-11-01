import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListIcon from "@mui/icons-material/List";
import PageLayout from "examples/LayoutContainers/PageLayout";
import MDButton from "components/MDButton";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";

function Learning() {
  const [open, setOpen] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
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

      if (allLessons.length > 0 && allLessons[0].length > 0) {
        const firstLesson = allLessons[0][0];
        setCurrentVideo(`https://www.youtube.com/embed/${firstLesson.videoUrl}`);
        setSelectedVideoId(firstLesson.lessonId);
        setCurrentVideoIndex(0);
        setOpen((prev) => {
          const newOpen = [...prev];
          newOpen[0] = true;
          return newOpen;
        });
      }
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

  const handleVideoChange = (videoId) => {
    const lesson = lessons.flat().find((lesson) => lesson.lessonId === videoId);
    if (lesson) {
      setCurrentVideo(`https://www.youtube.com/embed/${lesson.videoUrl}`);
      setSelectedVideoId(lesson.lessonId);
      setCurrentVideoIndex(lessons.flat().findIndex((l) => l.lessonId === lesson.lessonId));
    }
  };

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      handleVideoChange(lessons.flat()[currentVideoIndex - 1].lessonId);
    }
  };

  const handleNext = () => {
    if (currentVideoIndex < lessons.flat().length - 1) {
      handleVideoChange(lessons.flat()[currentVideoIndex + 1].lessonId);
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!course) {
    return <div>Không tìm thấy khóa học.</div>;
  }

  return (
    <PageLayout>
      <DefaultNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} pt={6}>
          <Grid item xs={12}>
            <Grid container spacing={6} padding={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <MDBox sx={{ position: "relative", paddingTop: "56.25%" }}>
                    <iframe
                      title="Video giới thiệu"
                      src={currentVideo}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                      frameBorder="0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </MDBox>
                  <MDBox
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}
                  >
                    <MDButton
                      variant="contained"
                      color="info"
                      onClick={handlePrevious}
                      disabled={currentVideoIndex === 0}
                      sx={{ marginRight: 2, padding: "10px 20px" }}
                    >
                      <ArrowCircleLeftOutlinedIcon sx={{ marginRight: 1 }} /> Bài trước
                    </MDButton>
                    <MDButton
                      variant="contained"
                      color="info"
                      onClick={handleNext}
                      disabled={currentVideoIndex === lessons.flat().length - 1}
                      sx={{ padding: "10px 20px" }}
                    >
                      Bài tiếp theo <ArrowCircleRightOutlinedIcon sx={{ marginLeft: 1 }} />
                    </MDButton>
                  </MDBox>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
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
                          <MDTypography variant="body2" fontWeight="bold">
                            {module.title}
                          </MDTypography>
                          {open[index] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={open[index]} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            {lessons[index] && lessons[index].length > 0 ? (
                              lessons[index].map((lesson, lessonIndex) => (
                                <ListItemButton
                                  key={lesson.lessonId}
                                  sx={{
                                    pl: 4,
                                    backgroundColor:
                                      currentVideoIndex ===
                                      lessons
                                        .flat()
                                        .findIndex((l) => l.lessonId === lesson.lessonId)
                                        ? "lightblue"
                                        : "transparent",
                                  }}
                                  onClick={() => handleVideoChange(lesson.lessonId)}
                                >
                                  <MDTypography variant="body2">
                                    {`${lessonIndex + 1}. ${lesson.title}`}
                                  </MDTypography>
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
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </PageLayout>
  );
}

export default Learning;
