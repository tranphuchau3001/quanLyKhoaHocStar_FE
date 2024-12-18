import React, { useState, useEffect, useCallback } from "react";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import apiClient from "api/apiClient";
import Swal from "sweetalert2";

export default function LessonTables({ handleLessonRowDoubleClick, moduleId }) {
  const [lessons, setLessons] = useState([]);

  // Hàm gọi API để lấy danh sách bài học
  const fetchLessons = async () => {
    try {
      const response = await apiClient.get("/api/v1/lesson/getLessonsByModuleId", {
        params: { moduleId },
      });

      const lessonsData = response.data.data;

      if (Array.isArray(lessonsData)) {
        setLessons(lessonsData);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  useEffect(() => {
    if (moduleId) {
      fetchLessons();
    }
  }, [moduleId]);

  // Chuyển đổi dữ liệu thành dạng phù hợp với bảng
  const createRows = (lessons) =>
    lessons.map((lesson) => ({
      moduleId: (
        <MDTypography
          component="span"
          variant="button"
          color="text"
          fontWeight="medium"
          onDoubleClick={() => handleLessonRowDoubleClick(lesson.lessonId)}
        >
          {lesson.module}
        </MDTypography>
      ),
      lessonId: (
        <MDTypography
          component="span"
          variant="button"
          color="text"
          fontWeight="medium"
          onDoubleClick={() => handleLessonRowDoubleClick(lesson.lessonId)}
        >
          {lesson.lessonId}
        </MDTypography>
      ),
      lessonName: (
        <MDTypography
          component="span"
          variant="button"
          color="text"
          fontWeight="medium"
          onDoubleClick={() => handleLessonRowDoubleClick(lesson.lessonId)}
        >
          {lesson.title}
        </MDTypography>
      ),
      action: (
        <MDButton
          variant="contained"
          color="secondary"
          style={{ color: "white" }}
          onClick={() => handleDelete(lesson.lessonId)}
        >
          Xóa
        </MDButton>
      ),
    }));

  // Xóa bài học
  const handleDelete = async (lessonId) => {
    if (!lessonId) {
      Swal.fire("Lỗi!", "ID bài học không hợp lệ.", "error");
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn xóa bài học này?",
        text: "Thao tác này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        await apiClient.delete("/api/v1/lesson/deleteLesson", {
          params: { lessonId },
        });

        setLessons((prevLessons) => {
          return prevLessons.filter((lesson) => lesson.lessonId !== lessonId);
        });

        Swal.fire("Đã xóa!", "Bài học đã được xóa thành công.", "success");
      }
    } catch (error) {
      console.error("Lỗi khi xóa bài học:", error);
      Swal.fire("Lỗi!", "Không thể xóa bài học.", "error");
    }
  };

  // Cấu hình cột trong bảng
  const columns = [
    { Header: "Mã chương", accessor: "moduleId", align: "left" },
    { Header: "Mã bài học", accessor: "lessonId", align: "left" },
    { Header: "Tên bài học", accessor: "lessonName", align: "left" },
    { Header: "Hành động", accessor: "action", align: "center" },
  ];

  return {
    lessonTable: { columns, rows: createRows(lessons) },
  };
}
