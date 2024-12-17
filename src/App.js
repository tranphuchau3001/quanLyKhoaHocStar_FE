import { useState, useEffect, useMemo, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/logos/image.png";
import brandDark from "assets/images/logos/image.png";

import routesConfig from "./routes";
import Swal from "sweetalert2";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  const userRole = localStorage.getItem("roleId");
  let routes;

  const navigate = useNavigate();
  const logoutTimerRef = useRef(null);

  if (userRole === "1") {
    routes = [...routesConfig.userRoutesLoggedIn, ...routesConfig.adminRoutes];
  } else if (userRole === null) {
    routes = routesConfig.userRoutes;
  } else {
    routes = routesConfig.userRoutesLoggedIn;
  }

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
    });

    setRtlCache(cacheRtl);
  }, []);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const timeoutDuration = 1000 * 60 * 60 * 24;

    const startLogoutTimer = () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

      logoutTimerRef.current = setTimeout(() => {
        localStorage.clear();
        Swal.fire({
          title: "Đăng nhập hết hạn!",
          text: "Bạn có muốn đăng nhập lại không?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/authentication/sign-in");
          }
        });
      }, timeoutDuration);
    };

    startLogoutTimer();

    const resetLogoutTimer = () => {
      startLogoutTimer();
    };

    window.addEventListener("mousemove", resetLogoutTimer);
    window.addEventListener("keydown", resetLogoutTimer);

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      window.removeEventListener("mousemove", resetLogoutTimer);
      window.removeEventListener("keydown", resetLogoutTimer);
    };
  }, [navigate]);

  const getRoutes = (Routes) =>
    Routes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });

  // const configsButton = (
  //   <MDBox
  //     display="flex"
  //     justifyContent="center"
  //     alignItems="center"
  //     width="3.25rem"
  //     height="3.25rem"
  //     bgColor="white"
  //     shadow="sm"
  //     borderRadius="50%"
  //     position="fixed"
  //     right="2rem"
  //     bottom="2rem"
  //     zIndex={99}
  //     color="dark"
  //     sx={{ cursor: "pointer" }}
  //     onClick={handleConfiguratorOpen}
  //   >
  //     <Icon fontSize="small" color="inherit">
  //       settings
  //     </Icon>
  //   </MDBox>
  // );
  const showSidenav = layout === "dashboard" || pathname === "/home";

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {showSidenav && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="Lập trình cùng Star Dev"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            {/* <Configurator />
            {configsButton} */}
          </>
        )}
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {showSidenav && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Lập trình cùng Star Dev"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          {/* <Configurator />
          {configsButton} */}
        </>
      )}
      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </ThemeProvider>
  );
}
