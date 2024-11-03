// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Home from "layouts/home";
import Tables from "layouts/tables";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import CourseDetail from "layouts/courses";
import Learning from "layouts/learning";
import Payment from "layouts/payment";
import Notifications from "layouts/notifications";
import Profile from "layouts/account/profilePage";
// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Trang chủ",
    key: "home",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/home",
    component: <Home />,
  },
  // {
  //   type: "collapse",
  //   name: "Dashboard",
  //   key: "dashboard",
  //   icon: <Icon fontSize="small">dashboard</Icon>,
  //   route: "/dashboard",
  //   component: <Dashboard />,
  // },
  {
    // type: "collapse",
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
  {
    // type: "collapse",
    name: "Payment",
    key: "payment",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/payment",
    component: <Payment />,
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
    // type: "collapse",
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
    // type: "collapse",
    name: "Thông tin tài khoản",
    key: "sign-up",
    // icon: <Icon fontSize="small">person</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    // type: "collapse",
    name: "Learning",
    key: "learning",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/learning/:courseId",
    component: <Learning />,
  },
];

export default routes;
