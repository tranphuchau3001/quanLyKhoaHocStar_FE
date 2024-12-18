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

const SchedulePopup = ({ open, onClose, courseData, selectedCourse }) => {
  const [rows, setRows] = useState([]);
  const [userName, setUserName] = useState("");
  const [status, setStatus] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState(null);

  useEffect(() => {
    if (courseData && selectedCourse) {
      const formattedRows = courseData.map((student) => ({
        id: student.enrollmentId,
        name: student.userName,
        course: student.courseName,
        status: student.status === "in_progress" ? "Đang học" : "Hoàn thành",
        paymentStatus: student.paymentStatus === "completed" ? "Đã thanh toán" : "Chưa thanh toán",
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
        <Grid container spacing={2}>
          {" "}
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
                  { Header: "Mã ghi danh", accessor: "id", align: "center" },
                  { Header: "Tên học viên", accessor: "name", align: "left" },
                  { Header: "Khóa học", accessor: "course", align: "left" },
                  { Header: "Trạng thái", accessor: "status", align: "center" },
                  { Header: "Thanh toán", accessor: "paymentStatus", align: "center" },
                ],
                rows: rows,
              }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
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

export default SchedulePopup;
