import React from "react";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Container, Typography, Box, Button, Grid } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./home.css";
import imgSlide from "assets/images/bg-login-layout.png";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container maxWidth="lg">
        {/* Slideshow */}
        <MDBox className="slideshow" sx={{ mb: 4, maxWidth: "100%" }}>
          <Slider {...settings}>
            <div>
              <img src={imgSlide} alt="Slide 1" />
            </div>
            <div>
              <img src={imgSlide} alt="Slide 2" />
            </div>
            <div>
              <img src={imgSlide} alt="Slide 3" />
            </div>
          </Slider>
        </MDBox>
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                className="course-card"
                sx={{ p: 2, border: "1px solid #ddd", textAlign: "center" }}
              >
                <img
                  src={`https://via.placeholder.com/150?text=Course+${index + 1}`}
                  alt={`Course ${index + 1}`}
                  style={{ width: "100%", marginBottom: "10px" }}
                />
                <Typography variant="h6">HTML, CSS cơ bản MIỄN PHÍ</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Pro Courses Section */}
        <Box className="pro-courses" sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            KHÓA HỌC PRO
          </Typography>
          <Box className="pro-banner">
            <img src="https://via.placeholder.com/1000x300?text=Node+JS+Pro" alt="Node JS Pro" />
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Xem ngay
            </Button>
          </Box>
        </Box>

        {/* About Section */}
        <Box className="about-section" sx={{ mt: 4, p: 2, backgroundColor: "#f9f9f9" }}>
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
      </Container>
    </DashboardLayout>
  );
};

export default Home;
