import React, { useState, useEffect } from "react";
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
import { textAlign } from "@mui/system";
import { updateUser } from "./api/updateUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PopupComponent = ({ open, onClose, account, onSave }) => {
  if (!account) {
    return null;
  }

  const [formData, setFormData] = useState({
    name: account.name || "",
    email: account.email || "",
    phone: account.phone || "",
    avatar: account.avatarUrl || "",
    roles: {
      admin: account.roleId === 1,
      teacher: account.roleId === 2,
      user: account.roleId === 3,
    }, // Ánh xạ roleId sang roles
    status: account.status ? "active" : "inactive", // Chuyển boolean sang chuỗi
  });

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || "",
        email: account.email || "",
        phone: account.phone || "",
        avatar: account.avatarUrl || "",
        roles: {
          admin: account.roleId === 1,
          teacher: account.roleId === 2,
          user: account.roleId === 3,
        }, // Ánh xạ roleId sang roles
        status: account.status ? "active" : "inactive", // Chuyển boolean sang chuỗi
      });
    }
  }, [account]);

  const handleChange = (field) => (event) => {
    if (field === "roles") {
      setFormData({
        ...formData,
        roles: { ...formData.roles, [event.target.name]: event.target.checked },
      });
    } else if (field === "status") {
      setFormData({ ...formData, status: event.target.value });
    } else {
      setFormData({ ...formData, [field]: event.target.value });
    }
  };
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleChange = (event) => {
    const selectedRole = event.target.name;

    // Cập nhật lại formData để chỉ chọn một vai trò
    setFormData({
      ...formData,
      roles: {
        admin: selectedRole === "admin",
        teacher: selectedRole === "teacher",
        user: selectedRole === "user",
      },
    });
  };

  const handleSave = async () => {
    const { name, email, phone, roles } = formData;

    // Validate riêng từng trường
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

    try {
      const payload = {
        userId: account.userId, // Lấy từ account nếu có
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatarUrl: formData.avatar,
        roleId: formData.roles.admin ? 1 : formData.roles.teacher ? 2 : formData.roles.user ? 3 : 0, // Default roleId nếu không chọn
        status: formData.status === "active", // Convert "active"/"inactive" thành true/false
      };

      await updateUser(payload); // Gọi API cập nhật
      toast.success("Cập nhật thành công!");
      //   fetchUsers();
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
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <ToastContainer />
      <DialogTitle style={{ textAlign: "center", color: "Bllack" }}>
        Chỉnh sửa thông tin tài khoản
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4} container justifyContent="center" alignItems="center">
            <Avatar sx={{ width: 135, height: 135 }} src={formData.avatar} alt="Avatar" />
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
                  <Checkbox name="user" checked={formData.roles.user} onChange={handleRoleChange} />
                }
                label="Người dùng"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="teacher"
                    checked={formData.roles.teacher}
                    onChange={handleRoleChange}
                  />
                }
                label="Giảng viên"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="admin"
                    checked={formData.roles.admin}
                    onChange={handleRoleChange}
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
                <MenuItem value="active">
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <Typography variant="body3">Hoạt động</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="inactive">
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <Typography variant="body3">Ngừng hoạt động</Typography>
                  </Box>
                </MenuItem>
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

// Khai báo PropTypes
PopupComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  account: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    avatarUrl: PropTypes.string, // Đảm bảo đúng key
    roles: PropTypes.shape({
      user: PropTypes.bool,
      teacher: PropTypes.bool,
      admin: PropTypes.bool,
    }),
    roleId: PropTypes.number, // Thêm roleId
    status: PropTypes.bool, // Trạng thái là boolean
  }),
  onSave: PropTypes.func.isRequired,
};

export default PopupComponent;
