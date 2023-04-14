import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import ListIcon from "@mui/icons-material/List";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import "./styles/sidebar.scss";
import Drawer from "@mui/material/Drawer";
import CustomList from "./CustomList";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../containers/firebase";
import { logOutAction } from "../redux/actions/authActions";
import { isEmpty } from "lodash";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function MiniDrawer(props) {
  const handleDrawerToggel = () => {
    props.handleDrawerToggel();
  };
  const { user } = useSelector((state) => state);
  const { open } = props;
  const dispatch = useDispatch();

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(logOutAction());
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log("sidebar user", user, user.userType);
  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggel}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Motorcafe
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,

            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#222d32",
            },
          }}
          onClose={handleDrawerToggel}
          variant="persistent"
          anchor="left"
          open={open}
          className="drawerContainer"
        >
          <div className="adminDetails">
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 50, height: 50 }}
            />
            <div>
              <h3>{props.userDetails.admin_name}</h3>
              <p> Role: {props.userType}</p>
            </div>
          </div>

          <div className="navItem">
            <Link to={"/"}>
              <div className="list">
                <span className="listIcon">
                  <DashboardIcon />
                </span>
                <span className="navTxt">Dash Board</span>
              </div>
            </Link>
          </div>

          <CustomList
            component={"Users"}
            subdomain="users"
            subMenu={userSubmenu}
            NavIcon={<PersonIcon />}
          />
          {user.userType === "super-admin" && (
            <CustomList
              component={"admins"}
              subdomain="admins"
              subMenu={adminsMenu}
              NavIcon={<HomeIcon />}
            />
          )}

          {(user.userType === "super-admin" ||
            (user.userDetails["service_Plan"] &&
              user.userType === "admin")) && (
            <CustomList
              component={"service plan"}
              subdomain="service"
              subMenu={servicePlaneSubMenu}
              NavIcon={<EqualizerIcon />}
            />
          )}

          <CustomList
            component={"vehicle"}
            subdomain="vehicle"
            subMenu={vehicalSubMenu}
            NavIcon={<DirectionsCarIcon />}
          />
          <CustomList
            component={"appointment"}
            subdomain="appointment"
            subMenu={appointmentSubmenu}
            NavIcon={<CalendarMonthIcon />}
          />
          <CustomList
            component={"home section"}
            subdomain="home-section"
            subMenu={homeSectionSubmenu}
            NavIcon={<HomeIcon />}
          />

          <div className="navItem">
            <Link to={"/send-notification"}>
              <div className="list">
                <span className="listIcon">
                  <DashboardIcon />
                </span>
                <span className="navTxt">Send Notification</span>
              </div>
            </Link>
          </div>

          <div className="navItem">
            <Link to={"/user-enquires"}>
              <div className="list">
                <span className="listIcon">
                  <ListIcon />
                </span>
                <span className="navTxt">Enquires</span>
              </div>
            </Link>
          </div>
          <CustomList
            component={"help"}
            subdomain="help"
            subMenu={helpSubmenu}
            NavIcon={<EmojiObjectsOutlinedIcon />}
          />
          <LoadingButton
            sx={{
              color: "white",
              border: "1px solid white",
              borderRadius: "5px",
              padding: "5px 15px",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
            className="log-out-btn"
            variant="outlined"
            onClick={handleLogOut}
          >
            Log Out
          </LoadingButton>
        </Drawer>
      </Box>
    </>
  );
}

const userSubmenu = [
  {
    name: "all user",
    route: "all-user",
  },
];

const servicePlaneSubMenu = [
  {
    name: "service plan",
    route: "service-plan",
  },
  {
    name: "services",
    route: "service-list",
  },
];

const vehicalSubMenu = [
  {
    name: "vehicle company",
    route: "vehicle-company",
  },
  {
    name: "vehicle model",
    route: "vehicle-model",
  },
  // {
  //   name: "vehicle type",
  //   route: "vehicle-type",
  // },
  // {
  //   name: "vehicle category",
  //   route: "vehicle-category",
  // },
];

const appointmentSubmenu = [
  {
    name: "appointments",
    route: "appointments",
  },
  {
    name: "payment",
    route: "payments",
  },

  {
    name: "canceled appointments",
    route: "canceled-appointments",
  },
];

const homeSectionSubmenu = [
  {
    name: "slidder",
    route: "slidder",
  },
  {
    name: "car services",
    route: "car-services",
  },
  {
    name: "teams",
    route: "teams",
  },
  {
    name: "plans",
    route: "plans",
  },
  {
    name: "details",
    route: "details",
  },
];

const helpSubmenu = [
  {
    name: "system status",
    route: "system-status",
  },
  {
    name: "remove public",
    route: "remove-public",
  },
  {
    name: "clear cache",
    route: "clear-cache",
  },
];

const adminsMenu = [
  {
    name: "admins",
    route: "admins-roles-permissions",
  },
];
