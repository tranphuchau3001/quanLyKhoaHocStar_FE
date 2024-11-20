import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  ListItem,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import "./settingAccount.scss";
import PageLayout from "examples/LayoutContainers/PageLayout";
import Navbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";
import defaultAvatar from "../../../assets/images/avatar-Account/image.png";
import SecurityPopup from "./securityPopup";
import "./settingAccount.scss";
import { Password } from "@mui/icons-material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import MDBox from "components/MDBox";
const AccountSettings = () => {
  const [userInfo, setUserInfo] = useState({
    name: null,
    phone: null,
    avatarUrl: null,
  });
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [errors, setErrors] = useState({ name: "", phone: "" });
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");
  const inputFileRef = useRef(null);
  const [currentTab, setCurrentTab] = useState("info");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3030/user-api/getUserByUserId?userId=${userId}`
        );
        setUserInfo({
          name: response.data.data.name || null,
          phone: response.data.data.phone || null,
          avatarUrl: response.data.data.avatarUrl || null,
        });
        if (response.data.data.avatarUrl) {
          setAvatar(
            require(`../../../assets/images/avatar-Account/${response.data.data.avatarUrl}`)
          );
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();

    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3030/api/v1/history/getAllSubmissionHistory"
        );
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khóa học:", error);
      }
    };

    fetchCourses();
  }, [userId]);

  const validateFields = () => {
    const nameError = userInfo.name ? "" : "Vui lòng nhập tên";
    const phoneError =
      userInfo.phone && /^\d{10}$/.test(userInfo.phone) ? "" : "Số điện thoại không hợp lệ";
    setErrors({ name: nameError, phone: phoneError });
    return !nameError && !phoneError;
  };

  const handleDoubleClick = () => {
    inputFileRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSave = async () => {
    if (validateFields()) {
      try {
        const response = await axios.put("http://localhost:3030/user-api/update", {
          userId: userId,
          name: userInfo.name || undefined,
          phone: userInfo.phone || undefined,
          email: email,
          avatarUrl: "default.png",
        });
        console.log("Dữ liệu đã được lưu:", response.data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lưu dữ liệu:", error);
      }
    }
  };

  return (
    <PageLayout>
      <DefaultNavbar />
      <MDBox pt={6} pb={3}>
        <Box className="account-settings" container spacing={6} pt={6}>
          <Box className="sidebar">
            <Typography variant="h3">Cài đặt tài khoản</Typography>
            <Typography variant="body2" color="textSecondary">
              Quản lý cài đặt tài khoản của bạn như thông tin cá nhân, cài đặt bảo mật, quản lý
              thông báo, v.v.
            </Typography>
            <List>
              <ListItem
                button
                onClick={() => setCurrentTab("info")}
                sx={{
                  backgroundColor: currentTab === "info" ? "#000" : "transparent",
                  color: currentTab === "info" ? "#fff" : "inherit",
                  "&:hover": {
                    backgroundColor: "#d3d3d3",
                    color: "#000",
                  },
                }}
              >
                <ListItemIcon sx={{ color: currentTab === "info" ? "#fff" : "inherit" }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Thông tin tài khoản" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  setCurrentTab("security");
                  handleOpenPopup();
                }}
                sx={{
                  backgroundColor: currentTab === "security" ? "#000" : "transparent",
                  color: currentTab === "security" ? "#fff" : "inherit",
                  "&:hover": {
                    backgroundColor: "#d3d3d3",
                    color: "#000",
                  },
                }}
              >
                <ListItemIcon sx={{ color: currentTab === "security" ? "#fff" : "inherit" }}>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText primary="Mật khẩu và bảo mật" />
              </ListItem>
              <ListItem
                button
                onClick={() => setCurrentTab("courses")}
                sx={{
                  backgroundColor: currentTab === "courses" ? "#000" : "transparent",
                  color: currentTab === "courses" ? "#fff" : "inherit",
                  "&:hover": {
                    backgroundColor: "#d3d3d3",
                    color: "#000",
                  },
                }}
              >
                <ListItemIcon sx={{ color: currentTab === "calendar" ? "#fff" : "inherit" }}>
                  <CalendarMonthIcon />
                </ListItemIcon>
                <ListItemText primary="Khóa học và lịch học" />
              </ListItem>
            </List>
          </Box>

          <Divider orientation="vertical" flexItem />
          <Box className="content">
            {currentTab === "info" && (
              <>
                <Typography variant="h3">Thông tin cá nhân</Typography>
                <Typography variant="body2" color="textSecondary">
                  Quản lý thông tin cá nhân của bạn
                </Typography>

                <Box className="info-section">
                  <ListItemText>
                    <Typography variant="subtitle1">Họ và tên</Typography>
                    <TextField
                      value={userInfo.name}
                      placeholder="Chưa cập nhật tên"
                      fullWidth
                      variant="outlined"
                      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    />
                  </ListItemText>
                </Box>

                <Box className="info-section">
                  <Typography variant="subtitle1">Ảnh đại diện</Typography>

                  <Avatar
                    src={avatar}
                    alt="Avatar"
                    sx={{
                      width: 50,
                      height: 50,
                      cursor: "pointer",
                      border: "1px solid #000000",
                      borderRadius: "50%", // Đảm bảo border vẫn giữ hình tròn
                    }}
                    onDoubleClick={handleDoubleClick} // Thêm sự kiện double click
                  />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={inputFileRef}
                    onChange={handleFileChange}
                  />
                </Box>

                <Box className="info-section">
                  <Typography variant="subtitle1">Số điện thoại</Typography>
                  <TextField
                    value={userInfo.phone}
                    placeholder="Chưa cập nhật số điện thoại"
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  />
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  className="save-button"
                  onClick={handleSave}
                >
                  Lưu lại
                </Button>
              </>
            )}

            {currentTab === "courses" && (
              <>
                <Typography variant="h3">Khóa học đang quản lý</Typography>
                <Typography variant="body2" color="textSecondary">
                  Quản lý khóa học bạn đang quản lý và có thể thêm lịch học cho khóa học này
                </Typography>
                <Box className="course-list">
                  {courses.map((course, index) => (
                    <Box key={index} className="course-item">
                      <img
                        src={course.imageUrl || "default-image.png"}
                        alt="Khóa học"
                        className="course-image"
                      />
                      <Box className="course-details">
                        <Typography variant="h6">{course.title}</Typography>
                        <Typography variant="body2">{course.description}</Typography>
                        <Box className="course-buttons">
                          <Button variant="contained" className="schedule-button">
                            Lịch học
                          </Button>
                          <Button variant="contained" className="students-button">
                            Học viên
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Box>
        </Box>
      </MDBox>
      <SecurityPopup open={isPopupOpen} onClose={handleClosePopup} />
    </PageLayout>
  );
};

export default AccountSettings;
