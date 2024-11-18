import Dashboard from "layouts/dashboard";
import Home from "layouts/home";
import Tables from "layouts/tables";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import CourseDetail from "layouts/courses";
import Learning from "layouts/learning";
import Payment from "layouts/payment";
import PaymentResult from "layouts/payment-result";
import Notifications from "layouts/notifications";
import Profile from "layouts/account/profilePage";
import AccountSettings from "layouts/account/settingAccount";
import CourseManager from "layouts/admin/CoursesManager";
import ModulesManager from "layouts/admin/ModulesManager";
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
  {
    // type: "collapse",
    name: "Payment",
    key: "payment",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/payment",
    component: <Payment />,
  },

  {
    // type: "collapse",
    name: "PaymentResult",
    key: "payment-return",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/payment-return",
    component: <PaymentResult />,
  },
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
  {
    name: "Đăng nhập",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Thông tin tài khoản",
    key: "sign-up",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    name: "Thông tin tài khoản",
    key: "sign-up",
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    name: "Learning",
    key: "learning",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/learning/:courseId",
    component: <Learning />,
  },
  {
    // type: "collapse",
    name: "Cài đặt tài khoản",
    key: "settingAccount",
    // icon: <Icon fontSize="small">assignment</Icon>,
    route: "/AccountSettings",
    component: <AccountSettings />,
  },
];
const adminRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Quản Lý Khóa Học",
    key: "coursesManager",
    icon: <Icon fontSize="small">library_books</Icon>,
    route: "/admin/CoursesManager",
    component: <CourseManager />,
  },
  {
    type: "collapse",
    name: "Quản Lý Bài Học",
    key: "lessonManager",
    icon: <Icon fontSize="small">library_books</Icon>,
    route: "/admin/ModulesManager",
    component: <ModulesManager />,
  },
];
const routesConfig = { userRoutes, adminRoutes };

export default routesConfig;
