import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import DataTable from "./Tables/DataTable";
import { Button, Stack, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import MDButton from "components/MDButton";

const LinkCell = ({ value }) => {
  return (
    <a href={value} target="_blank" rel="noopener noreferrer">
      {value || "Chưa có link"}
    </a>
  );
};

const ActionCell = ({ row, handleRowAction, handleDelete }) => (
  <div style={{ display: "flex", gap: "10px" }}>
    <Button
      variant="contained"
      color="info"
      size="small"
      onClick={() => handleRowAction(row)} // Call row action for editing
    >
      Chỉnh sửa
    </Button>
    <Button
      variant="contained"
      color="error"
      size="small"
      onClick={() => handleDelete(row.original.id)} // Pass row.id to handleDelete
    >
      Xóa
    </Button>
  </div>
);

ActionCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      // Các thuộc tính khác của row nếu cần thiết
    }).isRequired,
  }).isRequired,
  handleRowAction: PropTypes.func.isRequired, // Truyền hàm handleRowAction vào
  handleDelete: PropTypes.func.isRequired, // Truyền hàm handleDelete vào
};

const SchedulePopup = ({ open, onClose, courseData, selectedCourse }) => {
  const [rows, setRows] = useState([]);
  const [meetingDate, setMeetingDate] = useState("");
  const [urlMeeting, setUrlMeeting] = useState("");
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  const validateGoogleMeetUrl = (url) => {
    const regex = /^https:\/\/meet\.google\.com\/[a-zA-Z0-9-_]{10,}$/;
    return regex.test(url);
  };

  useEffect(() => {
    if (courseData && selectedCourse) {
      const formattedRows = courseData.map((course) => ({
        id: course.meetingId,
        name: `Khóa học ID ${selectedCourse.courseId}`,
        date: new Date(course.meetingDate).toLocaleString("vi-VN", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
        link: course.urlMeeting || "Chưa có link",
        action: "",
      }));
      setRows(formattedRows);
    }
  }, [courseData, selectedCourse]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900, // Tăng độ rộng cho modal
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <ToastContainer />
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <img
              src={
                selectedCourse && selectedCourse.imgUrl
                  ? require(`assets/images/Background/background-course/${selectedCourse.imgUrl}`)
                  : "default-image.jpg"
              }
              alt="Khóa học"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </Grid>
          <Grid item xs={8}>
            <Card sx={{ boxShadow: "none", borderRadius: 2 }}>
              <MDBox>
                <Stack spacing={2}>
                  <Typography variant="h3" textAlign={"center"}>
                    {selectedCourse ? selectedCourse.title : "Khóa học không xác định"}
                  </Typography>
                  <Typography variant="h6" textAlign={"center"}>
                    {selectedCourse ? selectedCourse.description : "Mô tả không có sẵn"}
                  </Typography>
                </Stack>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <Card sx={{ boxShadow: "none", borderRadius: 2, mt: 2 }}>
          <MDBox>
            <DataTable
              table={{
                columns: [
                  { Header: "Mã lịch học", accessor: "id", align: "center" },
                  { Header: "Ngày học", accessor: "date", align: "center" },
                  {
                    Header: "Link học",
                    accessor: "link",
                    align: "left",
                    Cell: LinkCell,
                  },
                ],
                rows: rows,
              }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
              sx={{ "& .MuiTable-root": { border: "none" } }}
            />
          </MDBox>
        </Card>
      </Box>
    </Modal>
  );
};

DataTable.propTypes = {
  table: PropTypes.shape({
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
  }).isRequired,
  onRowDoubleClick: PropTypes.func,
};

SchedulePopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  courseData: PropTypes.array.isRequired,
  selectedCourse: PropTypes.object,
};

LinkCell.propTypes = {
  value: PropTypes.string.isRequired,
};

export default SchedulePopup;
