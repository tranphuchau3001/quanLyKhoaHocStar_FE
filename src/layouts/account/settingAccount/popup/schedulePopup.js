// import React, { useState, useEffect } from "react";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import PropTypes from "prop-types";
// import MDBox from "components/MDBox";
// import DataTable from "./Tables/DataTable";
// import { Button, Stack, TextField } from "@mui/material";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Swal from "sweetalert2";
// import MDButton from "components/MDButton";

// const LinkCell = ({ value }) => {
//   return (
//     <a href={value} target="_blank" rel="noopener noreferrer">
//       {value || "Chưa có link"}
//     </a>
//   );
// };

// const ActionCell = ({ row, handleRowAction, handleDelete }) => (
//   <div style={{ display: "flex", gap: "10px" }}>
//     <Button
//       variant="contained"
//       color="info"
//       size="small"
//       onClick={() => handleRowAction(row)} // Call row action for editing
//     >
//       Chỉnh sửa
//     </Button>
//     <Button
//       variant="contained"
//       color="error"
//       size="small"
//       onClick={() => handleDelete(row.original.id)} // Pass row.id to handleDelete
//     >
//       Xóa
//     </Button>
//   </div>
// );

// ActionCell.propTypes = {
//   row: PropTypes.shape({
//     original: PropTypes.shape({
//       id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//       // Các thuộc tính khác của row nếu cần thiết
//     }).isRequired,
//   }).isRequired,
//   handleRowAction: PropTypes.func.isRequired, // Truyền hàm handleRowAction vào
//   handleDelete: PropTypes.func.isRequired, // Truyền hàm handleDelete vào
// };

// const SchedulePopup = ({ open, onClose, courseData, selectedCourse }) => {
//   const [rows, setRows] = useState([]);
//   const [meetingDate, setMeetingDate] = useState("");
//   const [urlMeeting, setUrlMeeting] = useState("");
//   const [selectedMeetingId, setSelectedMeetingId] = useState(null);

//   const validateGoogleMeetUrl = (url) => {
//     const regex = /^https:\/\/meet\.google\.com\/[a-zA-Z0-9-_]{10,}$/;
//     return regex.test(url);
//   };

//   useEffect(() => {
//     if (courseData && selectedCourse) {
//       const formattedRows = courseData.map((course) => ({
//         id: course.meetingId,
//         name: `Khóa học ID ${selectedCourse.courseId}`,
//         date: new Date(course.meetingDate).toLocaleString("vi-VN", {
//           year: "numeric",
//           month: "numeric",
//           day: "numeric",
//           hour: "numeric",
//           minute: "numeric",
//           second: "numeric",
//         }),
//         link: course.urlMeeting || "Chưa có link",
//         action: "",
//       }));
//       setRows(formattedRows);
//     }
//   }, [courseData, selectedCourse]);

//   const handleRowAction = (row) => {
//     console.log("Chọn lịch học: ", row);

//     const dateString = row.original.date;
//     const [time, date] = dateString.split(" ");
//     const [day, month, year] = date.split("/");

//     const validDateString = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${time}`;
//     const meetingDate = new Date(validDateString);

//     if (isNaN(meetingDate.getTime())) {
//       toast.error("Ngày không hợp lệ.");
//       return;
//     }

//     setSelectedMeetingId(row.original.id);
//     setMeetingDate(meetingDate.toISOString().slice(0, 16));
//     setUrlMeeting(row.original.link);
//     toast.info(`Đã chọn lịch học ID: ${row.original.id}`);
//   };

//   const handleAddSchedule = async () => {
//     if (!selectedCourse) {
//       toast.error("Vui lòng chọn khóa học.");
//       return;
//     }

//     if (!meetingDate) {
//       toast.error("Vui lòng chọn ngày giờ.");
//       return;
//     }

//     if (!urlMeeting) {
//       toast.error("Vui lòng nhập link cuộc họp.");
//       return;
//     }
//     if (!validateGoogleMeetUrl(urlMeeting)) {
//       toast.error("Link cuộc họp không hợp lệ. Vui lòng nhập lại.");
//       return;
//     }

