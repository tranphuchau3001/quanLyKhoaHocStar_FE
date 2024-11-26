import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import Author from "layouts/admin/admin-account-manager/data/Author";
import PopupComponent from "layouts/admin/admin-account-manager/popup/index";

export const generateRows = (
  users,
  roleBadgeColor,
  roleLabel,
  handleEdit,
  avt,
  open,
  handleClose,
  selectedAccount,
  handleSave,
  fetchUsers
) => {
  return users.map((user, index) => ({
    key: user.userId,
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
        <MDBadge badgeContent={roleLabel} color={roleBadgeColor} variant="gradient" size="sm" />
      </MDBox>
    ),
    phone: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {user.phone}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" gap={1}>
        <MDButton variant="contained" color="info" size="small" onClick={() => handleEdit(user)}>
          Chỉnh sửa
        </MDButton>
        <PopupComponent
          open={open}
          onClose={handleClose}
          account={selectedAccount}
          onSave={handleSave}
          fetchUsers={fetchUsers}
        />
      </MDBox>
    ),
  }));
};
