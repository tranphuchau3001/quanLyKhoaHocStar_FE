import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, TextField, List, ListItemIcon, ListItemText, ListItem, Grid } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import "./settingAccount.scss";
import PageLayout from "examples/LayoutContainers/PageLayout";
import axios from "axios";
import defaultAvatar from "assets/images/default.jpg";
import SecurityPopup from "layouts/account/settingAccount/securityPopup";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import MDBox from "components/MDBox";
import Swal from "sweetalert2";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";

const AccountSettings = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
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
  const navigate = useNavigate();

  useEffect(() => {
    checkLogin();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      // console.error("userId is empty, cannot fetch courses");
      return;
    }
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
            require(`../../../assets/images/Avatar-Account/${response.data.data.avatarUrl}`)
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

  const checkLogin = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      clearInput();
      // navigate("/home");
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
          console.log("Người dùng đã từ chối đăng nhập.");
        }
      });
      return;
    }
  };

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
    checkLogin();
    const userId = localStorage.getItem("userId");
    if (userId) {
      setIsPopupOpen(true);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const clearInput = () => {
    setUserInfo({
      name: "",
      phone: "",
    });
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
      <MDBox pt={6} pb={3} mt={3} padding={5}>
        <Grid container spacing={6} pt={6}>
          {/* Sidebar */}
          <Grid item xs={12} md={6}>
            <MDBox className="sidebar">
              <MDTypography variant="h3">Cài đặt tài khoản</MDTypography>
              <MDTypography variant="body2" color="secondary">
                Quản lý cài đặt tài khoản của bạn như thông tin cá nhân, cài đặt bảo mật, quản lý
                thông báo, v.v.
              </MDTypography>
              <List>
                <ListItem
                  onClick={() => {
                    checkLogin();
                    setCurrentTab("info");
                  }}
                  sx={{
                    mt: 3,
                    backgroundColor: currentTab === "info" ? "#000" : "transparent",
                    color: currentTab === "info" ? "#fff" : "inherit",
                    "&:hover": {
                      backgroundColor: "#d3d3d3",
                      color: "#000",
                    },
                  }}
                >
                  <ListItemIcon sx={{ ml: 3, color: currentTab === "info" ? "#fff" : "inherit" }}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Thông tin tài khoản" />
                </ListItem>
                <ListItem
                  onClick={() => {
                    setCurrentTab("security");
                    handleOpenPopup();
                  }}
                  sx={{
                    mt: 1,
                    backgroundColor: currentTab === "security" ? "#000" : "transparent",
                    color: currentTab === "security" ? "#fff" : "inherit",
                    "&:hover": {
                      backgroundColor: "#d3d3d3",
                      color: "#000",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ ml: 3, color: currentTab === "security" ? "#fff" : "inherit" }}
                  >
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText primary="Mật khẩu và bảo mật" />
                </ListItem>
                <ListItem
                  onClick={() => {
                    checkLogin();
                    setCurrentTab("courses");
                  }}
                  sx={{
                    mt: 1,
                    backgroundColor: currentTab === "courses" ? "#000" : "transparent",
                    color: currentTab === "courses" ? "#fff" : "inherit",
                    "&:hover": {
                      backgroundColor: "#d3d3d3",
                      color: "#000",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ ml: 3, color: currentTab === "calendar" ? "#fff" : "inherit" }}
                  >
                    <CalendarMonthIcon />
                  </ListItemIcon>
                  <ListItemText primary="Khóa học và lịch học" />
                </ListItem>
              </List>
            </MDBox>
          </Grid>

          {/* Content */}
          <Grid item xs={12} md={6}>
            <MDBox className="content">
              {currentTab === "info" && (
                <>
                  <MDTypography variant="h3">Thông tin cá nhân</MDTypography>
                  <MDTypography variant="body2" color="secondary">
                    Quản lý thông tin cá nhân của bạn
                  </MDTypography>

                  <MDBox className="info-section">
                    <ListItemText>
                      <MDTypography mt={2} variant="subtitle1">
                        Họ và tên
                      </MDTypography>
                      <TextField
                        value={userInfo.name || ""}
                        placeholder="Chưa cập nhật tên"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                      />
                    </ListItemText>
                  </MDBox>

                  <MDBox className="info-section">
                    <MDTypography mt={1} variant="subtitle1">
                      Ảnh đại diện
                    </MDTypography>

                    <Avatar
                      src={avatar}
                      alt="Avatar"
                      sx={{
                        width: 50,
                        height: 50,
                        cursor: "pointer",
                        border: "1px solid #000000",
                        borderRadius: "50%",
                      }}
                      onDoubleClick={handleDoubleClick}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref={inputFileRef}
                      onChange={handleFileChange}
                    />
                  </MDBox>

                  <MDBox className="info-section">
                    <MDTypography mt={1} variant="subtitle1">
                      Số điện thoại
                    </MDTypography>
                    <TextField
                      value={userInfo.phone || ""}
                      placeholder="Chưa cập nhật số điện thoại"
                      fullWidth
                      variant="outlined"
                      onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    />
                  </MDBox>

                  <MDButton
                    variant="contained"
                    color="primary"
                    className="save-button"
                    onClick={handleSave}
                    sx={{ padding: "10px 20px", mt: 3 }}
                  >
                    Lưu lại
                  </MDButton>
                </>
              )}

              {currentTab === "courses" && (
                <>
                  <MDTypography variant="h3">Khóa học đang quản lý</MDTypography>
                  <MDTypography variant="body2" color="secondary">
                    Quản lý khóa học bạn đang quản lý và có thể thêm lịch học cho khóa học này
                  </MDTypography>
                  <MDBox className="course-list">
                    {courses.map((course, index) => (
                      <MDBox key={index} className="course-item">
                        <img
                          src={course.imageUrl || "default-image.png"}
                          alt="Khóa học"
                          className="course-image"
                        />
                        <MDBox className="course-details">
                          <MDTypography variant="h6">{course.title}</MDTypography>
                          <MDTypography variant="body2">{course.description}</MDTypography>
                          <MDBox className="course-buttons">
                            <MDButton variant="contained" className="schedule-button">
                              Lịch học
                            </MDButton>
                            <MDButton variant="contained" className="students-button">
                              Học viên
                            </MDButton>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                    ))}
                  </MDBox>
                </>
              )}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <SecurityPopup open={isPopupOpen} onClose={handleClosePopup} />
      <Footer />
    </PageLayout>
  );
};

export default AccountSettings;
