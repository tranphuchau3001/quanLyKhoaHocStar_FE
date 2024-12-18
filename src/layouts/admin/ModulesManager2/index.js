import React, { useState, useEffect } from "react";
import { Grid, Tabs, Tab, MenuItem } from "@mui/material";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import apiClient from "api/apiClient";
import dayjs from "dayjs";

// Data
import ModuleTables from "layouts/admin/ModulesManager2/data/moduleTablesData";
import LessonTables from "layouts/admin/ModulesManager2/data/lessonTablesData";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

const ModulesManagement = () => {
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedLessonRowId, setSelectedLessonRowId] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [formData, setFormData] = useState({
    maKhoaHoc: "",
    tenKhoaHoc: "",
    chuong: "",
    tenChuong: "",
    soChuong: "",
  });
  const resetModuleForm = () => {
    setFormData({
      ...formData,
      maKhoaHoc: "",
      tenKhoaHoc: "",
      chuong: "",
      tenChuong: "",
      soChuong: "",
    });
  };

  // lesson
  const [lessonData, setLessonData] = useState({
    maBaiHoc: "",
    maKhoaHoc: "",
    maChuong: "",
    soChuong: "",
    tenBaiHoc: "",
    noiDungBaiHoc: "",
    linkVideo: "",
    doDaiVideo: "",
    trangThai: "Chưa hoàn thành",
  });

  const resetLesonForm = () => {
    setLessonData({
      ...lessonData,
      maBaiHoc: "",
      maKhoaHoc: "",
      maChuong: "",
      tenBaiHoc: "",
      noiDungBaiHoc: "",
      linkVideo: "",
      doDaiVideo: "",
      trangThai: "Chưa hoàn thành",
    });
  };
  useEffect(() => {
    apiClient
      .get("/course-api/getAllCourse")
      .then((response) => {
        const { data } = response.data;
        setCourses(data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

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
  // useEffect(() => {
  //   const fetchModulesLession = async () => {
  //     try {
  //       const response = await apiClient.get("/api/v1/module/getModulesByCourseId", {
  //         params: { courseId: lessonData.maKhoaHoc },
  //       });

  //       const data = response.data.data;

  //       if (!data || data.length === 0) {
  //         setModules([]);
  //       } else {
  //         setModules(Array.isArray(data) ? data : [data]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching modules:", error);
  //     }
  //   };

  //   if (lessonData.maKhoaHoc) {
  //     fetchModulesLession();
  //   } else {
  //     setModules([]);
  //   }
  // }, [lessonData.maKhoaHoc]);
  // useEffect(() => {
  //   const fetchLessonsByModule = async () => {
  //     if (!lessonData.maChuong || lessonData.maChuong === "new") {
  //       setLessons([]);
  //       return;
  //     }

  //     try {
  //       const response = await apiClient.get("/api/v1/lesson/getLessonsByModuleId", {
  //         params: { moduleId: lessonData.maChuong },
  //       });

  //       const data = response.data.data;
  //       if (!data || data.length === 0) {
  //         setLessons([]);
  //       } else {
  //         setLessons(Array.isArray(data) ? data : [data]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching modules:", error);
  //     }
  //   };

  //   if (lessonData.maChuong) {
  //     fetchLessonsByModule();
  //   } else {
  //     setLessons([]);
  //   }
  // }, [lessonData.maChuong]);
  // const fetchLessonData = async (maBaiHoc) => {
  //   try {
  //     const response = await apiClient.get("/api/v1/lesson/getLessonById", {
  //       params: { lessonId: maBaiHoc },
  //     });

  //     const { success, message, data } = response.data;
  //     setLessonData({
  //       ...lessonData,
  //       maBaiHoc: data.lessonId || "",
  //       tenBaiHoc: data.title || "",
  //       noiDungBaiHoc: data.content || "",
  //       linkVideo: data.videoUrl || "",
  //       doDaiVideo: data.duration || "",
  //       maChuong: data.module || "",
  //     });
  //   } catch (error) {
  //     console.error("Error fetching lesson data:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (lessonData.lessonOrder) {
  //     fetchLessonData(lessonData.lessonOrder);
  //   }
  // }, [lessonData.lessonOrder]);
  const handleModuleLessionChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "new") {
      setLessonData({
        ...lessonData,
        maChuong: selectedValue,
        soChuong: "",
      });
    } else {
      const selectedModule = modules.find((module) => module.moduleId === parseInt(selectedValue));
      if (selectedModule) {
        setLessonData({
          ...lessonData,
          maChuong: selectedValue,
          tenChuong: selectedModule.title,
        });
      }
    }
  };
  // useEffect(() => {
  //   const fetchLessonsByModule = async () => {
  //     if (!lessonData.maChuong || lessonData.maChuong === "new") {
  //       setLessons([]);
  //       return;
  //     }

  //     try {
  //       const response = await apiClient.get("/api/v1/lesson/getLessonsByModuleId", {
  //         params: { moduleId: lessonData.maChuong },
  //       });

  //       const data = response.data.data;
  //       if (!data || data.length === 0) {
  //         setLessons([]);
  //       } else {
  //         setLessons(Array.isArray(data) ? data : [data]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching lessons:", error);
  //     }
  //   };

  //   if (lessonData.maChuong) {
  //     fetchLessonsByModule();
  //   } else {
  //     setLessons([]);
  //   }
  // }, [lessonData.maChuong]);

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

    try {
      const newLesson = {
        module: lessonData.maChuong,
        title: lessonData.tenBaiHoc,
        content: lessonData.noiDungBaiHoc,
        videoUrl: lessonData.linkVideo,
        duration: lessonData.doDaiVideo,
        status: "not_completed",
        orderNumber: 1,

        createdAt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
      };
      const response = await apiClient.post("/api/v1/lesson/addLesson", newLesson);

      Swal.fire("Thành công", "Thêm bài học thành công!", "success");
      setLessons([...lessons, response.data.data]);
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  const updateLesson = async (lessonId, lessonData) => {
    try {
      const response = await apiClient.put("/api/v1/lesson/updateLesson", lessonData, {
        params: { lessonId },
      });

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
      module: lessonData.maChuong,
      title: lessonData.tenBaiHoc,
      content: lessonData.noiDungBaiHoc,
      videoUrl: lessonData.linkVideo,
      duration: lessonData.doDaiVideo,
      status: lessonData.status || "not_completed",
      createdAt: lessonData.createdAt || new Date().toISOString(),
    };
    // console.log("Updated lesson data: ", updatedLesson);
    try {
      const response = await updateLesson(lessonData.maBaiHoc, updatedLesson);

      // if (response) {
      //   toast.success("Cập nhật bài học thành công!");
      //   setLessons(
      //     lessons.map((lesson) =>
      //       lesson.lessonId === lessonData.maBaiHoc ? { ...lesson, ...updatedLesson } : lesson
      //     )
      //   );
      // } else {
      //   toast.error("Lỗi khi cập nhật bài học.");
      // }
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

  const handleLessonRowDoubleClick = async (lessonId) => {
    if (!lessonId) {
      console.error("Lesson ID không hợp lệ:", lessonId);
      Swal.fire("Lỗi!", "ID bài học không hợp lệ.", "error");
      return;
    }
    try {
      // Gọi API để lấy dữ liệu bài học
      const response = await apiClient.get("/api/v1/lesson/getLessonById", {
        params: { lessonId },
      });

      const lesonData = response.data.data;
      // Đổ dữ liệu lên form
      setLessonData({
        ...lessonData,
        maBaiHoc: lesonData.lessonId,
        maChuong: lesonData.module,
        tenBaiHoc: lesonData.title,
        noiDungBaiHoc: lesonData.content,
        linkVideo: lesonData.videoUrl,
        doDaiVideo: lesonData.duration,

        maKhoaHoc:
          modules.find((module) => module.moduleId === lesonData.module)?.course.courseId || "",
      });

      // Đặt trạng thái hàng được chọn
      setSelectedLessonRowId(lessonId);
    } catch (error) {
      console.error("Lỗi khi gọi API lấy thông tin chương:", error);
      Swal.fire("Lỗi!", "Không thể tải thông tin chương.", "error");
    }
  };

  // Course

  useEffect(() => {
    apiClient
      .get("/course-api/getAllCourse")
      .then((response) => {
        const { data } = response.data;
        setCourses(data);
        if (data.length > 0) {
          setFormData({
            ...formData,
            maKhoaHoc: data[0].courseId,
            tenKhoaHoc: data[0].title,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const handleCourseChange = (event) => {
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
  const fetchModules = async (courseId) => {
    try {
      const response = await apiClient.get("/api/v1/module/getModulesByCourseId", {
        params: { courseId },
      });

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

  useEffect(() => {
    if (formData.maKhoaHoc) {
      fetchModules(formData.maKhoaHoc);
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

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
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

      const response = await apiClient.post("/api/v1/module/addModule", moduleData);

      Swal.fire("Thành công", "Thêm thành công", "success");
      setModules([...modules, response.data.data]);
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

    apiClient
      .put("/api/v1/module/updateModule", {
        params: { moduleId: formData.chuong },
        data: {
          orderNumber: formData.soChuong,
          title: formData.tenChuong,
          course: {
            courseId: formData.maKhoaHoc,
          },
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

  const handleRowDoubleClick = async (moduleId) => {
    if (!moduleId) {
      console.error("Module ID không hợp lệ:", moduleId);
      Swal.fire("Lỗi!", "ID chương không hợp lệ.", "error");
      return;
    }
    try {
      // Gọi API để lấy dữ liệu chương
      const response = await apiClient.get("/api/v1/module/getModuleById", {
        params: { moduleId },
      });

      const moduleData = response.data.data;

      // Đổ dữ liệu lên form
      setFormData({
        ...formData,
        chuong: moduleData.moduleId,
        tenChuong: moduleData.title,
        soChuong: moduleData.orderNumber,
        maKhoaHoc: moduleData.course.courseId,
        tenKhoaHoc:
          courses.find((course) => course.courseId === moduleData.course.courseId)?.title || "",
      });

      // Đặt trạng thái hàng được chọn
      setSelectedRowId(moduleId);
    } catch (error) {
      console.error("Lỗi khi gọi API lấy thông tin chương:", error);
      Swal.fire("Lỗi!", "Không thể tải thông tin chương.", "error");
    }
  };

  const { moduleTable } = ModuleTables({
    handleRowDoubleClick,
    courseId: formData.maKhoaHoc,
    selectedRowId,
  });

  const { lessonTable } = LessonTables({
    handleLessonRowDoubleClick,
    moduleId: lessonData.maChuong,
  });

  // Thêm style để đổi nền của hàng được chọn
  const getRowStyle = (moduleId) => ({
    backgroundColor: moduleId === selectedRowId ? "#e0f7fa" : "transparent",
  });

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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer />
      <Grid container spacing={3} mt={0}>
        <Grid item xs={12} md={12}>
          <MDBox>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Chương" />
              <Tab label="Bài học" />
              {/* <Tab label="Bài tập" /> */}
            </Tabs>
            <TabPanel value={tabIndex} index={0}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {/* Mã khóa học */}
                    <Grid item xs={6}>
                      <MDInput
                        fullWidth
                        label="Mã khóa học"
                        name="maKhoaHoc"
                        value={formData.maKhoaHoc}
                        onChange={(event) => handleCourseChange(event)}
                        select
                        variant="outlined"
                        margin="normal"
                        sx={{
                          mb: 2,
                          "& .MuiInputBase-root": { height: 40 },
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {courses.map((course) => (
                          <MenuItem key={course.courseId} value={course.courseId}>
                            {course.courseId}
                          </MenuItem>
                        ))}
                      </MDInput>
                    </Grid>

                    {/* Tên khóa học */}
                    <Grid item xs={6}>
                      <MDBox
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 40,
                          border: "1px solid rgba(0, 0, 0, 0.23)",
                          borderRadius: "4px",
                          padding: "0 16px",
                          overflow: "hidden",
                          position: "relative",
                          mt: 2,
                        }}
                      >
                        <MDTypography
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
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>

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
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {/* Chương */}
                    <Grid item xs={6}>
                      <MDInput
                        fullWidth
                        label="Mã chương"
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
                            {module.moduleId}
                          </MenuItem>
                        ))}
                        <MenuItem value="new">Thêm chương mới</MenuItem>
                      </MDInput>
                    </Grid>

                    {/* Số chương mới, chỉ hiển thị khi chọn "new" */}
                    {formData.chuong === "new" && (
                      <Grid item xs={6}>
                        <MDInput
                          type="text"
                          fullWidth
                          label="Thứ tự chương"
                          name="newChuongOrderNumber"
                          defaultValue={formData.newChuongOrderNumber}
                          // value={formData.newChuongOrderNumber}
                          onBlur={(event) => {
                            const value = event.target.value;
                            if (/^\d*$/.test(value)) {
                              // Kiểm tra chỉ số
                              setFormData((prevData) => ({
                                ...prevData,
                                newChuongOrderNumber: value,
                              }));
                            }
                          }}
                          variant="outlined"
                          margin="normal"
                          sx={{ mb: 2, "& .MuiInputBase-root": { height: 40 } }}
                        />
                      </Grid>
                    )}

                    {/* Tên chương */}
                    <Grid item xs={6}>
                      <MDInput
                        fullWidth
                        label="Tên chương"
                        name="tenChuong"
                        defaultValue={formData.tenChuong}
                        onBlur={(event) => {
                          const value = event.target.value.trim();
                          if (value) {
                            setFormData((prevData) => ({
                              ...prevData,
                              tenChuong: value,
                            }));
                          }
                        }}
                        variant="outlined"
                        margin="normal"
                        sx={{ mb: 2, "& .MuiInputBase-root": { height: 40 } }}
                      />
                    </Grid>

                    {/* Các nút */}
                    <Grid
                      container
                      spacing={2}
                      sx={{ mt: 2, ml: 1, mb: 2 }}
                      justifyContent="flex-start"
                    >
                      <Grid item xs={4} sm={2}>
                        <MDButton
                          variant="contained"
                          color="primary"
                          sx={{ color: "#fff", width: "100%", mb: 2 }}
                          onClick={
                            formData.chuong === "new" ? handleSaveModule : handleUpdateModule
                          }
                        >
                          {formData.chuong === "new" ? "Thêm chương mới" : "Cập nhật chương"}
                        </MDButton>
                      </Grid>
                      <Grid item xs={4} sm={2}>
                        <MDButton
                          variant="contained"
                          onClick={resetModuleForm}
                          sx={{
                            backgroundColor: "gray",
                            color: "#ffffff",
                            "&:hover": { backgroundColor: "darkgray" },
                          }}
                        >
                          Làm mới
                        </MDButton>
                      </Grid>
                      {/* <Grid item xs={6} sm={3}>
                        <MDButton
                          variant="contained"
                          color="error"
                          sx={{ color: "#fff", width: "100%", mb: 2 }}
                          onClick={handleDeleteModule}
                        >
                          Xóa
                        </MDButton>
                      </Grid> */}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <DataTable
                table={{
                  ...moduleTable,
                  rows: moduleTable.rows.map((row) => ({
                    ...row,
                    style: getRowStyle(row.id),
                  })),
                }}
                isSorted
                entriesPerPage
                showTotalEntries
                noEndBorder
              />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <MDInput
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
                      </MDInput>
                    </Grid>
                    <Grid item xs={6}>
                      <MDInput
                        label="Mã chương"
                        name="maChuong"
                        value={lessonData.maChuong || ""}
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
                            {module.moduleId}
                          </MenuItem>
                        ))}
                      </MDInput>
                    </Grid>

                    <Grid item xs={6}>
                      <MDInput
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
                      <MDInput
                        label="Tên bài học"
                        name="tenBaiHoc"
                        value={lessonData.tenBaiHoc || ""}
                        onChange={(e) =>
                          setLessonData({ ...lessonData, tenBaiHoc: e.target.value })
                        }
                        fullWidth
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <MDInput
                        label="Nội dung bài học"
                        name="noiDungBaiHoc"
                        value={lessonData.noiDungBaiHoc || ""}
                        onChange={(e) =>
                          setLessonData({ ...lessonData, noiDungBaiHoc: e.target.value })
                        }
                        fullWidth
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <MDInput
                        label="Link video"
                        name="linkVideo"
                        value={lessonData.linkVideo || ""}
                        onChange={(e) =>
                          setLessonData({ ...lessonData, linkVideo: e.target.value })
                        }
                        fullWidth
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <MDInput
                        label="Độ dài video"
                        name="doDaiVideo"
                        value={lessonData.doDaiVideo || ""}
                        onChange={(e) =>
                          setLessonData({ ...lessonData, doDaiVideo: e.target.value })
                        }
                        fullWidth
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>

                    {/* <Grid item xs={6}>
                      <MDInput
                        label="Thứ tự"
                        name="lessonOrder"
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
                      </MDInput>
                    </Grid> */}
                  </Grid>
                  {/* {lessonData.lessonOrder === "custom" && (
                    <Grid item xs={6}>
                      <MDInput
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
                  )} */}

                  <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
                    <Grid item>
                      <MDButton
                        variant="contained"
                        sx={{
                          backgroundColor: "green",
                          color: "#ffffff",
                          "&:hover": { backgroundColor: "darkgreen" },
                        }}
                        onClick={handleAddLesson}
                      >
                        Thêm
                      </MDButton>
                    </Grid>
                    <Grid item>
                      <MDButton
                        variant="contained"
                        sx={{
                          backgroundColor: "blue",
                          color: "#ffffff",
                          "&:hover": { backgroundColor: "darkblue" },
                        }}
                        onClick={handleUpdateLesson}
                      >
                        Sửa
                      </MDButton>
                    </Grid>
                    <Grid item>
                      <MDButton
                        variant="contained"
                        onClick={resetLesonForm}
                        sx={{
                          backgroundColor: "gray",
                          color: "#ffffff",
                          "&:hover": { backgroundColor: "darkgray" },
                        }}
                      >
                        Làm mới
                      </MDButton>
                    </Grid>
                    {/* <Grid item>
                      <MDButton
                        variant="contained"
                        sx={{
                          backgroundColor: "red",
                          color: "#ffffff",
                          "&:hover": { backgroundColor: "darkred" },
                        }}
                        onClick={handleDeleteLesson}
                      >
                        Xóa
                      </MDButton>
                    </Grid> */}
                  </Grid>
                </Grid>
              </Grid>
              <DataTable table={lessonTable} isSorted entriesPerPage showTotalEntries noEndBorder />
            </TabPanel>
            {/* <TabPanel value={tabIndex} index={2}>
              <DataTable table={moduleTable} isSorted entriesPerPage showTotalEntries noEndBorder />
            </TabPanel> */}
          </MDBox>
        </Grid>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
};

export default ModulesManagement;
