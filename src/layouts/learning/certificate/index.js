import React, { useRef } from "react";
import { toPng } from "html-to-image";
import PropTypes from "prop-types"; // Đảm bảo đã import
import { Box, Typography } from "@mui/material";

function Certificate({ onGenerateCertificateImage }) {
  const certificateRef = useRef();

  const generateCertificateImage = async () => {
    try {
      const dataUrl = await toPng(certificateRef.current, {
        skipFonts: true,
      });
      return dataUrl;
    } catch (error) {
      console.error("Có lỗi khi tạo ảnh chứng nhận:", error);
      return null;
    }
  };
  React.useEffect(() => {
    if (onGenerateCertificateImage) {
      onGenerateCertificateImage(() => generateCertificateImage); // Truyền hàm tạo ảnh lên cha
    }
  }, [onGenerateCertificateImage]);

  return (
    <Box
      ref={certificateRef}
      sx={{
        width: "800px",
        height: "600px",
        padding: "20px",
        border: "10px solid #F26522",
        backgroundColor: "#fff",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="#F26522" gutterBottom>
          STAR DEV
        </Typography>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="#F26522"
          sx={{ textTransform: "uppercase" }}
        >
          CHỨNG NHẬN HOÀN THÀNH
        </Typography>
      </Box>
      <Box textAlign="center">
        <Typography variant="body1" fontSize="18px">
          Chúc mừng bạn,
        </Typography>
        <Typography variant="h4" fontWeight="bold" my={1}>
          {localStorage.getItem("userName")}
        </Typography>
        <Typography variant="h6" my={1}>
          Đã hoàn thành khóa học: <strong>Kiểm thử dự án trên nền tảng web</strong>
        </Typography>
        <Typography variant="body1" fontStyle="italic" my={1}>
          Ngày hoàn thành: <strong>26 tháng 02, 2024</strong>
        </Typography>
      </Box>
    </Box>
  );
}

Certificate.propTypes = {
  onGenerateCertificateImage: PropTypes.func.isRequired,
};

export default Certificate;
