import Box from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import DashBoard from "./containers/DashBoard";
import SideBar from "./components/SideBar";
import { maxWidth } from "@mui/system";
import { useSelector } from "react-redux";
const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    width: "100%",

    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),

    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
    },
  })
);

function AdminDashBoard() {
  const [open, setOpen] = useState(true);
  const userData = useSelector((state) => state.authUserReducer.user);
  const handleDrawerToggel = () => {
    setOpen(!open);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar
        handleDrawerToggel={handleDrawerToggel}
        open={open}
        userData={userData}
      />
      <Main open={open} style={{ overflowX: "hidden" }}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
}

export default AdminDashBoard;
