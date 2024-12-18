import React, { useState, useEffect, useCallback } from "react";

import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import apiClient from "api/apiClient";
import Swal from "sweetalert2";

export default function ModuleTables({ handleRowDoubleClick, courseId }) {
  const [modules, setModules] = useState([]);

  const fetchModules = async () => {
    try {
      const response = await apiClient.get("/api/v1/module/getModulesByCourseId", {
        params: { courseId },
      });

      const modulesData = response.data.data;

      if (Array.isArray(modulesData)) {
        setModules(modulesData);
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

  const createRows = (modules) =>
    modules.map((module) => ({
      moduleId: (
        <MDTypography
          component="span"
          variant="button"
          color="text"
          fontWeight="medium"
          onDoubleClick={() => handleRowDoubleClick(module.moduleId)}
        >
          {module.moduleId}
        </MDTypography>
      ),
      moduleName: (
        <MDTypography
          component="span"
          variant="button"
          color="text"
          fontWeight="medium"
          onDoubleClick={() => handleRowDoubleClick(module.moduleId)}
        >
          {module.title}
        </MDTypography>
      ),
      orderNumber: (
        <MDTypography
          component="span"
          variant="caption"
          color="text"
          fontWeight="medium"
          onDoubleClick={() => handleRowDoubleClick(module.moduleId)}
        >
          {module.orderNumber}
        </MDTypography>
      ),
      courseName: (
        <MDTypography
          component="span"
          variant="caption"
          color="text"
          fontWeight="medium"
          onDoubleClick={() => handleRowDoubleClick(module.moduleId)}
        >
          {module.course?.title || "N/A"}
        </MDTypography>
      ),
      action: (
        <MDButton
          variant="contained"
          color="secondary"
          style={{ color: "white" }}
          onClick={() => handleDelete(module.moduleId)}
        >
          Xóa
        </MDButton>
      ),
    }));

  const handleDelete = async (moduleId) => {
    if (!moduleId) {
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
        await apiClient.delete("/api/v1/module/deleteModule", {
          params: { moduleId },
        });

        setModules((prevModules) => {
          // Lọc bỏ module đã bị xóa
          return prevModules.filter((module) => module.moduleId !== moduleId);
        });

        Swal.fire("Đã xóa!", "Khóa học đã được xóa thành công.", "success");
      }
    } catch (error) {
      console.error("Lỗi khi xóa khóa học:", error);
      Swal.fire("Lỗi!", "Không thể xóa khóa học.", "error");
    }
  };

  // Cấu hình bảng
  const columns = [
    { Header: "Mã chương", accessor: "moduleId", align: "left" },
    { Header: "Tên chương", accessor: "moduleName", align: "left" },
    { Header: "Thứ tự chương", accessor: "orderNumber", align: "center" },
    { Header: "Khóa học", accessor: "courseName", align: "center" },
    { Header: "Hành động", accessor: "action", align: "center" },
  ];

  return {
    moduleTable: { columns, rows: createRows(modules) },
  };
}
