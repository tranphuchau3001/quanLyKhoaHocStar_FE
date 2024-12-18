import React, { useState, useEffect, useRef } from "react";

import moment from "moment";
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
} from "@mui/material";

import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import "./coursesManager.scss";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import apiClient from "api/apiClient";

// Data
import authorsTableData from "layouts/admin/CoursesManager/data/authorsTableData";
import CourseTables from "layouts/admin/CoursesManager/data/projectsTableData";
import MDButton from "components/MDButton";

const defaultImage = "https://via.placeholder.com/256x160";

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

  const [tabIndex, setTabIndex] = useState(0);
  const { columns, rows } = authorsTableData();
  const [selectedCourse, setSelectedCourse] = useState(null);

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

  const validateForm = () => {
    if (!courseName) {
      toast.warn("Vui lòng nhập tên khóa học!");
      document.getElementById("courseNameInput").focus();
      return false;
    }
    if (!description) {
      toast.warn("Vui lòng nhập mô tả khóa học!");
      document.getElementById("descriptionInput").focus();
      return false;
    }
    if (price > 0 && !schedule) {
      toast.warn("Vui lòng nhập lịch học!");
      document.getElementById("scheduleInput").focus();
      return false;
    }
    if (price > 0 && !meetingTime) {
      toast.warn("Vui lòng nhập ca học!");
      document.getElementById("shiftInput").focus();
      return false;
    }
    if (price > 0 && !selectedInstructor) {
      toast.warn("Vui lòng chọn giảng viên đảm nhiệm!");
      document.getElementById("instructor-select").focus();
      return false;
    }
    if (!startDate) {
      toast.warn("Vui lòng chọn ngày bắt đầu!");
      document.getElementById("startDateInput").focus();
      return false;
    }
    if (!endDate) {
      toast.warn("Vui lòng chọn ngày kết thúc!");
      document.getElementById("endDateInput").focus();
      return false;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.warn("Ngày bắt đầu không thể sau ngày kết thúc!");
      document.getElementById("startDateInput").focus();
      return false;
    }
    if (!active && !inactive) {
      toast.warn("Vui lòng chọn trạng thái!");
      return false;
    }
    if (!file) {
      toast.warn("Vui lòng chọn một ảnh khóa học trước khi lưu.");
      return false;
    }
    return true;
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;

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
    // console.log("Dữ liệu gửi lên API:", courseData);

    try {
      const response = await apiClient.post("/course-api/saveCourse", courseData);

      if (response.data.success) {
        Swal.fire("Thành công!", "Khóa học đã được thêm.", "success");
        if (file) {
          const uploadedFileName = await handleUpload(file);
          updateCourseImage(response.data.courseId, uploadedFileName);
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
      instructor: instructorData,
    };

    // console.log("Dữ liệu gửi lên API:", courseData);

    try {
      const response = await apiClient.put("/course-api/updateCourse", courseData);

      if (response.data.success) {
        Swal.fire("Thành công!", "Khóa học đã được cập nhật.", "success");

        if (file) {
          const uploadedFileName = await handleUpload(file);
          updateCourseImage(response.data.courseId, uploadedFileName);
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
      const response = await apiClient.post("/api/v1/upload/upload-background", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.fileName) {
        updateCourseImage(response.data.fileName);
        // console.log("File uploaded successfully:", response.data);
        return response.data;
      } else {
        throw new Error("Invalid response from the server.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };
  const resetForm = () => {
    setCourseCode("");
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
      const response = await apiClient.get("/user-api/getAllUser");
      const result = response.data;

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
      const response = await apiClient.get("/course-api/getAllCourse");

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
        // console.log(paid);
        // console.log(free);
        // console.log(expiredCourses);
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
  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

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
        await apiClient.delete(`/course-api/deleteCourse/${courseId}`);

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

  const handleRowDoubleClick = async (courseId) => {
    // console.log("courseId nhận được:", courseId);
    if (!courseId) {
      console.error("Course ID không hợp lệ:", courseId);
      Swal.fire("Lỗi!", "ID khóa học không hợp lệ.", "error");
      return;
    }
    try {
      const response = await apiClient.get("/course-api/getCourseById", {
        params: { courseId },
      });

      const courseData = response.data.data;

      // console.log(courseData);

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
      if (courseData.imgUrl) {
        // Tạo đường dẫn ảnh từ API trả về
        const imagePath = `/background-course/${courseData.imgUrl}`;
        setFileUrl(imagePath);
      } else {
        setFileUrl(defaultImage);
      }
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

  const handleChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  const expiredTable = CourseTables({ handleRowDoubleClick, handleDelete }).expiredTable;
  const paidTable = CourseTables({ handleRowDoubleClick, handleDelete }).paidTable;
  const freeTable = CourseTables({ handleRowDoubleClick, handleDelete }).freeTable;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer />
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Paper
            style={{
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
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
                        height: "160px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                  </label>
                  <MDButton
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
                  </MDButton>
                </div>
              </Grid>
              <Grid item xs={5}>
                <MDTypography variant="body1">
                  Mã khóa học: {courseCode || "Không có thông tin"}
                </MDTypography>
                {price > 0 && (
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="instructor-label" shrink>
                      Chọn người hướng dẫn:
                    </InputLabel>
                    <Select
                      labelId="instructor-label"
                      id="instructor-select"
                      value={selectedInstructor || ""}
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
                        <MenuItem disabled>Chưa có giảng viên nào</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                )}
              </Grid>

              <Grid item xs={12}>
                <MDInput
                  fullWidth
                  margin="normal"
                  id="courseNameInput"
                  label="Tên khóa học:"
                  variant="outlined"
                  defaultValue={courseName}
                  onBlur={(e) => setCourseName(e.target.value.trim())}
                />
              </Grid>

              <Grid item xs={12}>
                <MDInput
                  fullWidth
                  margin="normal"
                  id="descriptionInput"
                  label="Mô tả:"
                  variant="outlined"
                  multiline
                  rows={4}
                  defaultValue={description}
                  onBlur={(e) => setDescription(e.target.value.trim())}
                />
              </Grid>

              <Grid item xs={6}>
                <MDInput
                  id="startDateInput"
                  fullWidth
                  margin="normal"
                  label="Ngày bắt đầu:"
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  defaultValue={startDate}
                  onBlur={(e) => setStartDate(e.target.value)}
                />
              </Grid>

              <Grid item xs={6}>
                <MDInput
                  id="endDateInput"
                  fullWidth
                  margin="normal"
                  label="Ngày kết thúc:"
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  defaultValue={endDate}
                  onBlur={(e) => setEndDate(e.target.value)}
                />
              </Grid>

              {price > 0 && (
                <Grid container item xs={12} spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <MDInput
                      fullWidth
                      margin="normal"
                      id="scheduleInput"
                      label="Lịch học:"
                      variant="outlined"
                      defaultValue={schedule}
                      onBlur={(e) => setSchedule(e.target.value.trim())}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <MDInput
                      fullWidth
                      margin="normal"
                      id="shiftInput"
                      label="Ca học:"
                      variant="outlined"
                      defaultValue={meetingTime}
                      onBlur={(e) => setMeetingTime(e.target.value.trim())}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <MDInput
                      fullWidth
                      margin="normal"
                      id="priceInput"
                      label="Giá khóa học:"
                      variant="outlined"
                      type="text"
                      defaultValue={price}
                      onBlur={(e) => {
                        const value = e.target.value.trim();
                        if (/^\d+(\.\d+)?$/.test(value)) {
                          setPrice(Number(value));
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              <Grid container spacing={2} item xs={12} alignItems="center">
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox checked={active} onChange={handleActiveChange} value="true" />
                    }
                    label="Hoạt động"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox checked={inactive} onChange={handleInactiveChange} value="false" />
                    }
                    label="Không hoạt động"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} item xs={12}>
                <Grid item xs={2} display="flex" justifyContent="flex-start">
                  <MDButton variant="contained" color="info" onClick={handleSubmit} fullWidth>
                    Thêm khóa học
                  </MDButton>
                </Grid>
                <Grid item xs={2} display="flex" justifyContent="center">
                  <MDButton
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateCourse}
                    fullWidth
                  >
                    Sửa thông tin
                  </MDButton>
                </Grid>
                <Grid item xs={2} display="flex" justifyContent="flex-end">
                  <MDButton variant="contained" color="secondary" onClick={resetForm} fullWidth>
                    Làm mới
                  </MDButton>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={12}>
          <MDBox>
            <Tabs
              value={tabIndex}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Khóa học hết hạn" />
              <Tab label="Khóa học có phí" />
              <Tab label="Khóa học miễn phí" />
            </Tabs>
            <TabPanel value={tabIndex} index={0}>
              <DataTable table={expiredTable} />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <DataTable table={paidTable} />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              <DataTable table={freeTable} />
            </TabPanel>
          </MDBox>
        </Grid>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
};

export default CourseManagement;
