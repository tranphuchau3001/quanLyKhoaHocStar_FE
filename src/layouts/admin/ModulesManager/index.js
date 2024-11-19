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
import dayjs from "dayjs";

function ModulesManagement() {
  const [tab, setTab] = useState(0);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [customOrderNumber, setCustomOrderNumber] = useState("");
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
    chuong: "",
    soChuong: "",
    tenBaiHoc: "",
    noiDungBaiHoc: "",
    linkVideo: "",
    doDaiVideo: "",
    lessonOrder: "",
    trangThai: "Chưa hoàn thành",
  });
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

  const handleCourseChangeForLesson = (event) => {
    const selectedCourseId = event.target.value;

    setLessonData({
      ...lessonData,
      maKhoaHoc: selectedCourseId,
      maChuong: "",
      tenBaiHoc: "",
      noiDungBaiHoc: "",
      linkVideo: "",
      trangThai: "Chưa hoàn thành",
    });
  };
  useEffect(() => {
    const fetchModulesLession = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3030/api/v1/module/getModulesByCourseId?courseId=${lessonData.maKhoaHoc}`
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

    if (lessonData.maKhoaHoc) {
      fetchModulesLession();
    } else {
      setModules([]);
    }
  }, [lessonData.maKhoaHoc]);
  useEffect(() => {
    const fetchLessonsByModule = async () => {
      if (!lessonData.chuong || lessonData.chuong === "new") {
        setLessons([]);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3030/api/v1/lesson/getLessonsByModuleId?moduleId=${lessonData.chuong}`
        );
        const data = response.data.data;
        if (!data || data.length === 0) {
          setLessons([]);
        } else {
          setLessons(Array.isArray(data) ? data : [data]);
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    if (lessonData.chuong) {
      fetchLessonsByModule();
    } else {
      setLessons([]);
    }
  }, [lessonData.chuong]);
  const fetchLessonData = async (maBaiHoc) => {
    try {
      const response = await axios.get(
        `http://localhost:3030/api/v1/lesson/getLessonById?lessonId=${maBaiHoc}`
      );
      const { success, message, data } = response.data;
      setLessonData({
        ...lessonData,
        maBaiHoc: data.lessonId || "",
        tenBaiHoc: data.title || "",
        noiDungBaiHoc: data.content || "",
        linkVideo: data.videoUrl || "",
        lessonOrder: data.orderNumber || "",
        doDaiVideo: data.duration || "",
        chuong: data.module || "",
      });
    } catch (error) {
      console.error("Error fetching lesson data:", error);
    }
  };

  useEffect(() => {
    if (lessonData.lessonOrder) {
      fetchLessonData(lessonData.lessonOrder);
    }
  }, [lessonData.lessonOrder]);
  const handleModuleLessionChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "new") {
      setLessonData({
        ...lessonData,
        chuong: selectedValue,
        soChuong: "",
        lessonOrder: "",
      });
    } else {
      const selectedModule = modules.find((module) => module.moduleId === parseInt(selectedValue));
      if (selectedModule) {
        setLessonData({
          ...lessonData,
          chuong: selectedValue,
          tenChuong: selectedModule.title,
          soChuong: selectedModule.orderNumber,
        });
      }
    }
  };
  const handleLessionChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "new") {
      setLessonData({
        ...lessonData,
        maBaiHoc: selectedValue,
      });
    } else {
      const selectedModule = modules.find((module) => module.moduleId === parseInt(selectedValue));
      if (selectedModule) {
        setLessonData({
          ...lessonData,
          maBaiHoc: selectedValue,
        });
      }
    }
  };

  useEffect(() => {
    const fetchLessonsByModule = async () => {
      if (!lessonData.chuong || lessonData.chuong === "new") {
        setLessons([]);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3030/api/v1/lesson/getLessonsByModuleId?moduleId=${lessonData.chuong}`
        );
        const data = response.data.data;
        if (!data || data.length === 0) {
          setLessons([]);
        } else {
          setLessons(Array.isArray(data) ? data : [data]);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    if (lessonData.chuong) {
      fetchLessonsByModule();
    } else {
      setLessons([]);
    }
  }, [lessonData.chuong]);

  const handleAddLesson = async (e) => {
    if (!lessonData.tenBaiHoc) {
      toast.error("Tên bài học không được để trống.");
      return;
    }

    if (!lessonData.noiDungBaiHoc) {
      toast.error("Nội dung bài học không được để trống.");
      return;
    }

    if (!lessonData.linkVideo) {
      toast.error("Link video không được để trống.");
      return;
    }

    if (!lessonData.doDaiVideo || Number(lessonData.doDaiVideo) <= 0) {
      toast.error("Độ dài video phải lớn hơn 0.");
      return;
    }

    if (
      !lessonData.lessonOrder ||
      (lessonData.lessonOrder === "custom" && Number(customOrderNumber) <= 0) ||
      (lessonData.lessonOrder !== "custom" && Number(lessonData.lessonOrder) <= 0)
    ) {
      toast.error("Thứ tự bài học phải lớn hơn 0.");
      return;
    }
    if (!lessonData.lessonOrder) {
      toast.error("Thứ tự bài học không hợp lệ.");
      return;
    }

    const isOrderDuplicate = lessons.some(
      (lesson) => Number(lesson.orderNumber) === Number(lessonData.lessonOrder)
    );

    if (isOrderDuplicate && lessonData.lessonOrder !== "custom") {
      toast.error("Thứ tự này đã tồn tại, vui lòng chọn thứ tự khác hoặc thêm thứ tự mới.");
      return;
    }
    const newOrder = e.target.value;
    setCustomOrderNumber(newOrder);

    const isOrderDuplicate2 = lessons.some((lesson) => lesson.orderNumber === newOrder);

    if (isOrderDuplicate2) {
      toast.error("Thứ tự này đã tồn tại, vui lòng chọn thứ tự khác.");
    }
    try {
      const newLesson = {
        module: lessonData.chuong,
        title: lessonData.tenBaiHoc,
        content: lessonData.noiDungBaiHoc,
        videoUrl: lessonData.linkVideo,
        duration: lessonData.doDaiVideo,
        status: "not_completed",
        orderNumber:
          lessonData.lessonOrder === "custom" ? Number(customOrderNumber) : lessonData.lessonOrder,

        createdAt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
      };
      const response = await axios.post("http://localhost:3030/api/v1/lesson/addLesson", newLesson);
      Swal.fire("Thành công", "Thêm bài học thành công!", "success");
      setLessons([...lessons, response.data.data]);
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  const handleDeleteLesson = async () => {
    if (!lessonData.maBaiHoc) {
      toast.error("Vui lòng chọn bài học cần xóa.");
      return;
    }

    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: `Bạn có muốn xóa bài học: ${lessonData.maBaiHoc} - ${lessonData.tenBaiHoc}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3030/api/v1/lesson/deleteLesson?lessonId=${lessonData.maBaiHoc}`
      );

      if (response.status === 200 || response.data.success) {
        toast.success("Xóa bài học thành công.");

        setLessons((prevLessons) =>
          prevLessons.filter((lesson) => lesson.lessonId !== lessonData.lessonId)
        );
        setLessonData({
          maBaiHoc: "",
          chuong: "",
          tenBaiHoc: "",
          noiDungBaiHoc: "",
          linkVideo: "",
          doDaiVideo: "",
          lessonOrder: "",
        });
      } else {
        toast.error("Không thể xóa bài học. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Đã xảy ra lỗi khi xóa bài học. Vui lòng thử lại.");
    }
  };
  const updateLesson = async (lessonId, lessonData) => {
    // console.log("Lesson data trước khi cập nhật: ", lessonData);
    // if (!lessonData.tenBaiHoc) {
    //   toast.error("Tên bài học không được để trống.");
    //   return;
    // }

    // if (!lessonData.noiDungBaiHoc) {
    //   toast.error("Nội dung bài học không được để trống.");
    //   return;
    // }

    // if (!lessonData.linkVideo) {
    //   toast.error("Link video không được để trống.");
    //   return;
    // }

    // if (!lessonData.doDaiVideo || Number(lessonData.doDaiVideo) <= 0) {
    //   toast.error("Độ dài video phải lớn hơn 0.");
    //   return;
    // }
    const isOrderDuplicate = lessons.some(
      (lesson) => lesson.orderNumber === lessonData.lessonOrder && lesson.lessonId !== lessonId // Tránh trùng với bài học hiện tại
    );

    if (isOrderDuplicate) {
      toast.error("Thứ tự này đã tồn tại, vui lòng chọn thứ tự khác.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3030/api/v1/lesson/updateLesson`,
        lessonData,
        { params: { lessonId } }
      );

      if (response.data.success) {
        toast.success("Cập nhật bài học thành công!");
        setLessons(
          lessons.map((lesson) =>
            lesson.lessonId === lessonId ? { ...lesson, ...lessonData } : lesson
          )
        );
        return response.data.data;
      } else {
        toast.error(`Cập nhật thất bại: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Lỗi khi cập nhật bài học: ${error.response?.data || error.message}`);
      console.error("Error updating lesson:", error);
    }
  };

  const handleUpdateLesson = async () => {
    if (!lessonData.tenBaiHoc || lessonData.tenBaiHoc.trim() === "") {
      toast.error("Tên bài học không được để trống.");
      return;
    }
    if (!lessonData.maBaiHoc) {
      toast.error("Mã bài học không được để trống!");
      return;
    }

    const updatedLesson = {
      module: lessonData.chuong,
      title: lessonData.tenBaiHoc,
      content: lessonData.noiDungBaiHoc,
      videoUrl: lessonData.linkVideo,
      duration: lessonData.doDaiVideo,
      status: lessonData.status || "not_completed",
      orderNumber: lessonData.lessonOrder === "custom" ? customOrderNumber : lessonData.lessonOrder,
      createdAt: lessonData.createdAt || new Date().toISOString(),
    };
    console.log("Updated lesson data: ", updatedLesson);
    try {
      const response = await updateLesson(lessonData.maBaiHoc, updatedLesson);

      if (response) {
        toast.success("Cập nhật bài học thành công!");
        setLessons(
          lessons.map((lesson) =>
            lesson.lessonId === lessonData.maBaiHoc ? { ...lesson, ...updatedLesson } : lesson
          )
        );
      } else {
        toast.error("Lỗi khi cập nhật bài học.");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi kết nối API khi cập nhật bài học!");
    }
  };

  const handleOrderChange = (event) => {
    const value = event.target.value;
    setLessonData({ ...lessonData, lessonOrder: value });
    if (value !== "custom") {
      setCustomOrderNumber("");
    }
  };

  const renderLessonForm = () => (
    <>
      <Grid container>
        <Grid item xs={5}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Mã bài học"
                name="maBaiHoc"
                value={lessonData.maBaiHoc}
                fullWidth
                variant="outlined"
                margin="normal"
                disabled
                InputProps={{
                  sx: {
                    fontWeight: "bold",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Khóa học"
                name="maKhoaHoc"
                value={lessonData.maKhoaHoc}
                onChange={handleCourseChangeForLesson}
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
                value={lessonData.chuong || ""}
                onChange={handleModuleLessionChange}
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
                value={lessonData.tenBaiHoc || ""}
                onChange={(e) => setLessonData({ ...lessonData, tenBaiHoc: e.target.value })}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Nội dung bài học"
                name="noiDungBaiHoc"
                value={lessonData.noiDungBaiHoc || ""}
                onChange={(e) => setLessonData({ ...lessonData, noiDungBaiHoc: e.target.value })}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Link video"
                name="linkVideo"
                value={lessonData.linkVideo || ""}
                onChange={(e) => setLessonData({ ...lessonData, linkVideo: e.target.value })}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Độ dài video"
                name="doDaiVideo"
                value={lessonData.doDaiVideo || ""}
                onChange={(e) => setLessonData({ ...lessonData, doDaiVideo: e.target.value })}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Thứ tự"
                name="thuTu"
                value={lessonData.lessonOrder || ""}
                onChange={handleOrderChange}
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
                <MenuItem value="custom">Thêm thứ tự</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          {lessonData.lessonOrder === "custom" && (
            <Grid item xs={6}>
              <TextField
                label="Thứ tự mới"
                name="thutumoi"
                type="number"
                value={customOrderNumber}
                onChange={(e) => setCustomOrderNumber(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </Grid>
          )}

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "green",
                  color: "#ffffff",
                  "&:hover": { backgroundColor: "darkgreen" },
                }}
                onClick={handleAddLesson}
              >
                Thêm
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "blue",
                  color: "#ffffff",
                  "&:hover": { backgroundColor: "darkblue" },
                }}
                onClick={handleUpdateLesson}
              >
                Sửa
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "gray",
                  color: "#ffffff",
                  "&:hover": { backgroundColor: "darkgray" },
                }}
              >
                Mới
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "red",
                  color: "#ffffff",
                  "&:hover": { backgroundColor: "darkred" },
                }}
                onClick={handleDeleteLesson}
              >
                Xóa
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={7}>
          <TableContainer component={Paper}>
            <Table style={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Chương học</TableCell>
                  <TableCell>Tên bài học</TableCell>
                  <TableCell>Nội dung bài học</TableCell>
                  <TableCell>Thứ tự bài học</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lessons.map((lesson, index) => (
                  <TableRow
                    key={lesson.lessonId}
                    onDoubleClick={() => fetchLessonData(lesson.lessonId)}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{lesson.module}</TableCell>
                    <TableCell>{lesson.title}</TableCell>
                    <TableCell>{lesson.content}</TableCell>
                    <TableCell>{lesson.orderNumber}</TableCell>
                    <TableCell>
                      {lesson.status === "completed" ? "Đã hoàn thành" : "Chưa hoàn thành"}
                    </TableCell>
                  </TableRow>
                ))}
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
