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
import defaultAvatar from "../../../assets/images/avatar-Account/image.png"; // Đường dẫn chính xác
import { color } from "@mui/system";
const AccountSettings = () => {
  const [userInfo, setUserInfo] = useState({
    name: null,
    phone: null,
    avatarUrl: null,
  });
  const [avatar, setAvatar] = useState(defaultAvatar);
  const userId = localStorage.getItem("userId");
  const inputFileRef = useRef(null);
  const [currentTab, setCurrentTab] = useState("info");

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
  }, [userId]);

  const handleDoubleClick = () => {
    inputFileRef.current.click(); // Kích hoạt thẻ input file
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Cập nhật avatar với ảnh vừa chọn
      };
      reader.readAsDataURL(file);
    }
  };

  const avatarPath = userInfo.avatarUrl
    ? require(`../../../assets/images/avatar-Account/${userInfo.avatarUrl}`)
    : defaultAvatar;
  return (
    <PageLayout>
      <Navbar />
      <Box className="account-settings">
        <Box className="sidebar">
          <Typography variant="h3">Cài đặt tài khoản</Typography>
          <Typography variant="body2" color="textSecondary">
            Quản lý cài đặt tài khoản của bạn như thông tin cá nhân, cài đặt bảo mật, quản lý thông
            báo, v.v.
          </Typography>
          <List>
            <ListItem
              button
              onClick={() => setCurrentTab("info")}
              sx={{
                backgroundColor: currentTab === "info" ? "#000" : "transparent",
                color: currentTab === "info" ? "#fff" : "inherit",
              }}
            >
              <ListItemIcon sx={{ color: currentTab === "info" ? "#fff" : "inherit" }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Thông tin tài khoản" />
            </ListItem>
            <ListItem
              button
              onClick={() => setCurrentTab("security")}
              sx={{
                backgroundColor: currentTab === "security" ? "#000" : "transparent",
                color: currentTab === "security" ? "#fff" : "inherit",
              }}
            >
              <ListItemIcon sx={{ color: currentTab === "security" ? "#fff" : "inherit" }}>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary="Mật khẩu và bảo mật" />
            </ListItem>
          </List>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box className="content">
          <Typography variant="h3">Thông tin cá nhân</Typography>
          <Typography variant="body2" color="textSecondary">
            Quản lý thông tin cá nhân của bạn
          </Typography>

          <Box className="info-section">
            <ListItemText>
              <Typography variant="subtitle1">Họ và tên</Typography>
              <TextField
                value={userInfo.name || "Chưa cập nhật tên"}
                fullWidth
                variant="outlined"
              />
            </ListItemText>
          </Box>

          <Box className="info-section">
            <Typography variant="subtitle1">Ảnh đại diện</Typography>

            <Avatar
              src={avatar} // Sử dụng avatar đã được kiểm tra
              alt="Avatar"
              sx={{
                width: 50,
                height: 50,
                cursor: "pointer",
                border: "1px solid #000000", // Thay đổi màu sắc border nếu cần
                borderRadius: "50%", // Đảm bảo border vẫn giữ hình tròn
              }}
              onDoubleClick={handleDoubleClick} // Thêm sự kiện double click
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }} // Ẩn input file
              ref={inputFileRef} // Tham chiếu đến input file
              onChange={handleFileChange} // Xử lý khi chọn file
            />
          </Box>

          <Box className="info-section">
            <Typography variant="subtitle1">Số điện thoại</Typography>
            <TextField
              value={userInfo.phone || "Chưa cập nhật số điện thoại"}
              fullWidth
              variant="outlined"
            />
          </Box>

          <Button variant="contained" color="primary" className="save-button">
            Lưu lại
          </Button>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default AccountSettings;
