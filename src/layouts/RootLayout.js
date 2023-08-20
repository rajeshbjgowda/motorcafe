import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import MiniDrawer from "../components/SideBar";
import { useSelector } from "react-redux";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
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

function RootLayout() {
  const [open, setOpen] = useState(true);

  const { userDetails, userType } = useSelector((state) => state.user);
  const handleDrawerToggel = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <MiniDrawer
        handleDrawerToggel={handleDrawerToggel}
        open={open}
        userDetails={userDetails}
        userType={userType}
      />
      <Main open={open} style={{ overflowX: "hidden" }}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
}

export default RootLayout;
