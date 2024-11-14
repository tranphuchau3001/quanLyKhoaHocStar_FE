import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function ModulesManagement() {
  const [tab, setTab] = useState(0);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [formData, setFormData] = useState({
    maKhoaHoc: "",
    tenKhoaHoc: "",
    chuong: "",
    tenChuong: "",
    soChuong: "",
  });
  const [lessonData, setLessonData] = useState({
    maBaiHoc: "",
    maKhoaHoc: "",
    soChuong: "",
    tenBaiHoc: "",
    noiDungBaiHoc: "",
    linkVideo: "",
    doDaiVideo: "",
    lessonOrder: "",
    trangThai: "Chưa hoàn thành",
  });
  const [lessons, setLessons] = useState([]);
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3030/course-api/getAllCourse")
      .then((response) => {
        const { data } = response.data;
        setCourses(data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const handleChange = (event) => {
    const selectedCourseId = event.target.value;
    const selectedCourse = courses.find((course) => course.courseId === parseInt(selectedCourseId));

    setFormData({
      ...formData,
      maKhoaHoc: selectedCourseId,
      tenKhoaHoc: selectedCourse ? selectedCourse.title : "Chưa chọn",
      chuong: "",
      tenChuong: "",
      soChuong: "",
      newChuongOrderNumber: "",
    });
  };
  const handleLessionChange = (event) => {
    const selectedCourseId = event.target.value;
    const selectedCourse = courses.find((course) => course.courseId === parseInt(selectedCourseId));

    setLessonData({
      ...lessonData,
      maKhoaHoc: selectedCourseId,
      lessonId: "",
      moduleOrder: "",
      lessonName: "",
      lessonContent: "",
      videoLink: "",
      videoLength: "",
      lessonOrder: "",
      status: "Chưa hoàn thành",
    });
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3030/api/v1/module/getModulesByCourseId?courseId=${formData.maKhoaHoc}`
        );
        const data = response.data.data;

        if (!data || data.length === 0) {
          setModules([]);
        } else {
          setModules(Array.isArray(data) ? data : [data]);
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    if (formData.maKhoaHoc) {
      fetchModules();
    } else {
      setModules([]);
    }
  }, [formData.maKhoaHoc]);

  const handleModuleChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "new") {
      setFormData({
        ...formData,
        chuong: selectedValue,
        soChuong: "",
        newChuongOrderNumber: "",
      });
    } else {
      const selectedModule = modules.find((module) => module.moduleId === parseInt(selectedValue));
      if (selectedModule) {
        setFormData({
          ...formData,
          chuong: selectedValue,
          tenChuong: selectedModule.title,
          soChuong: selectedModule.orderNumber,
          newChuongOrderNumber: "",
        });
      }
    }
  };
  const handleSaveModule = async () => {
    const isOrderNumberExist = modules.some(
      (module) => module.orderNumber === parseInt(formData.newChuongOrderNumber)
    );

    if (isOrderNumberExist) {
      Swal.fire(
        "Lỗi",
        "Số chương này đã tồn tại trong khóa học. Vui lòng chọn số chương khác.",
        "error"
      );
      return;
    }

    try {
      const moduleData = {
        course: {
          courseId: formData.maKhoaHoc,
        },
        title: formData.tenChuong,
        orderNumber: formData.newChuongOrderNumber,
        createdAt: new Date().toISOString(),
      };

      const response = await axios.post(
        "http://localhost:3030/api/v1/module/addModule",
        moduleData
      );
      Swal.fire("Thành công", "Thêm thành công", "success");
      etModules([...modules, response.data.data]);
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };
  const handleChapterNameChange = (event) => {
    setFormData({
      ...formData,
      tenChuong: event.target.value,
    });
  };

  const handleUpdateModule = () => {
    if (!formData.maKhoaHoc) {
      toast.warn("Chưa chọn khóa học cần cập nhật.");
      return;
    }
    if (!formData.chuong) {
      toast.warn("Chưa chọn chương cần cập nhật.");
      return;
    }
    if (!formData.tenChuong) {
      toast.warn("Vui lòng điền tên chương cần cập nhật.");
      return;
    }

    axios
      .put(`http://localhost:3030/api/v1/module/updateModule?moduleId=${formData.chuong}`, {
        orderNumber: formData.soChuong,
        title: formData.tenChuong,
        course: {
          courseId: formData.maKhoaHoc,
        },
      })
      .then((response) => {
        Swal.fire("Thành công!", "Cập nhật thông tin thành công.", "success");
        const updatedModules = modules.map((module) =>
          module.moduleId === parseInt(formData.chuong)
            ? { ...module, title: formData.tenChuong, orderNumber: formData.soChuong }
            : module
        );
        setModules(updatedModules);
      })
      .catch((error) => {
        console.error("Error updating module:", error);
        Swal.fire("Lỗi", "Cập nhật thông tin thất bại.", "error");
      });
  };
  const handleDeleteModule = async (moduleId) => {
    const selectedOrderNumber = formData.soChuong;
    const moduleToDelete = modules.find(
      (module) => module.orderNumber === parseInt(selectedOrderNumber)
    );

    if (!moduleToDelete) {
      toast.warn("Chưa chọn chương cần xóa hoặc không tìm thấy chương tương ứng.");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3030/api/v1/module/deleteModule?moduleId=${moduleToDelete.moduleId}`
      );
      setModules(modules.filter((module) => module.moduleId !== moduleToDelete.moduleId));
      Swal.fire("Thành công", "Module đã được xóa thành công!", "success");
    } catch (error) {
      Swal.fire("Lỗi", "Có lỗi xảy ra khi xóa module!", "error");
    }
  };

  const handleModulesDataChange = (event) => {
    const selectedCourseId = event.target.value;
    const selectedCourse = courses.find((course) => course.courseId === parseInt(selectedCourseId));
    setLessonData({
      ...lessonData,
      maKhoaHoc: selectedCourseId,
      soChuong: "",
    });
  };
  const handleModuleChangeByModulesId = (event) => {
    const selectedModuleId = event.target.value;
    setLessonData((prevData) => ({
      ...prevData,
      soChuong: selectedModuleId,
    }));
    fetch(`http://localhost:3030/api/v1/lesson/getLessonsByModuleId?moduleId=${selectedModuleId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setLessons(data.data);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error("Error fetching lessons:", error));
  };
  const renderLessonForm = () => (
    <>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Mã bài học"
                name="maBaiHoc"
                value={formData.maBaiHoc}
                onChange={(event) => handleChange(event)}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Khóa học"
                name="maKhoaHoc"
                value={lessonData.maKhoaHoc}
                onChange={handleModulesDataChange}
                select
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  sx: {
                    height: "43px",
                  },
                }}
              >
                {courses.map((course) => (
                  <MenuItem key={course.courseId} value={course.courseId}>
                    {course.courseId}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Chương"
                name="chuong"
                value={lessonData.soChuong || ""}
                onChange={handleModuleChangeByModulesId}
                select
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  sx: {
                    height: "43px",
                  },
                }}
              >
                {modules.map((module) => (
                  <MenuItem key={module.moduleId} value={module.moduleId}>
                    {module.orderNumber}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Tên bài học"
                name="tenBaiHoc"
                value={lessonData.tenBaiHoc}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Nội dung bài học"
                name="noiDungBaiHoc"
                value={lessonData.noiDungBaiHoc}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Link video"
                name="linkVideo"
                value={lessonData.linkVideo}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Độ dài video"
                name="doDaiVideo"
                value={lessonData.doDaiVideo}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Thứ tự"
                name="thuTu"
                value={lessonData.lessonOrder}
                onChange={handleLessionChange}
                select
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  sx: {
                    height: "43px",
                  },
                }}
              >
                {lessons.map((lesson) => (
                  <MenuItem key={lesson.lessonId} value={lesson.orderNumber}>
                    {lesson.orderNumber}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Typography sx={{ mt: 2 }}>Trạng thái:</Typography>
          <RadioGroup name="trangThai" value={lessonData.trangThai} row>
            <FormControlLabel value="Đã hoàn thành" control={<Radio />} label="Đã hoàn thành" />
            <FormControlLabel value="Chưa hoàn thành" control={<Radio />} label="Chưa hoàn thành" />
          </RadioGroup>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item>
              <Button variant="contained" color="primary">
                Thêm
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary">
                Sửa
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained">Mới</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="error">
                Xóa
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={7}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Khóa học</TableCell>
                  <TableCell>Chương học</TableCell>
                  <TableCell>Tên bài học</TableCell>
                  <TableCell>Thứ tự bài học</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>Khóa 1</TableCell>
                  <TableCell>Chương 1</TableCell>
                  <TableCell>Bài học 1</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>Đã hoàn thành</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );

  const renderModuleForm = () => (
    <>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={5}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <TextField
              label="Mã khóa học"
              name="maKhoaHoc"
              value={formData.maKhoaHoc}
              onChange={(event) => handleChange(event)}
              select
              variant="outlined"
              sx={{ "& .MuiInputBase-root": { height: 40 }, minWidth: "45%" }}
            >
              {courses.map((course) => (
                <MenuItem key={course.courseId} value={course.courseId}>
                  {course.courseId}
                </MenuItem>
              ))}
            </TextField>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                border: "1px solid rgba(0, 0, 0, 0.23)",
                borderRadius: "4px",
                padding: "0 16px",
                ml: 2,
                minWidth: "45%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: "0.9rem",
                  whiteSpace: "nowrap",
                  fontWeight: "bold",
                  animation: "marquee 10s linear infinite",
                  color: "#6c0202",
                  position: "absolute",
                }}
              >
                {formData.tenKhoaHoc || "Chưa chọn"}
              </Typography>
            </Box>
          </Box>
          <style>
            {`
    @keyframes marquee {
      0% {
        transform: translateX(100%); /* Bắt đầu từ ngoài bên phải */
      }
      100% {
        transform: translateX(-100%); /* Cuộn văn bản sang bên trái */
      }
    }
  `}
          </style>
          <TextField
            fullWidth
            label="Chương"
            name="chuong"
            value={formData.chuong || ""}
            onChange={handleModuleChange}
            select
            variant="outlined"
            margin="normal"
            sx={{ mb: 2, "& .MuiInputBase-root": { height: 40 } }}
          >
            {modules.map((module) => (
              <MenuItem key={module.moduleId} value={module.moduleId}>
                {module.orderNumber}
              </MenuItem>
            ))}
            <MenuItem value="new">Thêm chương mới</MenuItem>
          </TextField>
          {formData.chuong === "new" && (
            <TextField
              fullWidth
              label="Số chương mới"
              name="newChuongOrderNumber"
              value={formData.newChuongOrderNumber}
              onChange={(event) =>
                setFormData({ ...formData, newChuongOrderNumber: event.target.value })
              }
              variant="outlined"
              margin="normal"
              sx={{ mb: 2, "& .MuiInputBase-root": { height: 40 } }}
            />
          )}
          <TextField
            fullWidth
            label="Tên chương"
            name="tenChuong"
            value={formData.tenChuong}
            onChange={handleChapterNameChange}
            variant="outlined"
            margin="normal"
            sx={{ mb: 2, "& .MuiInputBase-root": { height: 40 } }}
          />
          <Grid container spacing={2} sx={{ mt: 2 }} justifyContent="flex-end">
            <Grid item></Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                sx={{ color: "#f6f6f6" }}
                onClick={formData.chuong === "new" ? handleSaveModule : handleUpdateModule}
              >
                {formData.chuong === "new" ? "Thêm chương mới" : "Cập nhật chương"}
              </Button>
            </Grid>
            <Grid item></Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                sx={{ color: "#f6f6f6" }}
                onClick={handleDeleteModule}
              >
                Xóa
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={7}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Tên chương</TableCell>
                  <TableCell>Chương thứ</TableCell>
                  <TableCell>Khóa học</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modules.map((module, index) => (
                  <TableRow key={module.moduleId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{module.title}</TableCell>
                    <TableCell>{module.orderNumber}</TableCell>
                    <TableCell>{formData.maKhoaHoc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer />
      <Box sx={{ p: 3, paddingBottom: 10 }}>
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ mt: 2 }}>
          <Tab label="Chương" />
          <Tab label="Bài học" />
          <Tab label="Bài tập" />
        </Tabs>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {tab === 0 && renderModuleForm()}
          {tab === 1 && renderLessonForm()}
          {/* {tab === 2 && renderExerciseForm()} */}
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

export default ModulesManagement;
