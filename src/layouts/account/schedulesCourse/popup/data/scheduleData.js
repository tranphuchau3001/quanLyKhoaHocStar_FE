// scheduleData.js
export default function scheduleData() {
  return {
    columns: [
      { Header: "ID", accessor: "id", align: "center" },
      { Header: "Tên khóa học", accessor: "name", align: "left" },
      { Header: "Ngày học", accessor: "date", align: "center" },
      { Header: "Link học", accessor: "link", align: "left" },
    ],
    rows: [],
  };
}
