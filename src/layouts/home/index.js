import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Container, Typography, Box, Button, Grid } from "@mui/material";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import imgVue from "assets/images/Background/background-course/vue.png";
import imgNode from "assets/images/Background/background-course/node.png";
import imgReact from "assets/images/Background/background-course/react.png";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import { Link, useNavigate } from "react-router-dom";
import "@splidejs/react-splide/css";
import imgLogo from "assets/images/logos/image.png";
import "./home.scss";

const images = [
  {
    title: "Học Vue.js cho người mới",
    description:
      "Bắt đầu với VueJS, học cách xây dựng các ứng dụng web linh hoạt và hiện đại với các dự án thực hành thực tế.",
    imgSrc: imgVue,
    alt: "Vue.js Logo",
  },
  {
    title: "Khóa học NodeJS nâng cao",
    description:
      "Tìm hiểu chuyên sâu về Node.js, phát triển các ứng dụng backend mạnh mẽ và an toàn qua các dự án thực tế.",
    imgSrc: imgNode,
    alt: "Node.js Logo",
  },
  {
    title: "Khóa học React cho người mới",
    description:
      "Khám phá React, xây dựng giao diện người dùng tương tác và tối ưu hóa hiệu suất với các bài tập thực tế.",
    imgSrc: imgReact,
    alt: "React Logo",
  },
];

