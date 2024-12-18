import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Grid,
  Avatar,
  Input,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { updateUser } from "layouts/admin/admin-account-manager/popup/api/updateUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "api/apiClient";

const PopupComponent = ({ open, onClose, account, onSave }) => {
  if (!account) {
    return null;
  }

  const [formData, setFormData] = useState(() => ({
    name: account?.name || "",
    email: account?.email || "",
    phone: account?.phone || "",
    avatar: account?.avatarUrl ? `${account.avatarUrl}` : "",
    roles: {
      admin: account?.roleId === 1,
      teacher: account?.roleId === 2,
      user: account?.roleId === 3,
    },
    status: account?.status ? "active" : "inactive",
  }));

  const memoizedAccount = useMemo(() => {
    if (account) {
      return {
        name: account.name || "",
        email: account.email || "",
        phone: account.phone || "",
        avatar: account.avatarUrl || "",
        roles: {
          admin: account.roleId === 1,
          teacher: account.roleId === 2,
          user: account.roleId === 3,
        },
        status: account.status ? "active" : "inactive",
      };
    }
    return {};
  }, [account]);

  const handleChange = (field) => (event) => {
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData };
      if (field === "roles") {
        newFormData.roles[event.target.name] = event.target.checked;
      } else if (field === "status") {
        newFormData.status = event.target.value;
      } else {
        newFormData[field] = event.target.value;
      }
      return newFormData;
    });
  };
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await apiClient.post("/api/v1/upload/upload-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // console.log(response);
        const avatarUrl = response.data;

        setFormData((prevFormData) => ({
          ...prevFormData,
          avatar: avatarUrl,
        }));

        toast.success("Upload avatar thành công!");
      } catch (error) {
        toast.error("Lỗi khi upload avatar!");
      }
    }
  };

  const handleSave = async () => {
    const { name, email, phone, roles, status } = formData;

    // Kiểm tra thông tin bắt buộc
    if (!name) {
      toast.error("Họ và tên là bắt buộc!");
      return;
    }
    if (!email) {
      toast.error("Email là bắt buộc!");
      return;
    }
    if (!phone) {
      toast.error("Số điện thoại là bắt buộc!");
      return;
    }
    if (!roles.admin && !roles.teacher && !roles.user) {
      toast.error("Vui lòng chọn một vai trò!");
      return;
    }

    // Kiểm tra không cho vô hiệu hóa tài khoản đang đăng nhập
    const currentEmail = localStorage.getItem("email");
    if (email === currentEmail && status !== "active") {
      toast.error("Không thể vô hiệu hóa tài khoản đang đăng nhập!");
      return;
    }

    try {
      const payload = {
        userId: account.userId,
        name,
        email,
        phone,
        avatarUrl: formData.avatar,
        roleId: roles.admin ? 1 : roles.teacher ? 2 : roles.user ? 3 : 0,
        status: status === "active",
      };

      await updateUser(payload);
      toast.success("Cập nhật thành công!");

      const toastDuration = 5000;
      setTimeout(() => {
        onSave();
        onClose();
      }, toastDuration);
    } catch (error) {
      alert("Lỗi khi cập nhật thông tin!");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        backgroundColor: "rgba(249, 249, 249, 0.47)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <ToastContainer />
      <DialogTitle style={{ textAlign: "center" }}>Chỉnh sửa thông tin tài khoản</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4} container justifyContent="center" alignItems="center">
            <Avatar
              sx={{ width: 135, height: 135 }}
              src={
                formData.avatar
                  ? `/avatar-Account/${formData.avatar}`
                  : "/avatar-Account/default.png"
              }
              alt="Avatar"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload">
              <IconButton component="span">
                <PhotoCamera />
              </IconButton>
            </label>
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Họ và tên"
              value={formData.name}
              onChange={handleChange("name")}
              margin="normal"
              sx={{
                "& .MuiInputBase-root": {
                  height: "40px", // Chiều cao của Input
                },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={handleChange("email")}
              margin="normal"
              sx={{
                "& .MuiInputBase-root": {
                  height: "40px", // Chiều cao của Input
                },
              }}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.phone}
              onChange={handleChange("phone")}
              margin="normal"
              sx={{
                "& .MuiInputBase-root": {
                  height: "40px", // Chiều cao của Input
                },
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="subtitle2">Vai trò</Typography>
            <Box display="flex" justifyContent="space-between" width="100%">
              <FormControlLabel
                control={
                  <Checkbox
                    name="user"
                    checked={formData.roles.user}
                    onChange={handleChange("roles")}
                  />
                }
                label="Người dùng"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="teacher"
                    checked={formData.roles.teacher}
                    onChange={handleChange("roles")}
                  />
                }
                label="Giảng viên"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="admin"
                    checked={formData.roles.admin}
                    onChange={handleChange("roles")}
                  />
                }
                label="Admin"
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                onChange={handleChange("status")}
                label="Trạng thái"
                displayEmpty
                sx={{
                  height: 35, // Thiết lập chiều cao của Select
                  "& .MuiSelect-select": {
                    paddingTop: "6px", // Cân chỉnh nội dung của Select nếu cần thiết
                    paddingBottom: "6px", // Cân chỉnh nội dung của Select nếu cần thiết
                  },
                  "& .MuiInputBase-root": {
                    height: "35px", // Thiết lập chiều cao cho toàn bộ InputBase (bao gồm Select)
                  },
                }}
              >
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: "#00f813", // Màu xanh lá sáng
            color: "#ffffff", // Chữ màu trắng
            "&:hover": {
              backgroundColor: "#388e3c", // Màu xanh đậm hơn khi hover
            },
          }}
        >
          Lưu
        </Button>
        <Button onClick={onClose}>Hủy</Button>
      </DialogActions>
    </Dialog>
  );
};

PopupComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  account: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default PopupComponent;
