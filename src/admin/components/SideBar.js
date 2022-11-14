import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function MiniDrawer(props) {
  const theme = useTheme();

  const handleDrawerToggel = () => {
    props.handleDrawerToggel();
  };

  const { open } = props;
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

            display: { xs: "none", sm: "block" },
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
              sx={{ width: 46, height: 46 }}
            />

            <h3>admin</h3>
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

          <CustomList
            component={"service plan"}
            subdomain="service"
            subMenu={servicePlaneSubMenu}
            NavIcon={<EqualizerIcon />}
          />

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
          <CustomList
            component={"site setting"}
            subdomain="site-setting"
            subMenu={siteSettingSubmenu}
            NavIcon={<SettingsIcon />}
          />
          <div className="navItem">
            <a>
              <div className="list">
                <span className="listIcon">
                  <ListIcon />
                </span>
                <span className="navTxt">Booking Reports</span>
              </div>
            </a>
          </div>
          <div className="navItem">
            <a>
              <div className="list">
                <span className="listIcon">
                  <ListIcon />
                </span>
                <span className="navTxt">Enquires</span>
              </div>
            </a>
          </div>
          <CustomList
            component={"help"}
            subdomain="help"
            subMenu={helpSubmenu}
            NavIcon={<EmojiObjectsOutlinedIcon />}
          />
        </Drawer>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,

            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#222d32",
            },
          }}
          onClose={handleDrawerToggel}
          variant="temporary"
          anchor="left"
          open={open}
          className="drawerContainer"
        >
          <div className="adminDetails">
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 46, height: 46 }}
            />

            <h3>admin</h3>
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

          <CustomList
            component={"service plan"}
            subdomain="service"
            subMenu={servicePlaneSubMenu}
            NavIcon={<EqualizerIcon />}
          />

          <CustomList
            component={"vehical"}
            subdomain="vehical"
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
          <CustomList
            component={"site setting"}
            subdomain="site-setting"
            subMenu={siteSettingSubmenu}
            NavIcon={<SettingsIcon />}
          />
          <div className="navItem">
            <a>
              <div className="list">
                <span className="listIcon">
                  <ListIcon />
                </span>
                <span className="navTxt">Booking Reports</span>
              </div>
            </a>
          </div>

          <CustomList
            component={"help"}
            subdomain="help"
            subMenu={helpSubmenu}
            NavIcon={<EmojiObjectsOutlinedIcon />}
          />
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
  {
    name: "create admin",
    route: "create-admin",
  },
];

const servicePlaneSubMenu = [
  {
    name: "service plan",
    route: "service-plan",
  },
  {
    name: "service plance price",
    route: "service-plance-price",
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
  {
    name: "vehicle type",
    route: "vehicle-type",
  },
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
    name: "payment mode",
    route: "payment-mode",
  },
  {
    name: "status",
    route: "payment-status",
  },
];

const homeSectionSubmenu = [
  {
    name: "home section setting",
    route: "settings",
  },
  {
    name: "slidder",
    route: "slidder",
  },
  {
    name: "service",
    route: "service",
  },
  {
    name: "gallery",
    route: "gallery",
  },
  {
    name: "facts",
    route: "facts",
  },
  {
    name: "testimonial",
    route: "testimonial",
  },
  {
    name: "blogs",
    route: "blog",
  },
];

const siteSettingSubmenu = [
  {
    name: "setting",
    route: "settings",
  },
  {
    name: "notification",
    route: "notification",
  },
  {
    name: "my shop ",
    route: "my-shop",
  },
  {
    name: "mail settings",
    route: "mail-setting",
  },
  {
    name: "api settings",
    route: "api-settings",
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