const Home = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [proCourses, setProCourses] = useState([]);
  const [showMoreFree, setShowMoreFree] = useState(false);
  const [showMorePro, setShowMorePro] = useState(false);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3030/course-api/getAllCourse");
        if (response.data.success) {
          const allCourses = response.data.data;
          const today = new Date();
          const validCourses = allCourses.filter((course) => {
            const startDate = new Date(course.startDate);
            const endDate = new Date(course.endDate);
            return today >= startDate && today <= endDate;
          });
          setCourses(validCourses);
          setFreeCourses(validCourses.filter((course) => course.price === 0));
          setProCourses(validCourses.filter((course) => course.price > 0));
        } else {
          console.error("Dữ liệu không thành công:", response.data.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khóa học:", error);
      }
    };

    fetchCourses();
  }, []);

  const checkEnrollment = async (courseId) => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(
        `http://localhost:3030/api/v1/enrollment/getEnrollmentByCourseId?courseId=${courseId}`
      );
      const data = await response.json();
      const isEnrolled = data.data.some((enrollment) => enrollment.userId === Number(userId));

      return isEnrolled;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin đăng ký khóa học:", error);
      return false;
    }
  };

  const handleCourseClick = async (courseId) => {
    console.log("handleCourseClick called with courseId:", courseId);
    const isEnrolled = await checkEnrollment(courseId);

    if (isEnrolled) {
      console.log("User is enrolled, navigating to /learning/" + courseId);
      navigate(`/learning/${courseId}`);
    } else {
      console.log("User is not enrolled, navigating to course detail");
      navigate(`/courses/${courseId}`);
    }
  };

  const handleShowMoreFree = () => {
    setShowMoreFree(!showMoreFree);
  };

  const handleShowMorePro = () => {
    setShowMorePro(!showMorePro);
  };

  const descriptionRef = useRef(null);

  const sliderRef = useRef(null);

  const settings = {
    type: "loop",
    autoplay: true,
    interval: 3000,
    pauseOnHover: true,
    speed: 1000,
    arrows: false,
    pagination: true,
    afterChange: (newIndex) => setCurrentIndex(newIndex),
  };

  const freeCourseRefs = useRef([]);
  const proCourseRefs = useRef([]);
  const decription = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    freeCourseRefs.current.forEach((course) => {
      if (course) {
        observer.observe(course);
      }
    });

    proCourseRefs.current.forEach((course) => {
      if (course) {
        observer.observe(course);
      }
    });

    if (descriptionRef.current) {
      observer.observe(descriptionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container maxWidth="lg">
        <Box sx={{ position: "relative", overflow: "hidden", width: "100%" }}>
          <Splide ref={sliderRef} options={settings}>
            {images.map((image, index) => (
              <SplideSlide key={index}>
                <Box
                  sx={{
                    position: "relative",
                    height: "300px",
                    backgroundImage: `url(${image.imgSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "2px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginBottom: "15px",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "#fff",
                      textAlign: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      padding: "20px",
                      borderRadius: "10px",
                    }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: "bold", color: "#fff" }}>
                      {image.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {image.description}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 3, backgroundColor: "#f8b400", color: "#fff" }}
                    >
                      Xem chi tiết
                    </Button>
                  </Box>
                </Box>
              </SplideSlide>
            ))}
          </Splide>
          <Button
            onClick={() => sliderRef.current.splide.go("<")}
            sx={{
              position: "absolute",
              top: "50%",
              left: "20px",
              transform: "translateY(-50%)",
              color: "#fff",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <ArrowBackIosIcon />
          </Button>
          <Button
            onClick={() => sliderRef.current.splide.go(">")}
            sx={{
              position: "absolute",
              top: "50%",
              right: "20px",
              transform: "translateY(-50%)",
              color: "#fff",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <ArrowForwardIosIcon />
          </Button>
        </Box>
        <Typography variant="h5" gutterBottom>
          KHÓA HỌC MIỄN PHÍ
        </Typography>
        <Grid container spacing={2}>
          {(showMoreFree ? freeCourses : freeCourses.slice(0, 8)).map((course) => {
            const imagePath = require(`assets/images/Background/background-course/${course.imgUrl}`);
            return (
              <Grid item xs={12} sm={6} md={3} key={course.courseId}>
                <Box
                  className="course-card"
                  sx={{
                    p: 2,
                    border: "1px solid #ddd",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                  onClick={() => handleCourseClick(course.courseId)}
                >
                  <div>
                    <img
                      src={imagePath}
                      alt={course.alt || course.title}
                      style={{
                        width: "100%",
                        height: "160px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                      {course.title}
                    </Typography>
                  </div>
                  <Typography variant="body2" color="red">
                    Miễn phí
                  </Typography>
                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#999",
                    }}
                  >
                    {/* <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PeopleIcon sx={{ fontSize: "18px", marginRight: "4px" }} />
                        <Typography variant="caption">130.954</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <VisibilityIcon sx={{ fontSize: "18px", marginRight: "4px" }} />
                        <Typography variant="caption">5.5K</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTimeIcon sx={{ fontSize: "18px", marginRight: "4px" }} />
                        <Typography variant="caption">12 giờ</Typography>
                      </Box> */}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
        {freeCourses.length > 8 && (
          <Box textAlign="center" mt={5}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleShowMoreFree}
              sx={{
                padding: "10px 20px",
                borderRadius: "25px",
                fontWeight: 600,
                backgroundColor: "#FFC107", // Màu nền vàng
                color: "#fff", // Màu chữ trắng
                transition: "background-color 0.3s, transform 0.3s",
                "&:hover": {
                  backgroundColor: "#FFA000", // Màu nền vàng đậm khi hover
                  transform: "scale(1.05)",
                },
              }}
            >
              {showMoreFree ? "Rút gọn" : "Xem thêm"}
            </Button>
          </Box>
        )}
        <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
          KHÓA HỌC PRO
        </Typography>
        <Grid container spacing={2} mb={3}>
          {(showMorePro ? proCourses : proCourses.slice(0, 8)).map((course) => {
            const imagePath = require(`assets/images/Background/background-course/${course.imgUrl}`);
            return (
              <Grid item xs={12} sm={6} md={3} key={course.courseId}>
                <Link to={`/courses/${course.courseId}`} style={{ textDecoration: "none" }}>
                  <Box
                    className="course-card"
                    sx={{
                      p: 2,
                      border: "1px solid #ddd",
                      textAlign: "center",
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <div>
                      <img
                        src={imagePath}
                        alt={course.alt || course.title}
                        style={{
                          width: "100%",
                          height: "160px",
                          borderRadius: "8px",
                          marginBottom: "10px",
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                        {course.title}
                      </Typography>
                    </div>
                    <Typography variant="body2" color="red">
                      {course.price.toLocaleString("vi-VN")} VND
                    </Typography>
                  </Box>
                </Link>
              </Grid>
            );
          })}
        </Grid>
        {proCourses.length > 8 && (
          <Box textAlign="center" mt={5}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleShowMorePro}
              sx={{
                padding: "10px 20px",
                borderRadius: "25px",
                fontWeight: 600,
                backgroundColor: "#FFC107", // Màu nền vàng
                color: "#fff", // Màu chữ trắng
                transition: "background-color 0.3s, transform 0.3s",
                "&:hover": {
                  backgroundColor: "#FFA000", // Màu nền vàng đậm khi hover
                  transform: "scale(1.05)",
                },
              }}
            >
              {showMorePro ? "Rút gọn" : "Xem thêm"}
            </Button>
          </Box>
        )}
      </Container>
      <Box className="decription" ref={descriptionRef}>
        {" "}
        {/* Gán ref cho thẻ Box */}
        <Box
          mt={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <img
            src={imgLogo}
            alt="Logo"
            style={{
              marginTop: "25px",
              maxWidth: "200px",
              maxHeight: "200px",
              border: "2px",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          />
        </Box>
        <Box
          className="about-section"
          sx={{
            p: 2,
            backgroundColor: "#f9f9f9",
            paddingLeft: 20,
            paddingRight: 20,
            textAlign: "center",
          }}
        ></Box>
        <Typography variant="body1" sx={{ textAlign: "justify" }}>
          <strong>Star Dev</strong> là nền tảng học lập trình trực tuyến dành cho mọi đối tượng, từ
          người mới bắt đầu đến các lập trình viên chuyên nghiệp. Với khoá học phong phú về các ngôn
          ngữ lập trình như Python, Java, C++, JavaScript và nhiều công nghệ hiện đại khác, Star Dev
          giúp bạn tiếp cận kiến thức dễ dàng, thực hành theo dự án thực tế và phát triển kỹ năng
          lập trình toàn diện. Đặc biệt, nền tảng cung cấp hệ thống hỗ trợ 24/7 và cộng đồng học
          viên năng động, giúp bạn giải đáp thắc mắc, cùng nhau tiến bộ trong hành trình học tập.
          Hãy tham gia Star Dev ngay hôm nay để bắt đầu hành trình chinh phục lập trình của bạn!
        </Typography>
      </Box>
      <Footer />
    </DashboardLayout>
  );
};

export default Home;
