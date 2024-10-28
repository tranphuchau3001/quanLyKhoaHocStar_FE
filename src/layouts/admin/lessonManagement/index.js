import React, { useState } from "react";
import "./LessonManagement.css";

function LessonManagement() {
  const [activeTab, setActiveTab] = useState("Chương");

  const renderContent = () => {
    switch (activeTab) {
      case "Chương":
        return (
          <div className="form-content">
            <div className="form-group">
              <label>Mã chương:</label>
              <input type="text" value="1" readOnly />
            </div>
            <div className="form-group">
              <label>Mã khóa học:</label>
              <select>
                <option value="1">1</option>
              </select>
            </div>
            <div className="form-group">
              <label>Chương:</label>
              <select>
                <option value="1">1</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tên chương:</label>
              <input type="text" placeholder="Nhập tên chương" />
            </div>
            <div className="form-buttons">
              <button className="add-button">Thêm</button>
              <button className="edit-button">Sửa</button>
              <button className="new-button">Mới</button>
              <button className="delete-button">Xóa</button>
            </div>
          </div>
        );
      case "Bài học":
        return (
          <div className="form-content">
            <div className="form-group">
              <label>Mã bài học:</label>
              <input type="text" value="1" readOnly />
            </div>
            <div className="form-group">
              <label>Khóa học:</label>
              <select>
                <option value="1">1</option>
              </select>
            </div>
            <div className="form-group">
              <label>Chương:</label>
              <select>
                <option value="1">1</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tên bài học:</label>
              <input type="text" placeholder="Nhập tên bài học" />
            </div>
            <div className="form-buttons">
              <button className="add-button">Thêm</button>
              <button className="edit-button">Sửa</button>
              <button className="new-button">Mới</button>
              <button className="delete-button">Xóa</button>
            </div>
          </div>
        );
      case "Bài tập":
        return (
          <div className="form-content">
            <div className="form-group">
              <label>Mã bài tập:</label>
              <input type="text" value="1" readOnly />
            </div>
            <div className="form-group">
              <label>Khóa học:</label>
              <select>
                <option value="1">1</option>
              </select>
            </div>
            <div className="form-group">
              <label>Chương:</label>
              <select>
                <option value="1">1</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tên bài tập:</label>
              <input type="text" placeholder="Nhập tên bài tập" />
            </div>
            <div className="form-buttons">
              <button className="add-button">Thêm</button>
              <button className="edit-button">Sửa</button>
              <button className="new-button">Mới</button>
              <button className="delete-button">Xóa</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="lesson-management-container">
      <h2>Quản lý Bài học</h2>
      <div className="tabs">
        <button
          className={activeTab === "Chương" ? "active" : ""}
          onClick={() => setActiveTab("Chương")}
        >
          Chương
        </button>
        <button
          className={activeTab === "Bài học" ? "active" : ""}
          onClick={() => setActiveTab("Bài học")}
        >
          Bài học
        </button>
        <button
          className={activeTab === "Bài tập" ? "active" : ""}
          onClick={() => setActiveTab("Bài tập")}
        >
          Bài tập
        </button>
      </div>
      <div className="content">
        {renderContent()}
        <div className="table-right">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên chương</th>
                <th>Chương thứ</th>
                <th>Khóa học</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Chương 1</td>
                <td>1</td>
                <td>Khóa học 1</td>
              </tr>
              {/* Thêm các dòng dữ liệu khác nếu cần */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LessonManagement;
