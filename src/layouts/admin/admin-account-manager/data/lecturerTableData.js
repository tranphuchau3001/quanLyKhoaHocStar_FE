import { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";

// Images
import avt from "assets/images/favicon.png";
import PopupComponent from "../popup";

export default function data() {
  const [users, setUsers] = useState({
    admin: [],
    lecturer: [],
    student: [],
  });

  const [open, setOpen] = useState(false); // Trạng thái mở/đóng popup
  const [selectedAccount, setSelectedAccount] = useState(null); // Tài khoản được chỉnh sửa

  const fetchGetAllUser = async () => {
    try {
      const response = await fetch("http://localhost:3030/user-api/getAllUser");
      const result = await response.json();

      if (result.success) {
        const { data } = result;

        const admin = data.filter((user) => user.roleId === 1);
        const lecturer = data.filter((user) => user.roleId === 2);
        const student = data.filter((user) => user.roleId === 3);

        setUsers({ admin, lecturer, student });
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchGetAllUser();
  }, []);

  const handleEdit = (users) => {
    setSelectedAccount(users); // Gán tài khoản cần chỉnh sửa
    setOpen(true); // Mở popup
  };

  // Hàm đóng popup
  const handleClose = () => {
    setOpen(false);
    setSelectedAccount(null); // Xóa dữ liệu sau khi đóng popup
  };

  // Hàm lưu thay đổi (từ popup)
  const handleSave = (updatedAccount) => {
    console.log("Tài khoản đã cập nhật:", updatedAccount);
    // Thay đổi danh sách tài khoản (nếu cần)
    setOpen(false); // Đóng popup
  };

  // eslint-disable-next-line react/prop-types
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  return {
    columns: [
      { Header: "stt", accessor: "stt", width: "5%", align: "center" },
      { Header: "họ tên", accessor: "fullName", width: "25%", align: "left" },
      { Header: "vai trò", accessor: "role", align: "center" },
      { Header: "số điện thoại", accessor: "phone", align: "center" },
      { Header: "trạng thái", accessor: "status", align: "center" },
      { Header: "hành động", accessor: "action", align: "center" },
    ],

    rows: [
      ...users.lecturer.map((user, index) => ({
        stt: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {index + 1}
          </MDTypography>
        ),
        fullName: <Author image={avt} name={user.name} email={user.email} />,
        status: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent={user.status ? "Active" : "Inactive"}
              color={user.status ? "success" : "error"}
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ),
        role: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="giảng viên" color="info" variant="gradient" size="sm" />
          </MDBox>
        ),
        phone: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {user.phone}
          </MDTypography>
        ),
        action: (
          <MDBox display="flex" gap={1}>
            <MDButton
              variant="contained"
              color="info"
              size="small"
              onClick={() => handleEdit(user)}
            >
              Chỉnh sửa
            </MDButton>

            {/* <MDButton
              variant="contained"
              color={user.status ? "error" : "success"}
              size="small"
              onClick={() => {
                const updatedStatus = !user.status;
                console.log(updatedStatus ? "Mở lại tài khoản" : "Khóa tài khoản", user);
                // Cập nhật trạng thái người dùng trong users
                setUsers((prev) => ({
                  ...prev,
                  admin: prev.admin.map((u) =>
                    u.id === user.id ? { ...u, status: updatedStatus } : u
                  ),
                }));
              }}
            >
              {user.status ? "Khóa tài khoản" : "Mở lại tài khoản"}
            </MDButton> */}
            <PopupComponent
              open={open}
              onClose={handleClose}
              account={selectedAccount} // Truyền selectedAccount thay vì users
              onSave={handleSave}
              fetchUsers={fetchGetAllUser}
            />
          </MDBox>
        ),
      })),
    ],
  };
}
