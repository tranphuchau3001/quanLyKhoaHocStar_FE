import React from "react";
import "./CourseManagement.css";

function CourseManagement() {
  return (
    <div className="course-management-container">
      <h2>Quản lý khóa học</h2>
      <div className="course-form">
        <div className="form-left">
          <button className="remove-image-btn">Xóa Ảnh</button>
          <div className="image-placeholder">
            {" "}
            {/* Phần chứa hình ảnh */}
            <img src="#" alt="Khóa học" />
          </div>
          <div className="form-group">
            <label>Mã khóa học:</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Giảng viên đảm nhiệm:</label>
            <select>
              <option value="Star Dev">Star Dev</option>
              {/* Thêm các tùy chọn khác nếu cần */}
            </select>
          </div>
          <div className="form-group">
            <label>Tên khóa học:</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Mô tả:</label>
            <textarea rows="3"></textarea>
          </div>
          <div className="form-group">
            <label>Ngày bắt đầu:</label>
            <input type="date" />
          </div>
          <div className="form-group">
            <label>Ngày kết thúc:</label>
            <input type="date" />
          </div>
          <div className="form-group">
            <label>Lịch học:</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Ca học:</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Giá khóa học:</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Trạng thái:</label>
            <div className="status-options">
              <input type="radio" name="status" value="active" /> Hoạt động
              <input type="radio" name="status" value="inactive" /> Ngừng hoạt
              động
            </div>
          </div>
          <div className="form-buttons">
            <button className="add-button">Thêm</button>
            <button className="edit-button">Sửa</button>
            <button className="new-button">Mới</button>
            <button className="delete-button">Xóa</button>
          </div>
        </div>
        <div className="table-right">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Lịch học</th>
                <th>Ca học</th>
                <th>Giảng viên</th>
              </tr>
            </thead>
            <tbody>{/* Thêm dữ liệu mẫu nếu cần */}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CourseManagement;
