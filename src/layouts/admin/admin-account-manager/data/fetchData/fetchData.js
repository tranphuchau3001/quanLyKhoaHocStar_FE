export const fetchData = async (setUsers) => {
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

export const commonColumns = [
  { Header: "stt", accessor: "stt", width: "5%", align: "center" },
  { Header: "họ tên", accessor: "fullName", width: "25%", align: "left" },
  { Header: "vai trò", accessor: "role", align: "center" },
  { Header: "số điện thoại", accessor: "phone", align: "center" },
  { Header: "trạng thái", accessor: "status", align: "center" },
  { Header: "hành động", accessor: "action", align: "center" },
];
