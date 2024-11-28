import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
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
  FormLabel,
} from "@mui/material";
import PageLayout from "examples/LayoutContainers/PageLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import MDButton from "components/MDButton";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ListIcon from "@mui/icons-material/List";
import YouTube from "react-youtube";

const Learning2 = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [modules, setModules] = useState([]);
  const [moduleDetails, setModuleDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModules, setOpenModules] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [progressRecorded, setProgressRecorded] = useState(false);
  const playerRef = useRef(null);

  const handleToggleModule = (index) => {
    setOpenModules((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleSelectVideo = (videoUrl) => {
    setSelectedQuiz(null);

    const lessons = moduleDetails.flatMap((module) => module.lessons);
    const currentIndex = lessons.findIndex((lesson) => lesson.videoUrl === videoUrl);

    if (currentIndex === -1) return;

    if (currentIndex > 0) {
      const previousLesson = lessons[currentIndex - 1];

      if (!previousLesson.completed) {
        Swal.fire({
          title: "Không thể mở!",
          text: "Bạn cần hoàn thành bài học trước đó để tiếp tục!",
          icon: "warning",
        });
        // setSelectedVideo(null);
        return;
      }
    }

    setSelectedVideo(videoUrl);
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

      console.log("Câu trả lời người dùng:", userAnswer);
      console.log("Câu trả lời đúng:", correctChoice?.choiceId);

      return Number(userAnswer) !== Number(correctChoice?.choiceId);
    });

    if (incorrectAnswers.length > 0) {
      setErrorMessage(`Bạn đã trả lời sai ${incorrectAnswers.length} câu. Vui lòng kiểm tra lại!`);
      setQuizResult(false);
    } else {
      setErrorMessage(null);
      setQuizResult(true);
    }
  };

  const handleNextLesson = () => {
    const lessons = moduleDetails.flatMap((module) => module.lessons);
    const currentIndex = lessons.findIndex((lesson) => lesson.videoUrl === selectedVideo);

    if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];

      if (nextLesson.completed || progressRecorded || lessons[currentIndex].completed) {
        setSelectedVideo(nextLesson.videoUrl);
        setProgressRecorded(false);
      } else {
        alert("Bạn cần hoàn thành bài học hiện tại để tiếp tục!");
      }
    }
  };

  const handlePreviousLesson = () => {
    const lessons = moduleDetails.flatMap((module) => module.lessons);
    const currentIndex = lessons.findIndex((lesson) => lesson.videoUrl === selectedVideo);

    if (currentIndex === -1) return;

    const previousLessonIndex = currentIndex - 1;

    if (previousLessonIndex >= 0) {
      const previousLesson = lessons[previousLessonIndex];
      if (previousLesson.completed) {
        setSelectedVideo(previousLesson.videoUrl);
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

      const moduleDataWithDetails = await Promise.all(
        modulesData.map(async (module) => {
          const lessons = await getLessonsByModuleId(module.moduleId);

          lessons.forEach((lesson) => {
            lesson.completed = userProgress.some(
              (progress) => progress.lessonId === lesson.lessonId && progress.status === "completed"
            );
          });

          const quiz = await getQuizByModuleId(module.moduleId);
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

          return { ...module, lessons, quiz: quizDetails };
        })
      );

      setModuleDetails(moduleDataWithDetails);

      const firstIncompleteLesson = moduleDataWithDetails
        .flatMap((module) => module.lessons)
        .find((lesson) => !lesson.completed);

      if (firstIncompleteLesson) {
        setSelectedVideo(firstIncompleteLesson.videoUrl);
      } else {
        setSelectedVideo(null);
      }
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
    } catch (error) {
      console.error("Error loading quiz details:", error.message);
    }
  };

  const saveProgress = async () => {
    if (progressRecorded) return;
    setProgressRecorded(true);

    try {
      const userId = localStorage.getItem("userId");
      const lesson = moduleDetails
        .flatMap((module) => module.lessons)
        .find((lesson) => lesson.videoUrl === selectedVideo);

      if (!userId || !lesson) return;

      // Lưu tiến độ lên server
      await addUserProgress({
        userId,
        courseId,
        lessonId: lesson.lessonId,
        status: "completed",
      });

      // Cập nhật trạng thái completed
      setModuleDetails((prevDetails) =>
        prevDetails.map((module) => ({
          ...module,
          lessons: module.lessons.map((l) =>
            l.lessonId === lesson.lessonId ? { ...l, completed: true } : l
          ),
        }))
      );

      console.log("Tiến độ đã được lưu và cập nhật trạng thái.");
    } catch (error) {
      console.error("Lỗi khi lưu tiến độ:", error.message);
    }
  };

  useEffect(() => {
    fetchCourseData();
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
                    <MDTypography variant="h6" mb={2}>
                      Quiz: {selectedQuiz.title}
                    </MDTypography>
                    {selectedQuiz.questions.map((question, index) => (
                      <MDBox key={question.questionId} mb={3}>
                        <MDTypography variant="body1" fontWeight="bold">
                          {index + 1}. {question.questionText}
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
                      <button
                        onClick={handleSubmitQuiz}
                        style={{ padding: "10px 20px", fontSize: "16px" }}
                      >
                        Nộp bài
                      </button>
                    </MDBox>

                    {quizResult && (
                      <MDTypography color="success" mt={2}>
                        Bạn đã hoàn thành quiz này! 🎉
                      </MDTypography>
                    )}
                  </MDBox>
                ) : (
                  selectedVideo && (
                    <MDBox sx={{ paddingTop: "56.25%" }}>
                      <YouTube
                        videoId={selectedVideo}
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
                        onProgress={(event) => {
                          const progress =
                            (event.target.getCurrentTime() / event.target.getDuration()) * 100;
                          if (progress >= 80 && !progressRecorded) {
                            saveProgress();
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
                <MDButton
                  variant="contained"
                  color="info"
                  onClick={handlePreviousLesson}
                  disabled={
                    selectedVideo === null ||
                    moduleDetails
                      .flatMap((module) => module.lessons)
                      .findIndex((lesson) => lesson.videoUrl === selectedVideo) === 0
                  }
                  sx={{ marginRight: 2, padding: "10px 20px" }}
                >
                  <ArrowCircleLeftOutlinedIcon sx={{ marginRight: 1 }} /> Bài trước
                </MDButton>
                <MDButton
                  variant="contained"
                  color="info"
                  disabled={
                    !progressRecorded &&
                    !moduleDetails
                      .flatMap((module) => module.lessons)
                      .find((lesson) => lesson.videoUrl === selectedVideo)?.completed &&
                    !quizResult
                  }
                  onClick={handleNextLesson}
                  sx={{ marginRight: 2, padding: "10px 20px" }}
                >
                  Bài tiếp theo <ArrowCircleRightOutlinedIcon sx={{ marginLeft: 1 }} />
                </MDButton>

                <MDButton variant="contained" color="success" sx={{ padding: "10px 20px" }}>
                  Nhận chứng nhận
                </MDButton>
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
              <MDTypography sx={{ mt: 2, ml: 3, mb: 3 }}>
                {courseDetails?.description || "Không có mô tả."}
              </MDTypography>
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
                      <ListItemText primary={module.title} />
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
                                    selectedVideo === lesson.videoUrl ? "lightblue" : "inherit",
                                  pointerEvents: isDisabled ? "none" : "auto",
                                  opacity: isDisabled ? 0.5 : 1,
                                }}
                                onClick={() => handleSelectVideo(lesson.videoUrl)}
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
                        {module.quiz.length > 0 ? (
                          module.quiz.map((quiz) => (
                            <ListItemButton
                              key={quiz.quizId}
                              sx={{
                                pl: 4,
                                bgcolor:
                                  selectedQuiz?.quizId === quiz.quizId ? "lightblue" : "inherit",
                              }}
                              onClick={() => handleSelectQuiz(quiz)}
                            >
                              <ListItemText primary={`Quiz: ${quiz.title}`} />
                            </ListItemButton>
                          ))
                        ) : (
                          <ListItemText
                            // primary="Không có Quiz"
                            sx={{ pl: 4, color: "text.secondary" }}
                          />
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
