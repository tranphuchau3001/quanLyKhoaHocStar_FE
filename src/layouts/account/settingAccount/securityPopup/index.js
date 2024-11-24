import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SecurityPopup = ({ open, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const userId = localStorage.getItem("userId");
  const roleId = localStorage.getItem("roleId");
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [open]);

  const handleChangePass = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warn("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3030/user-api/changePassword", {
        userId: userId,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
        confirmPassword: confirmPassword || undefined,
        roleId: roleId,
      });

      if (response.data.success) {
        toast.success("Đổi mật khẩu thành công. Đang đăng xuất...");
        localStorage.removeItem("userId");
        setTimeout(() => {
          navigate("/authentication/sign-in");
        }, 2000);
      } else {
        toast.error("Mật khẩu cũ không chính xác");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        classes={{ paper: "security-dialog" }}
      >
        <DialogTitle className="popup-title">Cập nhật mật khẩu của bạn</DialogTitle>
        <DialogContent>
          <Typography variant="body2" className="popup-subtitle">
            Mật khẩu khi được thay đổi sẽ đăng xuất ngay lập tức.
          </Typography>
          <TextField
            label="Mật khẩu cũ"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="new-password"
            InputProps={{
              classes: { root: "popup-input" },
            }}
          />
          <TextField
            label="Mật khẩu mới"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              classes: { root: "popup-input" },
            }}
          />
          <TextField
            label="Xác nhận mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              classes: { root: "popup-input" },
            }}
          />
        </DialogContent>
        <DialogActions className="popup-actions">
          <Button onClick={handleChangePass} className="popup-save-button">
            Lưu lại
          </Button>
          <Button onClick={onClose} color="secondary">
            Thoát
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

SecurityPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SecurityPopup;
