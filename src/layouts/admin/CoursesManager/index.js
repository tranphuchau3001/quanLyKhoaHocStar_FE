import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import {
  Container,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
  Box,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import "./coursesManager.scss";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const defaultImage = "https://via.placeholder.com/150";

const CourseManagement = () => {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [schedule, setSchedule] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [price, setPrice] = useState(0);
  const [active, setActive] = useState(false);
  const [inactive, setInactive] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(defaultImage);
  const [paidCourses, setPaidCourses] = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [expiredCourses, setExpiredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState(0);
  const [coursesPerPage, setCoursesPerPage] = useState(5);

  const handleActiveChange = () => {
    setActive(true);
    setInactive(false);
  };

  const handleInactiveChange = () => {
    setInactive(true);
    setActive(false);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(selectedFile);
        setFileUrl(imageUrl);
        setFile(selectedFile);
      } else {
        Swal.fire("Cảnh báo!", "Vui lòng chọn một file hình ảnh.", "warning");
      }
    }
  };

  const handleDeleteImage = () => {
    setFileUrl(defaultImage);
  };

  const updateCourseImage = (imageUrl) => {
    setFileUrl(imageUrl);
  };

  const handleSubmit = async () => {
    if (!courseName) {
      toast.warn("Vui lòng nhập tên khóa học!");
      document.getElementById("courseNameInput").focus();
      return;
    }
    if (!description) {
      toast.warn("Vui lòng nhập mô tả khóa học!");
      document.getElementById("descriptionInput").focus();
      return;
    }
    if (price > 0 && !schedule) {
      toast.warn("Vui lòng nhập lịch học!");
      document.getElementById("scheduleInput").focus();
      return;
    }
    if (price > 0 && !meetingTime) {
      toast.warn("Vui lòng nhập ca học!");
      document.getElementById("shiftInput").focus();
      return;
    }
    if (price > 0 && !selectedInstructor) {
      toast.warn("Vui lòng chọn giảng viên đảm nhiệm!");
      document.getElementById("instructor-select").focus();
      return;
    }
    if (!startDate) {
      toast.warn("Vui lòng chọn ngày bắt đầu!");
      document.getElementById("startDateInput").focus();
      return;
    }
    if (!endDate) {
      toast.warn("Vui lòng chọn ngày kết thúc!");
      document.getElementById("endDateInput").focus();
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.warn("Ngày bắt đầu không thể sau ngày kết thúc!");
      document.getElementById("startDateInput").focus();
      return;
    }
    if (!active && !inactive) {
      toast.warn("Vui lòng chọn trạng thái!");
      return;
    }
    if (!file) {
      toast.warn("Vui lòng chọn một ảnh khóa học trước khi lưu.");
      return;
    }
    const status = active ? true : false;
    const instructorData = price > 0 && selectedInstructor ? selectedInstructor : null;
    const courseData = {
      imgUrl: file.name,
      title: courseName,
      description,
      startDate,
      endDate,
      price: price,
      schedule: price > 0 ? schedule : null,
      meetingTime: price > 0 ? meetingTime : null,
      status,
      instructor: instructorData,
    };
    console.log("Dữ liệu gửi lên API:", courseData);
    console.log("Dữ liệu gửi lên API:", JSON.stringify(courseData, null, 2));

    try {
      const response = await axios.post("http://localhost:3030/course-api/saveCourse", courseData);
      if (response.data.success) {
        Swal.fire("Thành công!", "Khóa học đã được thêm.", "success");
        if (file) {
          const uploadedFileName = await handleUpload(file);
          await updateCourseImage(response.data.courseId, uploadedFileName);
        }
        fetchCourses();
        resetForm();
      } else {
        Swal.fire("Lỗi!", "Có lỗi xảy ra khi thêm khóa học. Vui lòng thử lại!", "error");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API thêm khóa học:", error);
      Swal.fire("Lỗi!", "Có lỗi xảy ra khi thêm khóa học. Vui lòng thử lại!", "error");
    }
  };
  const handleUpdateCourse = async () => {
    if (!courseCode) {
      toast.warn("Vui lòng chọn khóa học!");
      return;
    }

    if (!courseName) {
      toast.warn("Vui lòng nhập tên khóa học!");
      document.getElementById("courseNameInput").focus();
      return;
    }
    if (!description) {
      toast.warn("Vui lòng nhập mô tả khóa học!");
      document.getElementById("descriptionInput").focus();
      return;
    }
    if (price > 0 && !schedule) {
      toast.warn("Vui lòng nhập lịch học!");
      document.getElementById("scheduleInput").focus();
      return;
    }
    if (price > 0 && !meetingTime) {
      toast.warn("Vui lòng nhập ca học!");
      document.getElementById("shiftInput").focus();
      return;
    }
    if (price > 0 && !selectedInstructor) {
      toast.warn("Vui lòng chọn giảng viên đảm nhiệm!");
      document.getElementById("instructor-select").focus();
      return;
    }
    if (!startDate) {
      toast.warn("Vui lòng chọn ngày bắt đầu!");
      document.getElementById("startDateInput").focus();
      return;
    }
    if (!endDate) {
      toast.warn("Vui lòng chọn ngày kết thúc!");
      document.getElementById("endDateInput").focus();
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.warn("Ngày bắt đầu không thể sau ngày kết thúc!");
      document.getElementById("startDateInput").focus();
      return;
    }
    if (!active && !inactive) {
      toast.warn("Vui lòng chọn trạng thái!");
      return;
    }
    if (!file) {
      toast.warn("Vui lòng chọn một ảnh khóa học trước khi lưu.");
      return;
    }

    const status = active ? true : false;
    const instructorData = price > 0 && selectedInstructor ? selectedInstructor : null;
    const courseData = {
      courseId: courseCode,
      imgUrl: file.name,
      title: courseName,
      description,
      startDate,
      endDate,
      price: price,
      schedule: price > 0 ? schedule : null,
      meetingTime: price > 0 ? meetingTime : null,
      status,
      instructor: { userId: selectedInstructor || "" },
    };

    console.log("Dữ liệu gửi lên API:", courseData);

    try {
      const response = await axios.put("http://localhost:3030/course-api/updateCourse", courseData);

      if (response.data.success) {
        Swal.fire("Thành công!", "Khóa học đã được cập nhật.", "success");

        if (file) {
          const uploadedFileName = await handleUpload(file);
          await updateCourseImage(response.data.courseId, uploadedFileName);
        }

        fetchCourses();
      } else {
        console.error("API trả về lỗi:", response.data.error || "Không xác định");
        Swal.fire("Lỗi!", "Có lỗi xảy ra khi cập nhật khóa học. Vui lòng thử lại!", "error");
      }
    } catch (error) {
      if (error.response) {
        console.error("Lỗi từ server:", error.response.data);
        Swal.fire(
          "Lỗi!",
          `Server báo lỗi: ${error.response.data.message || "Không rõ lý do"}`,
          "error"
        );
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ server:", error.request);
        Swal.fire(
          "Lỗi!",
          "Không thể kết nối với server. Vui lòng kiểm tra mạng hoặc thử lại sau.",
          "error"
        );
      } else {
        console.error("Lỗi không rõ:", error.message);
        Swal.fire("Lỗi!", `Đã xảy ra lỗi: ${error.message}`, "error");
      }
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:3030/upload-api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      updateCourseImage(response.data.fileName);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };
  const resetForm = () => {
    setCourseName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setPrice(0);
    setSchedule("");
    setMeetingTime("");
    setMeetingTime("");
    setSelectedInstructor("");
    setActive(true);
    setFile(null);
    setFileUrl(defaultImage);
  };

  const fetchInstructors = async () => {
    try {
      const response = await fetch("http://localhost:3030/user-api/getAllUser");
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const instructors = result.data.filter((user) => user.roleId === 2);
        setInstructors(instructors);
      } else {
        console.error("Dữ liệu trả về không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3030/course-api/getAllCourse");
      const courses = response.data.data;
      if (Array.isArray(courses)) {
        const currentDate = moment();
        const paid = courses.filter(
          (course) =>
            course.price > 0 &&
            moment(course.endDate).isAfter(currentDate) &&
            course.status === true
        );
        const free = courses.filter(
          (course) =>
            course.price === 0 &&
            moment(course.endDate).isAfter(currentDate) &&
            course.status === true
        );
        const expiredCourses = courses.filter(
          (course) => moment(course.endDate).isBefore(currentDate) || course.status === false
        );

        setPaidCourses(paid);
        setFreeCourses(free);
        setExpiredCourses(expiredCourses);
        console.log(paid);
        console.log(free);
        console.log(expiredCourses);
      } else {
        console.error("Dữ liệu không phải là một mảng:", courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRowDoubleClick = async (courseId) => {
    console.log("courseId nhận được:", courseId);
    if (!courseId) {
      console.error("Course ID không hợp lệ:", courseId);
      Swal.fire("Lỗi!", "ID khóa học không hợp lệ.", "error");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3030/course-api/getCourseById?courseId=${courseId}`
      );
      const courseData = response.data.data;

      console.log(courseData);

      setCourseCode(courseData.courseId);
      setCourseName(courseData.title);
      setDescription(courseData.description);
      setStartDate(courseData.startDate);
      setEndDate(courseData.endDate);
      setSchedule(courseData.schedule);
      setMeetingTime(courseData.meetingTime);
      setPrice(courseData.price);
      setActive(courseData.status === true);
      setInactive(courseData.status === false);
      const instructorId = courseData.instructor;
      const instructor = instructors.find((instructor) => instructor.userId === instructorId);

      if (instructor) {
        setSelectedInstructor(instructor.userId);
      } else {
        setSelectedInstructor("");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API lấy thông tin khóa học:", error);
      if (error.response) {
        console.error("Chi tiết lỗi:", error.response.data);
      }
      Swal.fire("Lỗi!", "Không thể tải thông tin khóa học.", "error");
    }
  };

  const handleDelete = async (courseId) => {
    if (!courseId) {
      Swal.fire("Lỗi!", "ID khóa học không hợp lệ.", "error");
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn xóa khóa học này?",
        text: "Thao tác này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:3030/course-api/deleteCourse/${courseId}`);
        Swal.fire("Đã xóa!", "Khóa học đã được xóa thành công.", "success");

        fetchCourses();
      }
    } catch (error) {
      console.error("Lỗi khi xóa khóa học:", error);
      Swal.fire("Lỗi!", "Không thể xóa khóa học.", "error");
    }
  };

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...other}
      >
        {value === index && <>{children}</>}
      </div>
    );
  };

  TabPanel.propTypes = {
    children: PropTypes.node.isRequired,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;

  const [currentPagePaid, setCurrentPagePaid] = useState(1);
  const [currentPageFree, setCurrentPageFree] = useState(1);
  const [currentPageExpired, setCurrentPageExpired] = useState(1);

  const totalPaidPages = Math.ceil(paidCourses.length / coursesPerPage);
  const totalFreePages = Math.ceil(freeCourses.length / coursesPerPage);
  const totalExpiredPages = Math.ceil(expiredCourses.length / coursesPerPage);

  const getCurrentCourses = (courses, currentPage, coursesPerPage) => {
    const startIndex = (currentPage - 1) * coursesPerPage;
    return courses.slice(startIndex, startIndex + coursesPerPage);
  };

  const handleNextPagePaid = () => {
    setCurrentPagePaid((prevPage) => (prevPage < totalPaidPages ? prevPage + 1 : prevPage));
  };

  const handlePrevPagePaid = () => {
    setCurrentPagePaid((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const handleNextPageFree = () => {
    setCurrentPageFree((prevPage) => (prevPage < totalFreePages ? prevPage + 1 : prevPage));
  };

  const handlePrevPageFree = () => {
    setCurrentPageFree((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const handleNextPageExpired = () => {
    setCurrentPageExpired((prevPage) => (prevPage < totalExpiredPages ? prevPage + 1 : prevPage));
  };

  const handlePrevPageExpired = () => {
    setCurrentPageExpired((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer />
      <Container maxWidth="lg" style={{ backgroundColor: "#f4f4f4", padding: "20px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper
              style={{
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <div style={{ position: "relative" }}>
                    <input
                      type="file"
                      accept="image/*"
                      id="file-input"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <label htmlFor="file-input" style={{ cursor: "pointer" }}>
                      <img
                        src={fileUrl}
                        alt="Upload"
                        style={{
                          width: "100%",
                          height: "125px",
                          objectFit: "cover",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                      />
                    </label>
                    <IconButton
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                      }}
                      aria-label="delete"
                      onClick={handleDeleteImage}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">Mã khóa học:</Typography>
                  <Typography variant="h6">{courseCode || "Không có thông tin"}</Typography>
                  {price > 0 && (
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="instructor-label" shrink>
                        Chọn người hướng dẫn:
                      </InputLabel>
                      <Select
                        labelId="instructor-label"
                        id="instructor-select"
                        value={selectedInstructor || ""} // Đảm bảo giá trị hợp lệ
                        onChange={(e) => setSelectedInstructor(e.target.value)}
                        label="Giảng viên đảm nhiệm"
                        sx={{ height: 40 }}
                      >
                        {/* Kiểm tra mảng instructor có hợp lệ không */}
                        {instructors && Array.isArray(instructors) && instructors.length > 0 ? (
                          instructors.map((instructor) => (
                            <MenuItem key={instructor.userId} value={instructor.userId}>
                              {instructor.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>Chưa có giảng viên nào</MenuItem> // Nếu không có instructor
                        )}
                      </Select>
                    </FormControl>
                  )}
                </Grid>
              </Grid>
              <TextField
                fullWidth
                margin="normal"
                id="courseNameInput"
                label="Tên khóa học:"
                variant="outlined"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                id="descriptionInput"
                label="Mô tả:"
                variant="outlined"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <TextField
                id="startDateInput"
                fullWidth
                margin="normal"
                label="Ngày bắt đầu:"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <TextField
                id="endDateInput"
                fullWidth
                margin="normal"
                label="Ngày kết thúc:"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {price > 0 && (
                <>
                  <TextField
                    fullWidth
                    margin="normal"
                    id="scheduleInput"
                    label="Lịch học:"
                    variant="outlined"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                  />
                  <TextField
                    id="shiftInput"
                    fullWidth
                    margin="normal"
                    label="Ca học:"
                    variant="outlined"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                  />
                </>
              )}
              <TextField
                fullWidth
                margin="normal"
                label="Giá khóa học:"
                variant="outlined"
                type="text"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={active} onChange={handleActiveChange} value="true" />}
                  label="Hoạt động"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={inactive} onChange={handleInactiveChange} value="false" />
                  }
                  label="Không hoạt động"
                />
              </FormGroup>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "green", color: "white" }}
                  onClick={handleSubmit}
                >
                  Thêm khóa học
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "red", color: "white" }}
                  onClick={handleUpdateCourse}
                >
                  Sửa thông tin
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper>
              <Tabs value={value} onChange={handleChange} aria-label="course tabs">
                <Tab label="Khóa học Có phí" />
                <Tab label="Khóa học miễn phí" />
                <Tab label="Khóa học hết hạn" />
              </Tabs>
              <TabPanel value={value} index={0}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650, tableLayout: "fixed" }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left" width={50}>
                          STT
                        </TableCell>
                        <TableCell align="left" width={100}>
                          Tên khóa học
                        </TableCell>{" "}
                        <TableCell align="left">Giá</TableCell>
                        <TableCell align="left">Ngày bắt đầu</TableCell>
                        <TableCell align="left">Ngày kết thúc</TableCell>
                        <TableCell align="left">Xóa</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getCurrentCourses(paidCourses, currentPagePaid, coursesPerPage).map(
                        (course, index) => (
                          <TableRow
                            key={course.courseId}
                            onDoubleClick={() => handleRowDoubleClick(course.courseId)}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {(currentPagePaid - 1) * coursesPerPage + index + 1}
                            </TableCell>
                            <TableCell align="left">{course.title}</TableCell>
                            <TableCell align="left">{course.price}</TableCell>
                            <TableCell align="left">
                              {moment(course.startDate).format("DD-MM-YYYY")}
                            </TableCell>
                            <TableCell align="left">
                              {moment(course.endDate).format("DD-MM-YYYY")}
                            </TableCell>
                            <TableCell align="left">
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleDelete(course.courseId)}
                                style={{ color: "white" }}
                              >
                                Xóa
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                  <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={currentPagePaid === 1}
                      onClick={handlePrevPagePaid}
                      style={{ color: "white" }}
                    >
                      Trang trước
                    </Button>
                    <Typography style={{ margin: "0 20px", lineHeight: "36px" }}>
                      Trang {currentPagePaid} / {totalPaidPages}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={currentPagePaid === totalPaidPages}
                      onClick={handleNextPagePaid}
                      style={{ color: "white" }}
                    >
                      Trang sau
                    </Button>
                  </div>
                </TableContainer>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Tên khóa học</TableCell>
                        <TableCell>Ngày bắt đầu</TableCell>
                        <TableCell>Ngày kết thúc</TableCell>
                        <TableCell>Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getCurrentCourses(freeCourses, currentPageFree, coursesPerPage).map(
                        (course, index) => (
                          <TableRow
                            key={course.courseId}
                            onDoubleClick={() => handleRowDoubleClick(course.courseId)}
                            style={{ cursor: "pointer" }}
                          >
                            <TableCell>
                              {(currentPagePaid - 1) * coursesPerPage + index + 1}
                            </TableCell>
                            <TableCell>{course.title}</TableCell>
                            <TableCell>{moment(course.startDate).format("DD-MM-YYYY")}</TableCell>
                            <TableCell>{moment(course.endDate).format("DD-MM-YYYY")}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleDelete(course.courseId)}
                                style={{ color: "white" }}
                              >
                                Xóa
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                  <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={currentPageFree === 1}
                      onClick={handlePrevPageFree}
                      style={{ color: "white" }}
                    >
                      Trang trước
                    </Button>
                    <Typography style={{ margin: "0 20px", lineHeight: "36px" }}>
                      Trang {currentPageFree} / {totalFreePages}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={currentPageFree === totalFreePages}
                      onClick={handleNextPageFree}
                      style={{ color: "white" }}
                    >
                      Trang sau
                    </Button>
                  </div>
                </TableContainer>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Tên khóa học</TableCell>
                        <TableCell>Ngày bắt đầu</TableCell>
                        <TableCell>Ngày kết thúc</TableCell>
                        <TableCell>Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getCurrentCourses(expiredCourses, currentPageExpired, coursesPerPage).map(
                        (course, index) => (
                          <TableRow
                            key={course.courseId}
                            onDoubleClick={() => handleRowDoubleClick(course.courseId)}
                            style={{ cursor: "pointer" }}
                          >
                            <TableCell>{course.courseId}</TableCell>
                            <TableCell>{course.title}</TableCell>
                            <TableCell>{moment(course.startDate).format("DD-MM-YYYY")}</TableCell>
                            <TableCell>{moment(course.endDate).format("DD-MM-YYYY")}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleDelete(course.courseId)}
                                style={{ color: "white" }}
                              >
                                Xóa
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                  <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={currentPageExpired === 1}
                      onClick={handlePrevPageExpired}
                      style={{ color: "white" }}
                    >
                      Trang trước
                    </Button>
                    <Typography style={{ margin: "0 20px", lineHeight: "36px" }}>
                      Trang {currentPageExpired} / {totalExpiredPages}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={currentPageExpired === totalExpiredPages}
                      onClick={handleNextPageExpired}
                      style={{ color: "white" }}
                    >
                      Trang sau
                    </Button>
                  </div>
                </TableContainer>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default CourseManagement;
