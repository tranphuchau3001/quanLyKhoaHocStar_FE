import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
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
import YouTube from "react-youtube";

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
  const [canProceedToNext, setCanProceedToNext] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const videoRef = useRef(null);
  const { courseId } = useParams();
  const [progressSaved, setProgressSaved] = useState(false);
  const [totalLessons, setTotalLessons] = useState(0);
  const navigate = useNavigate();

  const completionPercentage = (completedLessons.size / totalLessons) * 100;

  const fetchUserProgress = async (moduleId) => {
    try {
      const response = await axios.get(
        "http://localhost:3030/api/v1/user-progress/getAllUserProgress"
      );
      // console.log("Call API getAllUserProgress OK");
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error("Error fetching lessons:", error);
      return [];
    }
  };

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

      const total = allLessons.reduce((sum, moduleLessons) => sum + moduleLessons.length, 0);
      setTotalLessons(total);

      const userId = localStorage.getItem("userId");
      if (userId) {
        const completedLessonsFromApi = await fetchUserProgressByUserIdAndCourseId(
          userId,
          courseId
        );
        setCompletedLessons(new Set(completedLessonsFromApi));
        // console.log("Các bài học đã hoàn thành:", completedLessonsFromApi);

        setNextVideo(allLessons, completedLessonsFromApi);
      }
    } catch (error) {
      console.error("Error calling API:", error.response ? error.response.data : error.message);
      setError("Không thể tải chi tiết khóa học. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  const saveUserProgress = async (lessonId) => {
    const userId = localStorage.getItem("userId");
    const status = "completed";

    if (!userId || !courseId || !lessonId) {
      console.error("Thông tin không đầy đủ để lưu tiến trình học tập.");
      return;
    }

    // console.log("Đang lưu tiến trình cho:", { userId, courseId, lessonId, status });

    try {
      const response = await axios.post(
        "http://localhost:3030/api/v1/user-progress/addUserProgress",
        {
          userId,
          courseId,
          lessonId,
          status,
        }
      );

      if (response.data.success) {
        // console.log("Tiến trình học tập đã được lưu thành công.");
        setCompletedLessons((prev) => new Set(prev).add(lessonId));
      } else {
        console.log("Tiến trình đã lưu:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi lưu tiến trình học tập:", error);
    }
  };

  const fetchUserProgressByUserIdAndCourseId = async (userId, courseId) => {
    try {
      const response = await axios.get(
        "http://localhost:3030/api/v1/user-progress/getUserProgressByUserIdAndCourseId",
        { params: { userId, courseId } }
      );

      if (response.data.success) {
        return response.data.data.map((progress) => progress.lessonId);
      } else {
        console.error("Không thể lấy tiến trình học:", response.data.message);
        return [];
      }
    } catch (error) {
      console.error("Lỗi khi gọi API lấy tiến trình học:", error);
      return [];
    }
  };

  const fetchProgress = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const completedLessonsFromApi = await fetchUserProgressByUserIdAndCourseId(userId, courseId);
    setCompletedLessons(new Set(completedLessonsFromApi));
    // console.log("Các bài học đã hoàn thành:", completedLessonsFromApi);

    // setNextVideo(lessons, completedLessonsFromApi);
  };

  const fetchCheckEnrollment = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const checkEnrollment = await axios.get(
        "http://localhost:3030/api/v1/enrollment/get-enrollment-by-user-id-and-course-id",
        {
          params: { userId, courseId },
        }
      );

      if (checkEnrollment.data.success) {
        const enrollment = checkEnrollment.data.data;
        const enrollmentId = enrollment.enrollmentId;
        const certificateUrl = "certificate_" + enrollmentId + ".pdf";
        const saveEnrollmentStatus = await axios.put(
          "http://localhost:3030/api/v1/enrollment/completeCourse",
          null,
          {
            params: {
              enrollmentId,
              certificateUrl,
            },
          }
        );

        if (saveEnrollmentStatus.data.success) {
          Swal.fire({
            title: "Thành công!",
            text: "Đã cấp chứng nhận hoàn thành khóa học: " + course.title + ". Kiểm tra ở ...",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Chứng nhận đã được cấp!",
            text: "Vui lòng kiểm tra ở ...",
            icon: "warning",
          });
        }
      }
    } catch (error) {
      console.error("Error checking enrollment or enrolling:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Có lỗi xảy ra khi cấp chứng nhận!",
      });
    }
  };

  const setNextVideo = async (allLessons, completedLessons) => {
    console.log("All Lessons:", allLessons);
    console.log("Completed Lessons:", completedLessons);

    if (allLessons.length > 0 && allLessons[0].length > 0) {
      const completedLessonIds = Array.from(completedLessons);
      const completedLessonsList = allLessons
        .flat()
        .filter((lesson) => completedLessonIds.includes(lesson.lessonId));

      // console.log("Bài học đã hoàn thành:", completedLessonsList);

      if (completedLessonsList.length > 0) {
        const lastCompletedLessonIndex = allLessons
          .flat()
          .findIndex(
            (lesson) =>
              lesson.lessonId === completedLessonsList[completedLessonsList.length - 1].lessonId
          );

        if (lastCompletedLessonIndex + 1 < allLessons.flat().length) {
          const nextLesson = allLessons.flat()[lastCompletedLessonIndex + 1];
          // console.log("Bài học tiếp theo:", nextLesson);
          setCurrentVideo(nextLesson.videoUrl);
          setSelectedVideoId(nextLesson.lessonId);
          setCurrentVideoIndex(lastCompletedLessonIndex + 1);
        } else {
          const firstLesson = allLessons[0][0];
          // console.log("Tất cả các bài học đã hoàn thành. Mở bài học đầu tiên:", firstLesson);
          setCurrentVideo(firstLesson.videoUrl);
          setSelectedVideoId(firstLesson.lessonId);
          setCurrentVideoIndex(0);
        }
      } else {
        const firstLesson = allLessons[0][0];
        // console.log("Không có bài học hoàn thành. Mở bài học đầu tiên:", firstLesson);
        setCurrentVideo(firstLesson.videoUrl);
        setSelectedVideoId(firstLesson.lessonId);
        setCurrentVideoIndex(0);
      }

      setOpen((prev) => {
        const newOpen = [...prev];
        newOpen[0] = true;
        return newOpen;
      });
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchCourse();
      await fetchProgress();

      const userId = localStorage.getItem("userId");
      if (!userId) {
        Swal.fire({
          title: "Bạn chưa đăng nhập!",
          text: "Vui lòng đăng nhập để tiếp tục. Bạn có muốn đăng nhập không?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/authentication/sign-in");
          } else if (result.isDismissed) {
            navigate("/home");
            console.log("Người dùng đã từ chối đăng nhập.");
          }
        });
        return;
      }
    };

    initializeData();
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
      setCurrentVideo(lesson.videoUrl);
      setSelectedVideoId(lesson.lessonId);
      setCurrentVideoIndex(lessons.flat().findIndex((l) => l.lessonId === lesson.lessonId));
      setCanProceedToNext(false);
      setProgressSaved(false);

      if (completedLessons.has(lesson.lessonId) && currentVideoIndex < lessons.flat().length - 1) {
        setCanProceedToNext(true);
      }
    }
    // console.log("index:" + videoId);
  };

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      handleVideoChange(lessons.flat()[currentVideoIndex - 1].lessonId);
    }
  };

  const handleNext = () => {
    if (currentVideoIndex < lessons.flat().length - 1 && canProceedToNext) {
      handleVideoChange(lessons.flat()[currentVideoIndex + 1].lessonId);
    }
  };

  const handleReceiveCertificate = () => {
    fetchCheckEnrollment();
  };

  const handleVideoStateChange = (event) => {
    const currentTime = event.target.getCurrentTime();
    const duration = event.target.getDuration();
    const progress = currentTime / duration;

    if (progress >= 0.8 && !progressSaved) {
      setCanProceedToNext(true);
      setProgressSaved(true);

      setCompletedLessons((prev) => {
        const newCompleted = new Set(prev);
        newCompleted.add(selectedVideoId);
        // console.log("selectedVideoId: " + selectedVideoId);
        return newCompleted;
      });

      setLessons((prevLessons) =>
        prevLessons.map((moduleLessons) =>
          moduleLessons.map((lesson) =>
            lesson.lessonId === selectedVideoId ? { ...lesson, status: "completed" } : lesson
          )
        )
      );

      saveUserProgress(selectedVideoId);
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
                  <MDBox
                    sx={{
                      position: "relative",
                      paddingTop: "56.25%",
                      overflow: "hidden",
                      width: "100%",
                      height: "0",
                    }}
                  >
                    <YouTube
                      videoId={currentVideo}
                      onStateChange={handleVideoStateChange}
                      opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: {
                          autoplay: 0,
                          rel: 0,
                          modestbranding: 1,
                        },
                      }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                      iframeProps={{
                        allow:
                          "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
                        sandbox: "allow-scripts allow-same-origin",
                      }}
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
                      disabled={
                        !canProceedToNext || currentVideoIndex === lessons.flat().length - 1
                      }
                      sx={{ marginRight: 2, padding: "10px 20px" }}
                    >
                      Bài tiếp theo <ArrowCircleRightOutlinedIcon sx={{ marginLeft: 1 }} />
                    </MDButton>
                    {completionPercentage === 100 && (
                      <MDButton
                        variant="contained"
                        color="success"
                        onClick={handleReceiveCertificate}
                        sx={{ padding: "10px 20px" }}
                      >
                        Nhận chứng nhận
                      </MDButton>
                    )}
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
                    <MDTypography variant="h5" color="light" textAlign="center">
                      Khóa Học: {course.title}
                    </MDTypography>
                  </MDBox>
                  <MDTypography color="success" sx={{ mt: 2, ml: 3 }}>
                    {course.description}
                  </MDTypography>
                  <MDTypography variant="body1" color="dark" sx={{ mt: 3, ml: 3 }}>
                    Tổng số bài học: {totalLessons}
                  </MDTypography>
                  <MDTypography variant="body1" color="dark" sx={{ ml: 3 }}>
                    Số bài học đã hoàn thành: {completedLessons.size} / {totalLessons}
                  </MDTypography>
                  <MDTypography variant="body1" color="dark" sx={{ ml: 3 }}>
                    Tiến độ hoàn thành: {completionPercentage.toFixed(0)}%
                  </MDTypography>
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
                                <ListItemButton
                                  key={lesson.lessonId}
                                  onClick={() => {
                                    // console.log("Selected Video ID:", selectedVideoId);
                                    // console.log("Completed Lessons:", completedLessons);
                                    // console.log("Can Proceed to Next:", canProceedToNext);
                                    // console.log("Current Video Index:", currentVideoIndex);
                                    // console.log("Lesson Index:", lessonIndex);

                                    const canClick =
                                      lesson.lessonId === selectedVideoId ||
                                      completedLessons.has(lesson.lessonId) ||
                                      (canProceedToNext &&
                                        lessonIndex === currentVideoIndex + 1 &&
                                        completedLessons.has(lesson.lessonId));

                                    // console.log("Can Click:", canClick);

                                    if (canClick) {
                                      handleVideoChange(lesson.lessonId);
                                    }
                                  }}
                                  disabled={
                                    !completedLessons.has(lesson.lessonId) &&
                                    lesson.lessonId !== selectedVideoId &&
                                    !(
                                      canProceedToNext &&
                                      lessonIndex <= currentVideoIndex &&
                                      completedLessons.has(lesson.lessonId)
                                    )
                                  }
                                  sx={{
                                    pl: 4,
                                    bgcolor:
                                      lesson.lessonId === selectedVideoId
                                        ? "rgba(76, 175, 80, 0.5)"
                                        : "transparent",
                                    opacity:
                                      lesson.lessonId === selectedVideoId
                                        ? 1
                                        : completedLessons.has(lesson.lessonId) ||
                                          (canProceedToNext &&
                                            lessonIndex === currentVideoIndex + 1)
                                        ? 1
                                        : 0.5,
                                  }}
                                >
                                  <ListItemText primary={lesson.title} />
                                  {completedLessons.has(lesson.lessonId) && (
                                    <MDTypography sx={{ color: "green", marginLeft: 1 }}>
                                      ✔
                                    </MDTypography>
                                  )}
                                </ListItemButton>
                              ))
                            ) : (
                              <MDTypography variant="body2" sx={{ ml: 5 }}>
                                Không có bài học
                              </MDTypography>
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