//     const payload = {
//       meetingId: 0,
//       courseId: selectedCourse.courseId,
//       meetingDate: meetingDate,
//       urlMeeting: urlMeeting,
//       createdAt: new Date().toISOString(),
//     };

//     try {
//       const response = await fetch("http://localhost:3030/api/v1/meet/createMeetingSchedule", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }

//       const result = await response.json();
//       const newRow = {
//         id: rows.length + 1,
//         date: new Date(meetingDate).toLocaleString("vi-VN", {
//           year: "numeric",
//           month: "numeric",
//           day: "numeric",
//           hour: "numeric",
//           minute: "numeric",
//           second: "numeric",
//         }),
//         link: urlMeeting || "Chưa có link",
//       };

//       setRows([...rows, newRow]);
//       setMeetingDate("");
//       setUrlMeeting("");

//       toast.success("Thêm lịch học thành công.");
//     } catch (error) {
//       console.error("Failed to add meeting schedule:", error);
//       alert("Có lỗi xảy ra khi thêm lịch học. Vui lòng thử lại.");
//     }
//   };

//   const handleUpdateSchedule = async () => {
//     if (!selectedMeetingId) {
//       toast.error("Vui lòng chọn một lịch học để cập nhật.");
//       return;
//     }

//     if (!selectedCourse) {
//       toast.error("Vui lòng chọn khóa học.");
//       return;
//     }

//     if (!meetingDate) {
//       toast.error("Vui lòng chọn ngày giờ.");
//       return;
//     }

//     if (!urlMeeting) {
//       toast.error("Vui lòng nhập link cuộc họp.");
//       return;
//     }

//     if (!validateGoogleMeetUrl(urlMeeting)) {
//       toast.error("Link cuộc họp không hợp lệ. Vui lòng nhập lại.");
//       return;
//     }

//     const payload = {
//       meetingId: selectedMeetingId,
//       courseId: selectedCourse.courseId,
//       meetingDate: meetingDate,
//       urlMeeting: urlMeeting,
//       createdAt: new Date().toISOString(),
//     };

//     try {
//       const response = await fetch("http://localhost:3030/api/v1/meet/updateMeetingSchedule", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }

//       const result = await response.json();

//       const updatedRows = rows.map((row) => {
//         if (row.id === selectedMeetingId) {
//           return {
//             ...row,
//             date: new Date(meetingDate).toLocaleString("vi-VN", {
//               year: "numeric",
//               month: "numeric",
//               day: "numeric",
//               hour: "numeric",
//               minute: "numeric",
//               second: "numeric",
//             }),
//             link: urlMeeting,
//           };
//         }
//         return row;
//       });

//       setRows(updatedRows);
//       setMeetingDate("");
//       setUrlMeeting("");
//       setSelectedMeetingId(null);

//       toast.success("Cập nhật lịch học thành công.");
//     } catch (error) {
//       console.error("Failed to update meeting schedule:", error);
//       toast.error("Có lỗi xảy ra khi cập nhật lịch học. Vui lòng thử lại.");
//     }
//   };

//   const handleDelete = async (meetingId) => {
//     if (meetingId <= 0) {
//       toast.error("ID lịch học không hợp lệ.");
//       return;
//     }

//     const payload = {
//       meetingId: meetingId, // Pass the meetingId in the body
//     };
//     console.log(payload);

//     try {
//       const response = await fetch("http://localhost:3030/api/v1/meet/deleteMeetingSchedule", {
//         method: "DELETE", // Use POST method here instead of DELETE
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }

