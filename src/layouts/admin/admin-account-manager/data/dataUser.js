import { useEffect, useState } from "react";
import {
  fetchUsers,
  commonColumns,
} from "layouts/admin/admin-account-manager/data/fetchData/fetchData";
import { generateRows } from "layouts/admin/admin-account-manager/data/generateRows";
import avt from "assets/images/favicon.png";

export default function dataUser() {
  const [users, setUsers] = useState({ admin: [], lecturer: [], student: [] });
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchUsers(setUsers);
  }, []);

  const handleEdit = (user) => {
    setSelectedAccount(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAccount(null);
  };

  const handleSave = (updatedAccount) => {
    console.log("Tài khoản đã cập nhật:", updatedAccount);
    setOpen(false);
  };

  return {
    columns: commonColumns,
    rows: generateRows(
      users.student,
      "success",
      "học viên",
      handleEdit,
      avt,
      open,
      handleClose,
      selectedAccount,
      handleSave,
      () => fetchUsers(setUsers)
    ),
  };
}
