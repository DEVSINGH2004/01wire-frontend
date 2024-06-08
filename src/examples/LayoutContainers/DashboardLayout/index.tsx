import { useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import MDBox from "components/MDBox";
import { useMaterialUIController, setLayout } from "context";
import { Theme } from "@mui/material/styles";

function DashboardLayout({ children }: { children: ReactNode }): JSX.Element {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  return (
    <MDBox
      sx={(theme: Theme) => ({
        p: 3,
        position: "relative",
        [theme.breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? theme.spacing(15) : theme.spacing(35),
          transition: theme.transitions.create(["margin-left", "margin-right"], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
        },
      })}
    >
      {children}
    </MDBox>
  );
}

export default DashboardLayout;
