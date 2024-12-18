import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import {
  getCourseById,
  getModulesByCourseId,
  getLessonsByModuleId,
  getQuizByModuleId,
  getQuestionsByQuizId,
  getChoicesByQuestionId,
  addUserProgress,
  getUserProgress,
  saveSubmissionHistory,
  getSubmissionHistories,
  getEnrollmentsByUserId,
} from "layouts/learning2/data/api";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import {
  Card,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  CircularProgress,
  ListSubheader,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import PageLayout from "examples/LayoutContainers/PageLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import MDButton from "components/MDButton";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ListIcon from "@mui/icons-material/List";
import YouTube from "react-youtube";
import apiClient from "api/apiClient";

const Learning2 = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [modules, setModules] = useState([]);
  const [moduleDetails, setModuleDetails] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isCourseAvailable, setIsCourseAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openModules, setOpenModules] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [progressRecorded, setProgressRecorded] = useState(false);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [completedQuizzesCount, setCompletedQuizzesCount] = useState(0);
  const [viewTime, setViewTime] = useState(0);
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  let intervalId = useRef(null);

  const totalLessons = moduleDetails.reduce((total, module) => total + module.lessons.length, 0);
  const totalQuizzes = moduleDetails.reduce((total, module) => total + module.quiz.length, 0);
  const completionPercentage =
    ((completedLessonsCount + completedQuizzesCount) / (totalLessons + totalQuizzes)) * 100;

  const handleToggleModule = (index) => {
    setOpenModules((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const startViewTime = () => {
    if (intervalId.current) return;
    intervalId.current = setInterval(() => {
      setViewTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopViewTime = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  };

  const formatViewTime = (timeInSeconds) => {
    if (timeInSeconds < 60) {
      return `${timeInSeconds} giây`;
    } else if (timeInSeconds < 3600) {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes} phút ${seconds} giây`;
    } else if (timeInSeconds < 86400) {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      return `${hours} giờ ${minutes} phút`;
    } else {
      const days = Math.floor(timeInSeconds / 86400);
      const hours = Math.floor((timeInSeconds % 86400) / 3600);
      return `${days} ngày ${hours} giờ`;
    }
  };

  const handleSelectVideo = (lessonId) => {
    setSelectedQuiz(null);
    stopViewTime();

    const lessons = moduleDetails.flatMap((module) => module.lessons);
    const currentIndex = lessons.findIndex((lesson) => lesson.lessonId === lessonId);

    if (currentIndex === -1) return;

    if (currentIndex > 0) {
      const previousLesson = lessons[currentIndex - 1];
      if (!previousLesson.completed) {
        Swal.fire({
          title: "Không thể mở!",
          text: "Bạn cần hoàn thành bài học trước đó để tiếp tục!",
          icon: "warning",
        });
        return;
      }
    }

    setSelectedVideo(lessonId);
  };

  const handleSelectAnswer = (questionId, choiceId) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: choiceId,
    }));
  };

  const handleSubmitQuiz = () => {
    const incorrectAnswers = selectedQuiz.questions.filter((question) => {
      const userAnswer = userAnswers[question.questionId];
      const correctChoice = question.choices.find((choice) => choice.isCorrect);

      // console.log("Câu trả lời người dùng:", userAnswer);
      // console.log("Câu trả lời đúng:", correctChoice?.choiceId);

      return Number(userAnswer) !== Number(correctChoice?.choiceId);
    });

    if (incorrectAnswers.length > 0) {
      setErrorMessage(`Bạn đã trả lời sai ${incorrectAnswers.length} câu. Vui lòng kiểm tra lại!`);
      setSuccessMessage(null);
      setQuizResult(false);
    } else {
      setErrorMessage(null);
      setSuccessMessage(`Chúc mừng bạn đã hoàn thành quiz này! 🎉`);
      setQuizResult(true);
      saveQuizProgress(selectedQuiz.quizId, 10.0);
    }
  };

  const handleReceiveCertificate = () => {
    setIsLoading(true);
    fetchCheckEnrollment();
  };

  const handleNextLesson = () => {
    const lessons = moduleDetails.flatMap((module) => module.lessons);
    const currentIndex = lessons.findIndex((lesson) => lesson.lessonId === selectedVideo);

    if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];

      if (nextLesson.completed || progressRecorded || lessons[currentIndex].completed) {
        setSelectedVideo(nextLesson.lessonId);
        setProgressRecorded(false);
      } else {
        alert("Bạn cần hoàn thành bài học hiện tại để tiếp tục!");
      }
    }
  };

  const handlePreviousLesson = () => {
    const lessons = moduleDetails.flatMap((module) => module.lessons);
    const currentIndex = lessons.findIndex((lesson) => lesson.lessonId === selectedVideo);

    if (currentIndex === -1) return;

    const previousLessonIndex = currentIndex - 1;

    if (previousLessonIndex >= 0) {
      const previousLesson = lessons[previousLessonIndex];
      if (previousLesson.completed) {
        setSelectedVideo(previousLesson.lessonId);
      } else {
        alert("Bạn cần hoàn thành bài học hiện tại trước khi quay lại!");
      }
    }
  };

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const course = await getCourseById(courseId);
      setCourseDetails(course);

      const modulesData = await getModulesByCourseId(courseId);
      setModules(modulesData);

      const userId = localStorage.getItem("userId");
      const userProgress = await getUserProgress(userId, courseId);
      const submissionHistories = await getSubmissionHistories(userId, courseId);

      const moduleDataWithDetails = await Promise.all(
        modulesData.map(async (module) => {
          const lessons = await getLessonsByModuleId(module.moduleId);

          lessons.forEach((lesson) => {
            lesson.completed = userProgress.some(
              (progress) => progress.lessonId === lesson.lessonId && progress.status === "completed"
            );
          });

          const completedLessonsCount = lessons.filter((lesson) => lesson.completed).length;
          const totalLessons = lessons.length;

          const quiz = await getQuizByModuleId(module.moduleId);

          quiz.forEach((quiz) => {
            quiz.completed = submissionHistories.some(
              (quizes) => quizes.quizId === quiz.quizId && quizes.assignmentStatus === true
            );
          });
          const quizDetails = await Promise.all(
            quiz.map(async (quizItem) => {
              const questions = await getQuestionsByQuizId(quizItem.quizId);
              const questionsWithChoices = await Promise.all(
                questions.map(async (question) => {
                  const choices = await getChoicesByQuestionId(question.questionId);
                  return { ...question, choices };
                })
              );
              return { ...quizItem, questions: questionsWithChoices };
            })
          );

          return {
            ...module,
            lessons,
            completedLessonsCount,
            totalLessons,
            quiz: quizDetails,
          };
        })
      );

      setModuleDetails(moduleDataWithDetails);

      const lessons = moduleDataWithDetails.flatMap((module) => module.lessons);

      const firstIncompleteLesson = lessons.find((lesson) => !lesson.completed);
      const firstLesson = lessons[0];

      if (firstIncompleteLesson) {
        setSelectedVideo(firstIncompleteLesson.lessonId);
      } else {
        setSelectedVideo(firstLesson.lessonId);
      }

      const moduleIndex = moduleDataWithDetails.findIndex((module) =>
        module.lessons.some(
          (lesson) => lesson.lessonId === (firstIncompleteLesson?.lessonId || firstLesson.lessonId)
        )
      );

      if (moduleIndex !== -1) {
        handleToggleModule(moduleIndex);
      }

      const completedCount = lessons.filter((lesson) => lesson.completed).length;
      setCompletedLessonsCount(completedCount);

      const totalCompletedQuizzes = moduleDataWithDetails.reduce((count, module) => {
        return count + module.quiz.filter((quiz) => quiz.completed).length;
      }, 0);

      setCompletedQuizzesCount(totalCompletedQuizzes);
    } catch (error) {
      console.error("Error fetching course data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuiz = async (quiz) => {
    try {
      const questions = await getQuestionsByQuizId(quiz.quizId);
      const questionsWithChoices = await Promise.all(
        questions.map(async (question) => {
          const choices = await getChoicesByQuestionId(question.questionId);
          return { ...question, choices };
        })
      );
      setSelectedQuiz({ ...quiz, questions: questionsWithChoices });
      setSelectedVideo(null);
      setErrorMessage(null);
      setSuccessMessage(null);
      stopViewTime();
    } catch (error) {
      console.error("Error loading quiz details:", error.message);
    }
  };

  const fetchCheckEnrollment = async () => {
    const userId = localStorage.getItem("userId");
    // console.log("courseId: " + courseId);
    try {
      const checkEnrollment = await apiClient.get(
        "/api/v1/enrollment/get-enrollment-by-user-id-and-course-id",
        {
          params: { userId, courseId },
        }
      );

      if (checkEnrollment.data.success) {
        const enrollment = checkEnrollment.data.data;
        if (enrollment.status == "completed") {
          Swal.fire({
            title: "Chứng nhận đã được cấp!",
            text: "Vui lòng kiểm tra ở trang thông tin tài khoản",
            icon: "warning",
          });
          setIsLoading(false);
          return;
        }
        // console.log("status", enrollment.status);
        const enrollmentId = enrollment.enrollmentId;
        const certificateUrl = "certificate_" + enrollmentId + ".pdf";
        const saveEnrollmentStatus = await apiClient.put(
          "/api/v1/enrollment/completeCourse",
          null,
          {
            params: {
              enrollmentId,
              certificateUrl,
            },
          }
        );

        if (saveEnrollmentStatus.data.success) {
          // console.log("Cấp chứng nhận thành công");
          Swal.fire({
            title: "Thành công!",
            text: "Đã cấp chứng nhận hoàn thành khóa học. Kiểm tra ở trang thông tin tài khoản",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Chứng nhận đã được cấp!",
            text: "Vui lòng kiểm tra ở trang thông tin tài khoản",
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const data = await getEnrollmentsByUserId(userId);
      setEnrollments(data);

      // console.log("Danh sách đăng ký:", data);

      const courseExists = data.some((enrollment) => enrollment.courseId === parseInt(courseId));

      // console.log("Is course available:", courseExists);
      if (!courseExists) {
        navigate(`/courses/${courseId}`);
        Swal.fire({
          title: "Bạn chưa đăng ký khóa học này!",
          text: "Vui lòng đăng ký khóa học để tiếp tục.",
          icon: "warning",
        });
        return;
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async () => {
    if (progressRecorded) return;
    // setProgressRecorded(true);

    try {
      const userId = localStorage.getItem("userId");
      const lesson = moduleDetails
        .flatMap((module) => module.lessons)
        .find((lesson) => lesson.lessonId === selectedVideo);

      if (!userId || !lesson) return;

      const userProgress = await getUserProgress(userId, courseId);
      const isAlreadyCompleted = userProgress.some(
        (progress) => progress.lessonId === lesson.lessonId && progress.status === "completed"
      );

      if (isAlreadyCompleted) {
        // console.log("Tiến độ bài học này đã được lưu trước đó.");
        return;
      }

      await addUserProgress({
        userId,
        courseId,
        lessonId: lesson.lessonId,
        status: "completed",
      });

      setModuleDetails((prevDetails) => {
        const updatedDetails = prevDetails.map((module) => {
          const updatedLessons = module.lessons.map((l) =>
            l.lessonId === lesson.lessonId ? { ...l, completed: true } : l
          );

          const completedCount = updatedLessons.filter((l) => l.completed).length;

          return {
            ...module,
            lessons: updatedLessons,
            completedLessonsCount: completedCount,
          };
        });

        const totalCompletedLessons = updatedDetails
          .flatMap((module) => module.lessons)
          .filter((lesson) => lesson.completed).length;

        setCompletedLessonsCount(totalCompletedLessons);

        return updatedDetails;
      });

      // console.log("Tiến độ đã được lưu và cập nhật trạng thái.");
    } catch (error) {
      console.error("Lỗi khi lưu tiến độ:", error.message);
    }
  };

  const saveQuizProgress = async (quizId, score) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId || !courseId || !quizId) return;

      const submissionHistories = await getSubmissionHistories(userId, courseId);
      const isAlreadySubmitted = submissionHistories.some(
        (submission) => submission.quizId === quizId && submission.assignmentStatus === true
      );

      if (isAlreadySubmitted) {
        // console.log("Tiến độ quiz này đã được lưu trước đó.");
        return;
      }

      const module = moduleDetails.find((m) => m.quiz.some((q) => q.quizId === quizId));
      if (!module) return;

      await saveSubmissionHistory({
        userId,
        courseId: Number(courseId),
        moduleId: module.moduleId,
        quizId,
        score,
        assignmentStatus: true,
      });

      setModuleDetails((prevDetails) => {
        const updatedDetails = prevDetails.map((module) => {
          const updatedQuizzes = module.quiz.map((quiz) =>
            quiz.quizId === quizId ? { ...quiz, completed: true } : quiz
          );

          const completedQuizCount = updatedQuizzes.filter((quiz) => quiz.completed).length;

          return {
            ...module,
            quiz: updatedQuizzes,
            completedQuizzesCount: completedQuizCount,
          };
        });

        const totalCompletedQuizzes = updatedDetails.reduce((count, module) => {
          return count + module.quiz.filter((quiz) => quiz.completed).length;
        }, 0);

        setCompletedQuizzesCount(totalCompletedQuizzes);

        return updatedDetails;
      });

      // console.log("Lưu tiến độ quiz thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu tiến độ quiz: ", error.message);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchCourseData();
      await fetchEnrollments();

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
            // console.log("Người dùng đã từ chối đăng nhập.");
          }
        });
        return;
      }
    };

    initializeData();
  }, [courseId]);

  if (loading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </MDBox>
    );
  }

  return (
    <PageLayout>
      <DefaultNavbar />
      <MDBox padding={6} mt={3}>
        <Grid container spacing={6} pt={6}>
          {/* Video */}
          <Grid item xs={12} md={8}>
            <Card>
              <MDBox p={3} sx={{ position: "relative" }}>
                {selectedQuiz ? (
                  <MDBox>
                    <MDTypography variant="h5" color="info" mb={2}>
                      {selectedQuiz.title}
                    </MDTypography>
                    {selectedQuiz.questions.map((question, index) => (
                      <MDBox key={question.questionId} mb={3}>
                        <MDTypography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {`${index + 1}. ${question.questionText}`}
                        </MDTypography>

                        <FormControl component="fieldset" fullWidth>
                          <RadioGroup
                            value={userAnswers[question.questionId] || ""}
                            onChange={(e) =>
                              handleSelectAnswer(question.questionId, e.target.value)
                            }
                          >
                            {question.choices.map((choice) => (
                              <FormControlLabel
                                key={choice.choiceId}
                                value={choice.choiceId}
                                control={<Radio />}
                                label={choice.choiceText}
                                sx={{
                                  color:
                                    Number(userAnswers[question.questionId]) ===
                                    Number(choice.choiceId)
                                      ? "#1A73E8"
                                      : "inherit",
                                }}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </MDBox>
                    ))}
                    {errorMessage && (
                      <MDTypography color="error" mb={2}>
                        {errorMessage}
                      </MDTypography>
                    )}

                    <MDBox display="flex" justifyContent="center" mt={4}>
                      <MDButton
                        variant="contained"
                        color="info"
                        sx={{ padding: "10px 20px" }}
                        onClick={handleSubmitQuiz}
                      >
                        Nộp bài
                      </MDButton>
                    </MDBox>

                    {quizResult && (
                      <MDTypography color="success" mt={2}>
                        {successMessage}
                      </MDTypography>
                    )}
                  </MDBox>
                ) : (
                  selectedVideo && (
                    <MDBox sx={{ paddingTop: "56.25%" }}>
                      <YouTube
                        videoId={
                          selectedVideo
                            ? moduleDetails
                                .flatMap((module) => module.lessons)
                                .find((lesson) => lesson.lessonId === selectedVideo)?.videoUrl
                            : ""
                        }
                        opts={{
                          width: "100%",
                          height: "100%",
                          playerVars: {
                            autoplay: 0,
                            rel: 0,
                            modestbranding: 1,
                          },
                        }}
                        onReady={(event) => {
                          playerRef.current = event.target;
                        }}
                        onStateChange={(event) => {
                          const playerState = event.data;

                          if (playerState === 1) {
                            startViewTime();
                          } else if (playerState === 2 || playerState === 0) {
                            stopViewTime();
                          }

                          if (event.data === 1) {
                            const interval = setInterval(() => {
                              if (playerRef.current) {
                                const currentTime = playerRef.current.getCurrentTime();
                                const duration = playerRef.current.getDuration();
                                const progress = (currentTime / duration) * 100;

                                if (progress >= 80 && !progressRecorded) {
                                  saveProgress();
                                  clearInterval(interval);
                                }
                              }
                            }, 1000);

                            playerRef.current.addEventListener("onStateChange", (e) => {
                              if (e.data === 2 || e.data === 0) {
                                clearInterval(interval);
                              }
                            });
                          }
                        }}
                        // ref={playerRef}
                        onProgress={(event) => {
                          const progress =
                            (event.target.getCurrentTime() / event.target.getDuration()) * 100;
                          if (progress >= 80 && !progressRecorded) {
                            saveProgress();
                            setProgressRecorded(true);
                          }
                        }}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </MDBox>
                  )
                )}
              </MDBox>
              <MDBox sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
                {completionPercentage === 100 && (
                  <MDButton
                    variant="contained"
                    color="success"
                    onClick={handleReceiveCertificate}
                    sx={{ padding: "10px 20px" }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang nhận..." : "Nhận chứng nhận"}
                  </MDButton>
                )}
              </MDBox>
            </Card>
          </Grid>

          {/* Danh sách bài học */}
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
                  Khóa Học: {courseDetails?.title}
                </MDTypography>
              </MDBox>
              <MDTypography sx={{ mt: 2 }} textAlign="center">
                {courseDetails?.description || "Không có mô tả."}
              </MDTypography>
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={<ListSubheader>Thống kê tiến độ</ListSubheader>}
              >
                {/* <ListItemText sx={{ ml: 2 }} primary={`Tổng số bài học: ${totalLessons}`} /> */}
                <ListItemText
                  sx={{ ml: 2 }}
                  primary={`Tiến độ hoàn thành bài học: ${completedLessonsCount}/${totalLessons}`}
                />
                {/* <ListItemText sx={{ ml: 2 }} primary={`Tổng số bài quiz: ${totalQuizzes}`} /> */}
                <ListItemText
                  sx={{ ml: 2 }}
                  primary={`Tiến độ hoàn thành quiz: ${completedQuizzesCount}/${totalQuizzes}`}
                />
                <ListItemText
                  sx={{ ml: 2 }}
                  primary={`Tỉ lệ hoàn thành: ${completionPercentage.toFixed(0)}%`}
                />
                {/* <ListItemText
                  sx={{ ml: 2 }}
                  primary={`Thời gian xem video: ${formatViewTime(viewTime)}`}
                /> */}
              </List>

              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={<ListSubheader>Nội dung khóa học</ListSubheader>}
              >
                {moduleDetails.map((module, index) => (
                  <React.Fragment key={module.moduleId}>
                    {/* Module */}
                    <ListItemButton onClick={() => handleToggleModule(index)}>
                      <ListIcon sx={{ mr: 2 }} />
                      <ListItemText
                        primary={`${module.title} (${module.completedLessonsCount}/${module.totalLessons} bài học hoàn thành)`}
                      />
                      {openModules[index] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    {/* Lessons & Quiz */}
                    <Collapse in={openModules[index]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {module.lessons.length > 0 ? (
                          module.lessons.map((lesson, lessonIndex) => {
                            const isDisabled =
                              lessonIndex > 0 && !module.lessons[lessonIndex - 1].completed;

                            return (
                              <ListItemButton
                                key={lesson.lessonId}
                                sx={{
                                  pl: 4,
                                  bgcolor:
                                    selectedVideo === lesson.lessonId ? "lightblue" : "inherit",
                                  pointerEvents: isDisabled ? "none" : "auto",
                                  opacity: isDisabled ? 0.5 : 1,
                                }}
                                onClick={() => handleSelectVideo(lesson.lessonId)}
                                disabled={isDisabled}
                              >
                                <ListItemText
                                  primary={
                                    <>
                                      {`${lessonIndex + 1}. ${lesson.title}`}{" "}
                                      {lesson.completed && (
                                        <span style={{ color: "green", marginLeft: "8px" }}>✔</span>
                                      )}
                                    </>
                                  }
                                />
                              </ListItemButton>
                            );
                          })
                        ) : (
                          <ListItemText
                            primary="Không có bài học nào."
                            sx={{ pl: 4, color: "text.secondary" }}
                          />
                        )}

                        {/* Quiz */}
                        {module.quiz.length > 0 ? (
                          module.quiz.map((quiz, quizIndex) => {
                            const isQuizEnabled =
                              module.completedLessonsCount === module.totalLessons;

                            return (
                              <ListItemButton
                                key={quiz.quizId}
                                sx={{
                                  pl: 4,
                                  bgcolor:
                                    selectedQuiz?.quizId === quiz.quizId ? "lightblue" : "inherit",
                                  pointerEvents: isQuizEnabled ? "auto" : "none",
                                  opacity: isQuizEnabled ? 1 : 0.5,
                                }}
                                onClick={() => handleSelectQuiz(quiz)}
                                disabled={!isQuizEnabled}
                              >
                                <ListItemText
                                  primary={
                                    <>
                                      {`Quiz`}{" "}
                                      {quiz.completed && (
                                        <span style={{ color: "green", marginLeft: "8px" }}>✔</span>
                                      )}
                                    </>
                                  }
                                />
                                {/* <ListItemText primary={`Quiz: ${quiz.title}`} /> */}
                              </ListItemButton>
                            );
                          })
                        ) : (
                          <ListItemText sx={{ pl: 4, color: "text.secondary" }} />
                        )}
                      </List>
                    </Collapse>
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </PageLayout>
  );
};

export default Learning2;
