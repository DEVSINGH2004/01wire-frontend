import { useState, useEffect, JSXElementConstructor, Key, ReactElement } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
// Material Dashboard 2 PRO React TS exampless
import Sidenav from "examples/Sidenav";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// Material Dashboard 2 PRO React TS themes
import theme from "assets/theme";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import routes from "routes";
import adminRoutes from "adminRoutes";
import { useMaterialUIController, setMiniSidenav } from "context";
// Images
import brandLogo from "assets/images/OneWireLogo_2.svg";
import SignIn from "layouts/authentication/sign-in";
import PaymentSuccess from "layouts/pages/myCredits/components/PaymentSuccess";
import PaymentFailed from "layouts/pages/myCredits/components/PaymentFailed";
import Releases from "layouts/pages/releases";
import Clients from "layouts/pages/clients";
import Profile from "layouts/pages/profile";
import Publications from "layouts/pages/publications";
import Bundles from "layouts/pages/bundles";
import PRManagement from "layouts/pages/pr-management";
import DownloadReport from "layouts/pages/download-report";
import ShareEstimation from "layouts/pages/share-estimation";

export default function App() {
  const token = localStorage.getItem("token");
  const role: any = localStorage.getItem("role");

  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, direction, layout, sidenavColor, darkMode } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };
  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };
  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes: any[]): any =>
    allRoutes.map(
      (route: {
        collapse: any;
        route: string;
        component: ReactElement<any, string | JSXElementConstructor<any>>;
        key: Key;
      }) => {
        if (route.collapse) {
          return getRoutes(route.collapse);
        }

        if (route.route) {
          return <Route path={route.route} element={route.component} key={route.key} />;
        }

        return null;
      }
    );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {pathname.includes("/share-estimation") ? (
        <Routes>
          <Route path="/share-estimation/:id" element={<ShareEstimation />} />
        </Routes>
      ) : !token ? (
        <SignIn />
      ) : (
        <>
          {layout === "dashboard" && pathname !== "/download-report" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={brandLogo}
                brandName="Dashboard"
                routes={role === "ADMIN" ? adminRoutes : routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
            </>
          )}
          <DashboardLayout>
            <Routes>
              {getRoutes(role === "ADMIN" ? adminRoutes : routes)}
              <Route path="/profile" element={<Profile />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failed" element={<PaymentFailed />} />
              <Route path="/clients/:id" element={<Clients />} />
              <Route path="/download-report" element={<DownloadReport />} />
              <Route path="/releases/:id" element={<Releases />} />
              <Route path="/publications/:id" element={<Publications />} />
              <Route path="/pr-management/:id" element={<PRManagement />} />
              <Route path="/bundles/:id" element={<Bundles />} />
              {role === "ADMIN" ? (
                <Route path="*" element={<Navigate to="/orders" />} />
              ) : (
                <Route path="*" element={<Navigate to="/dashboards" />} />
              )}
            </Routes>
          </DashboardLayout>
        </>
      )}
    </ThemeProvider>
  );
}