//       // Update the rows after deletion
//       setRows(rows.filter((row) => row.id !== meetingId));
//       toast.success("Xóa lịch học thành công.");
//     } catch (error) {
//       console.error("Failed to delete meeting schedule:", error);
//       toast.error("Có lỗi xảy ra khi xóa lịch học.");
//     }
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: 900, // Tăng độ rộng cho modal
//           bgcolor: "background.paper",
//           boxShadow: 24,
//           p: 2,
//           borderRadius: 2,
//           display: "flex",
//           flexDirection: "column",
//           gap: 2,
//         }}
//       >
//         <ToastContainer />
//         <Grid container spacing={2}>
//           <Grid item xs={4}>
//             <img
//               src={
//                 selectedCourse && selectedCourse.imgUrl
//                   ? require(`assets/images/Background/background-course/${selectedCourse.imgUrl}`)
//                   : "default-image.jpg"
//               }
//               alt="Khóa học"
//               style={{ width: "100%", borderRadius: "8px" }}
//             />
//           </Grid>
//           <Grid item xs={8}>
//             <Card sx={{ boxShadow: "none", borderRadius: 2 }}>
//               <MDBox>
//                 <Stack spacing={2}>
//                   <Typography variant="h3" textAlign={"center"}>
//                     {selectedCourse ? selectedCourse.title : "Khóa học không xác định"}
//                   </Typography>
//                   <Typography variant="h6" textAlign={"center"}>
//                     {selectedCourse ? selectedCourse.description : "Mô tả không có sẵn"}
//                   </Typography>
//                 </Stack>
//               </MDBox>
//             </Card>
//           </Grid>
//           <Grid item xs={6} sx={{ mt: 2 }}>
//             <TextField
//               label="Ngày học"
//               type="datetime-local"
//               value={meetingDate}
//               onChange={(e) => setMeetingDate(e.target.value)}
//               InputLabelProps={{
//                 shrink: true,
//               }}
//               variant="outlined"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   border: "none",
//                 },
//               }}
//             />
//             <TextField
//               label="Link học"
//               value={urlMeeting}
//               onChange={(e) => setUrlMeeting(e.target.value)}
//               variant="outlined"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   border: "none",
//                   marginLeft: "5px",
//                   color: "#000000",
//                 },
//               }}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
//               <MDButton variant="contained" color="primary" onClick={handleAddSchedule}>
//                 Thêm
//               </MDButton>
//               <MDButton variant="outlined" color="secondary" onClick={handleUpdateSchedule}>
//                 Cập nhật
//               </MDButton>
//               {/* <MDButton
//                 variant="outlined"
//                 color="error"
//                 onClick={() => handleDelete(selectedMeetingId)}
//               >
//                 Xóa
//               </MDButton> */}
//               <MDButton variant="outlined" color="info">
//                 Mới
//               </MDButton>
//             </Box>
//           </Grid>
//         </Grid>
//         <Card sx={{ boxShadow: "none", borderRadius: 2, mt: 2 }}>
//           <MDBox>
//             <DataTable
//               table={{
//                 columns: [
//                   { Header: "Mã lịch học", accessor: "id", align: "center" },
//                   { Header: "Ngày học", accessor: "date", align: "center" },
//                   {
//                     Header: "Link học",
//                     accessor: "link",
//                     align: "left",
//                     Cell: LinkCell,
//                   },
//                   {
//                     Header: "Hành động",
//                     accessor: "action",
//                     align: "center",
//                     Cell: (props) => (
//                       <ActionCell
//                         {...props}
//                         handleRowAction={handleRowAction}
//                         handleDelete={handleDelete} // Chuyển handleDelete vào đây
//                       />
//                     ),
//                   },
//                 ],
//                 rows: rows,
//               }}
//               isSorted={false}
//               entriesPerPage={false}
//               showTotalEntries={false}
//               noEndBorder
//               sx={{ "& .MuiTable-root": { border: "none" } }}
//             />
//           </MDBox>
//         </Card>
//       </Box>
//     </Modal>
//   );
// };

// DataTable.propTypes = {
//   table: PropTypes.shape({
//     columns: PropTypes.array.isRequired,
//     rows: PropTypes.array.isRequired,
//   }).isRequired,
//   onRowDoubleClick: PropTypes.func,
// };

// SchedulePopup.propTypes = {
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   courseData: PropTypes.array.isRequired,
//   selectedCourse: PropTypes.object,
// };

// LinkCell.propTypes = {
//   value: PropTypes.string.isRequired,
// };

// export default SchedulePopup;
