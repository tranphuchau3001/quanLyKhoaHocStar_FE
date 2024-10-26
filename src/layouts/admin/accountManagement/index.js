import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useState } from "react";
import styles from "./Account.module.css";
import InputAdmin from "./components/input/inputAdmin";
import InputRadioAdmin from "./components/input/inputRadioAdmin";

const optionsGender = [
  { value: 1, label: "Nam" },
  { value: 2, label: "Nữ" },
];
const optionsRole = [
  { value: 1, label: "Giảng viên" },
  { value: 2, label: "Admin" },
];
const optionsStatus = [
  { value: 1, label: "Hoạt động" },
  { value: 2, label: "Không hoạt động" },
];
// eslint-disable-next-line react/prop-types
const Tab = ({ activeTab, tab, onClick, nameTab }) => (
  <button className={activeTab === tab ? styles.active : ""} onClick={() => onClick(tab)}>
    {nameTab}
  </button>
);
// eslint-disable-next-line react/prop-types
const TabContent = ({ activeTab }) => {
  const [selectedOption, setSelectedOption] = useState(optionsGender[0].value);
  const [selectedRole, setSelectedRole] = useState(optionsRole[0].value);
  const [selectedStatus, setSelectedStatus] = useState(optionsStatus[0].value);
  const [data, setData] = useState([
    {
      code: "",
      name: "",
      gender: "",
      role: "",
      email: "",
      phone: "",
      password: "",
      status: "",
    },
  ]);
  const onChangeInput = () => {};
  switch (activeTab) {
    case "Tab1":
      return (
        <div className={styles.containerTab1}>
          <div className={styles.form}>
            <div style={{ display: "flex" }}>
              {/* <img src="../../../assets/images/logo-ct-dark.png" alt="" />
              <button style={{ height: "40px", margin: "20px" }}>xóa ảnh</button> */}
              <InputAdmin
                label={"Mã"}
                name={"codeUser"}
                placeholder={"Mã người dùng"}
                type={"text"}
                onChange={onChangeInput}
                value={data.name}
              />
            </div>
            <InputAdmin
              label={"Họ và tên"}
              name={"name"}
              placeholder={"Họ và tên"}
              type={"text"}
              onChange={onChangeInput}
              value={data.name}
            />

            <InputRadioAdmin
              label={"Giới tính"}
              options={optionsGender}
              name="gender"
              selectedValue={selectedOption}
              onChange={setSelectedOption}
            />
            <InputRadioAdmin
              label={"Vai trò"}
              options={optionsRole}
              name="role"
              selectedValue={selectedRole}
              onChange={setSelectedRole}
            />
            <InputAdmin
              label={"Email"}
              name={"email"}
              placeholder={"Email"}
              type={"text"}
              onChange={onChangeInput}
              value={data.email}
            />
            <InputAdmin
              label={"Số điện thoại"}
              name={"phone"}
              placeholder={"Số điện thoại"}
              type={"text"}
              onChange={onChangeInput}
              value={data.phone}
            />
            <InputAdmin
              label={"Password"}
              name={"password"}
              placeholder={"Mật khẩu"}
              type={"password"}
              onChange={onChangeInput}
              value={data.password}
            />
            <InputRadioAdmin
              label={"Trạng thái"}
              options={optionsStatus}
              name="status"
              selectedValue={selectedStatus}
              onChange={setSelectedStatus}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              <button>Thêm</button>
              <button>Sửa</button>
              <button>Mới</button>
            </div>
          </div>
          <div className={styles.table}>
            <table className={styles.headerTable}>
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Giới tính</th>
                  <th>Vai trò</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                </tr>
              </thead>
              <tbody></tbody>
              {data ? (
                <tbody>
                  {data.map((value) => (
                    <tr key={value.id}>
                      <td>{value.name}</td>
                      <td>{value.gender}</td>
                      <td>{value.role}</td>
                      <td>{value.email}</td>
                      <td>{value.phone}</td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <div>Đang tải dữ liệu</div>
              )}
            </table>
          </div>
        </div>
      );
    case "Tab2":
      return (
        <div>
          <input placeholder="tim kiem" type="search" />
          <div className={styles.table}>
            <table className={styles.headerTable}>
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Giới tính</th>
                  <th>Vai trò</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody></tbody>
              {data ? (
                <tbody>
                  {data.map((value) => (
                    <tr key={value.id}>
                      <td>{value.name}</td>
                      <td>{value.gender}</td>
                      <td>{value.role}</td>
                      <td>{value.email}</td>
                      <td>{value.phone}</td>
                      <td>{value.status}</td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <div>Đang tải dữ liệu</div>
              )}
            </table>
          </div>
        </div>
      );
    default:
      return null;
  }
};

function AccountManagement() {
  const [activeTab, setActiveTab] = useState("Tab1");
  return (
    <DashboardLayout>
      <div>
        <div className={styles.headerTab}>
          <h2>Quản lý tài khoản</h2>
        </div>
        <div>
          <Tab activeTab={activeTab} tab="Tab1" onClick={setActiveTab} nameTab="Admin" />
          <Tab activeTab={activeTab} tab="Tab2" onClick={setActiveTab} nameTab="Người dùng" />
        </div>
        <TabContent activeTab={activeTab} />
      </div>
    </DashboardLayout>
  );
}
export default AccountManagement;
