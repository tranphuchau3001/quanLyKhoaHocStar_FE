import React, { useState, useEffect, useCallback } from "react";

import moment from "moment";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import apiClient from "api/apiClient";

export default function CourseTables({ handleRowDoubleClick, handleDelete }) {
  const [expiredCourses, setExpiredCourses] = useState([]);
  const [paidCourses, setPaidCourses] = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const response = await apiClient.get("/course-api/getAllCourse");

      const courses = response.data.data;

      if (Array.isArray(courses)) {
        const currentDate = moment();
        setExpiredCourses(
          courses.filter(
            (course) => moment(course.endDate).isBefore(currentDate) || course.status === false
          )
        );
        setPaidCourses(
          courses.filter(
            (course) =>
              course.price > 0 &&
              moment(course.endDate).isAfter(currentDate) &&
              course.status === true
          )
        );
        setFreeCourses(
          courses.filter(
            (course) =>
              course.price === 0 &&
              moment(course.endDate).isAfter(currentDate) &&
              course.status === true
          )
        );
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);
  const createRows = (courses) =>
    courses.map((course) => ({
      courseId: (
        <MDTypography
          component="span"
          variant="button"
          color="text"
          fontWeight="medium"
          onDoubleClick={() => handleRowDoubleClick(course.courseId)}
        >
          {course.courseId}
        </MDTypography>
      ),
      courseName: (
        <MDTypography
          component="span"
          variant="button"
          color="text"
          fontWeight="medium"
          onDoubleClick={() => handleRowDoubleClick(course.courseId)}
        >
          {course.title}
        </MDTypography>
      ),
      price: (
        <MDTypography
          component="span"
          variant="caption"
          color="text"
          fontWeight="medium"
          onDoubleClick={() => handleRowDoubleClick(course.courseId)}
        >
          {course.price === 0 ? "Miễn phí" : `${course.price.toLocaleString()} VNĐ`}
        </MDTypography>
      ),
      startDate: (
        <MDTypography
          component="span"
          variant="caption"
          color="text"
          fontWeight="medium"
          onDoubleClick={() => handleRowDoubleClick(course.courseId)}
        >
          {moment(course.startDate).format("DD-MM-YYYY")}
        </MDTypography>
      ),
      endDate: (
        <MDTypography
          component="span"
          variant="caption"
          color="text"
          fontWeight="medium"
          onDoubleClick={() => handleRowDoubleClick(course.courseId)}
        >
          {moment(course.endDate).format("DD-MM-YYYY")}
        </MDTypography>
      ),
      action: (
        <MDButton
          variant="contained"
          color="secondary"
          style={{ color: "white" }}
          onClick={() => handleDelete(course.courseId)}
        >
          Xóa
        </MDButton>
      ),
    }));

  // Cấu hình bảng
  const columns = [
    { Header: "Mã khóa học", accessor: "courseId", align: "left" },
    { Header: "Tên khóa học", accessor: "courseName", align: "left" },
    { Header: "Giá", accessor: "price", align: "center" },
    { Header: "Ngày bắt đầu", accessor: "startDate", align: "center" },
    { Header: "Ngày kết thúc", accessor: "endDate", align: "center" },
    { Header: "Hành động", accessor: "action", align: "center" },
  ];

  return {
    expiredTable: { columns, rows: createRows(expiredCourses) },
    paidTable: { columns, rows: createRows(paidCourses) },
    freeTable: { columns, rows: createRows(freeCourses) },
  };
}
