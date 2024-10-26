import React, { useState, useEffect, useRef } from "react";
import MDBox from "components/MDBox";
import axios from "axios";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Container, Typography, Box, Button, Grid } from "@mui/material";
import { Splide, SplideSlide } from "@splidejs/react-splide";

import PeopleIcon from "@mui/icons-material/People";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import imgVue from "assets/images/Background/background-course/vue.png";
import imgNode from "assets/images/Background/background-course/node.png";
import imgReact from "assets/images/Background/background-course/react.png";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
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

  // Thêm các slide khác nếu cần
];

const Home = () => {
  const [courses, setCourses] = useState([]);
  console.log(courses); // Xem dữ liệu trong state

  useEffect(() => {
    // Hàm gọi API để lấy danh sách khóa học
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3030/course-api/getAllCourse");
        console.log(response.data); // Kiểm tra phản hồi từ API

        if (response.data.success) {
          setCourses(response.data.data); // Đặt dữ liệu vào state
        } else {
          console.error("Dữ liệu không thành công:", response.data.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khóa học:", error);
      }
    };

    fetchCourses();
  }, []);

  const descriptionRef = useRef(null); // Tạo ref cho phần mô tả

  const sliderRef = useRef(null); // Tạo ref cho Splide

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

  const freeCourseRefs = useRef([]); // Tạo ref cho các thẻ khóa học miễn phí
  const proCourseRefs = useRef([]); // Tạo ref cho các thẻ khóa học PRO
  const decription = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in"); // Thêm class fade-in khi phần tử vào khung nhìn
            observer.unobserve(entry.target); // Ngừng theo dõi sau khi phần tử đã xuất hiện
          }
        });
      },
      { threshold: 0.1 } // Phát hiện khi 10% của phần tử hiển thị trong viewport
    );

    // Áp dụng observer cho mỗi thẻ khóa học miễn phí
    freeCourseRefs.current.forEach((course) => {
      if (course) {
        observer.observe(course);
      }
    });

    // Áp dụng observer cho mỗi thẻ khóa học PRO
    proCourseRefs.current.forEach((course) => {
      if (course) {
        observer.observe(course);
      }
    });

    // Áp dụng observer cho phần mô tả
    if (descriptionRef.current) {
      observer.observe(descriptionRef.current);
    }

    return () => {
      // Cleanup observer khi component unmount
      observer.disconnect();
    };
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container maxWidth="lg">
        {/* Slideshow */}
        <Box sx={{ position: "relative", overflow: "hidden", width: "100%" }}>
          <Splide ref={sliderRef} options={settings}>
            {images.map((image, index) => (
              <SplideSlide key={index}>
                <Box
                  sx={{
                    position: "relative",
                    height: "300px", // Chiều cao của slide
                    backgroundImage: `url(${image.imgSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "2px", // Chỉnh border
                    borderRadius: "10px", // Bo góc border nếu cần
                    overflow: "hidden", // Để không bị tràn ra ngoài
                    marginBottom: "15px",
                  }}
                >
                  {/* Text overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "#fff",
                      textAlign: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.5)", // Mờ nền
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

          {/* Nút chuyển slide */}
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

        {/* Phần nội dung KHÓA HỌC MIỄN PHÍ */}
        <Typography variant="h5" gutterBottom>
          KHÓA HỌC MIỄN PHÍ
        </Typography>
        <Grid container spacing={2}>
          {courses.map((course, index) => {
            const imagePath = require(`assets/images/Background/background-course/${course.imgUrl}`);
            console.log(imagePath); // Sử dụng biến course
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
                >
                  <div>
                    <img
                      src={imagePath} // Lấy hình ảnh từ context
                      alt={course.alt || course.title} // Thêm alt nếu không có alt từ cơ sở dữ liệu
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
                    <Box sx={{ display: "flex", alignItems: "center" }}>
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
                    </Box>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* Phần nội dung KHÓA HỌC PRO */}
        <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
          KHÓA HỌC PRO
        </Typography>
        <Grid container spacing={2} mb={3}>
          {images.map((course, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                className="course-card" // Class mặc định cho thẻ khóa học
                ref={(el) => (proCourseRefs.current[index] = el)} // Gán ref cho từng thẻ khóa học PRO
                sx={{
                  p: 2,
                  border: "1px solid #ddd",
                  textAlign: "center",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease",
                  opacity: 0, // Ẩn trước khi phần tử vào khung nhìn
                  transform: "translateY(20px)", // Đẩy xuống một chút trước khi vào khung nhìn
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <div>
                  <img
                    src={imgVue}
                    alt={course.alt}
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
                  <Box sx={{ display: "flex", alignItems: "center" }}>
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
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
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
        >
          <Typography variant="body1">
            <strong>Star Dev</strong> là nền tảng học lập trình trực tuyến dành cho mọi đối tượng,
            từ người mới bắt đầu đến các lập trình viên chuyên nghiệp. Với khoá học phong phú về các
            ngôn ngữ lập trình như Python, Java, C++, JavaScript và nhiều công nghệ hiện đại khác,
            Star Dev giúp bạn tiếp cận kiến thức dễ dàng, thực hành theo dự án thực tế và phát triển
            kỹ năng lập trình toàn diện. Đặc biệt, nền tảng cung cấp hệ thống hỗ trợ 24/7 và cộng
            đồng học viên năng động, giúp bạn giải đáp thắc mắc, cùng nhau tiến bộ trong hành trình
            học tập. Hãy tham gia Star Dev ngay hôm nay để bắt đầu hành trình chinh phục lập trình
            của bạn!
          </Typography>
        </Box>
      </Box>
      <Footer />
    </DashboardLayout>
  );
};
export default Home;
