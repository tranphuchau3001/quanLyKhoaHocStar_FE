import Dashboard from "layouts/dashboard";
import Home from "layouts/home";
import Tables from "layouts/tables";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import CourseDetail from "layouts/courses";
import Learning from "layouts/learning2";
import Payment from "layouts/payment";
import PaymentResult from "layouts/payment-result";
import Notifications from "layouts/notifications";
import Profile from "layouts/account/profilePage";
import AccountSettings from "layouts/account/settingAccount";
import CourseManager from "layouts/admin/CoursesManager";
import ModulesManager from "layouts/admin/ModulesManager";
import AdminAccountManager from "layouts/admin/admin-account-manager";
import SettingSettingCourseManager from "layouts/account/instructorCourse/index";
// @mui icons
import Icon from "@mui/material/Icon";

const userRoutes = [
  {
    type: "collapse",
    name: "Trang chủ",
    key: "home",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/home",
    component: <Home />,
  },
  {
    name: "Khóa học",
    key: "courses",
    icon: <Icon fontSize="small">info</Icon>,
    route: "/courses/:courseId",
    component: <CourseDetail />,
  },
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/tables",
  //   component: <Tables />,
  // },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/tables",
  //   component: <Tables />,
  // },
  // {
  //   name: "Payment",
  //   key: "payment",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/payment",
  //   component: <Payment />,
  // },
  // {
  //   name: "PaymentResult",
  //   key: "payment-return",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/payment-return",
  //   component: <PaymentResult />,
  // },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  // {
  //   name: "Learning",
  //   key: "learning",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/learning/:courseId",
  //   component: <Learning />,
  // },
  // {
  //   type: "collapse",
  //   name: "Thông tin tài khoản",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: <Profile />,
  // },
  // {
  //   name: "Cài đặt tài khoản",
  //   key: "settingAccount",
  //   route: "/AccountSettings",
  //   component: <AccountSettings />,
  // },
  {
    type: "collapse",
    name: "Đăng ký",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "collapse",
    name: "Đăng nhập",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
];

const userRoutesLoggedIn = [
  {
    type: "collapse",
    name: "Trang chủ",
    key: "home",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/home",
    component: <Home />,
  },
  {
    type: "collapse",
    name: "Khóa học của tôi",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    name: "Cài đặt tài khoản",
    key: "settingAccount",
    route: "/AccountSettings",
    component: <AccountSettings />,
  },
  {
    name: "Khóa học",
    key: "courses",
    icon: <Icon fontSize="small">info</Icon>,
    route: "/courses/:courseId",
    component: <CourseDetail />,
  },
  {
    name: "Learning",
    key: "learning",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/learning/:courseId",
    component: <Learning />,
  },
  {
    name: "Payment",
    key: "payment",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/payment",
    component: <Payment />,
  },
  {
    name: "PaymentResult",
    key: "payment-return",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/payment-return",
    component: <PaymentResult />,
  },
  {
    type: "collapse",
    name: "Khóa học đang quản lý",
    icon: <Icon fontSize="small">library_books</Icon>,
    key: "courseManagercourseManager",
    route: "/settingCourse",
    component: <SettingSettingCourseManager />,
  },
];

const adminRoutes = [
  {
    type: "collapse",
    name: "Thống kê",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Quản lý khóa học",
    key: "courses-manager",
    icon: <Icon fontSize="small">library_books</Icon>,
    route: "/courses-manager",
    component: <CourseManager />,
  },
  {
    type: "collapse",
    name: "Quản lý bài học",
    key: "lesson-manager",
    icon: <Icon fontSize="small">library_books</Icon>,
    route: "/lesson-manager",
    component: <ModulesManager />,
  },
  {
    type: "collapse",
    name: "Quản lý tài khoản",
    key: "account-manager",
    icon: <Icon fontSize="small">library_books</Icon>,
    route: "/account-manager",
    component: <AdminAccountManager />,
  },
];
// const routesConfig = { userRoutes, adminRoutes };
const routesConfig = { userRoutes, userRoutesLoggedIn, adminRoutes };

export default routesConfig;
