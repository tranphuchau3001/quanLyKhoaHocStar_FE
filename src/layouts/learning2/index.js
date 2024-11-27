import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getCourseById,
  getModulesByCourseId,
  getLessonsByModuleId,
  getQuizByModuleId,
  getQuestionsByQuizId,
  getChoicesByQuestionId,
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
import { List as ListIcon, ExpandLess, ExpandMore } from "@mui/icons-material";
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

  const handleToggleModule = (index) => {
    setOpenModules((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleSelectVideo = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setSelectedQuiz(null);
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
      setErrorMessage("Bạn đã trả lời sai một số câu. Vui lòng kiểm tra lại!");
      setQuizResult(false);
    } else {
      setErrorMessage(null);
      setQuizResult(true);
    }
  };

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const course = await getCourseById(courseId);
      setCourseDetails(course);

      const modulesData = await getModulesByCourseId(courseId);
      setModules(modulesData);

      const moduleDataWithDetails = await Promise.all(
        modulesData.map(async (module) => {
          const lessons = await getLessonsByModuleId(module.moduleId);
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
    } catch (error) {
      console.error("Error loading quiz details:", error.message);
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
                    {selectedQuiz.questions.map((question) => (
                      <MDBox key={question.questionId} mb={3}>
                        <MDTypography variant="body1" fontWeight="bold">
                          {question.questionText}
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
                                    userAnswers[question.questionId] === choice.choiceId
                                      ? "green"
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
                      <ListIcon sx={{ color: "info.main" }} />
                      <ListItemText primary={module.title} />
                      {openModules[index] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    {/* Lessons & Quiz */}
                    <Collapse in={openModules[index]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {module.lessons.length > 0 ? (
                          module.lessons.map((lesson, lessonIndex) => (
                            <ListItemButton
                              key={lesson.lessonId}
                              sx={{ pl: 4 }}
                              onClick={() => handleSelectVideo(lesson.videoUrl)} // Chọn video
                            >
                              <ListItemText primary={`${lessonIndex + 1}. ${lesson.title}`} />
                            </ListItemButton>
                          ))
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
                              sx={{ pl: 4 }}
                              onClick={() => handleSelectQuiz(quiz)} // Chọn quiz
                            >
                              <ListItemText primary={`Quiz: ${quiz.title}`} />
                            </ListItemButton>
                          ))
                        ) : (
                          <ListItemText
                            primary="Không có Quiz"
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
