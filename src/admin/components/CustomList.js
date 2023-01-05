import * as React from "react";
// custom components

// custom css
import "./styles/customlist.scss";

import { Collapse, List, ListItemIcon, ListItemText } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TransitionGroup } from "react-transition-group";
import { useNavigate, useLocation } from "react-router-dom";

const CustomList = (props) => {
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const {
    route,
    component,
    subMenu,
    subMenuClick,
    sidebarToggle,
    toggle,
    subdomain,

    NavIcon,
  } = props;

  React.useEffect(() => {
    if (location.pathname.includes(subdomain)) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [location.pathname]);

  const handleClick = () => {
    setOpen(!open);
    navigate(`/admin/${subdomain}/${subMenu[0].route}`);
  };

  const handleRoute = (route) => {
    navigate(`/admin/${subdomain}/${route}`);
  };

  console.log(location.pathname.split("/")[3], "location.pathname");
  return (
    <div className="customList">
      <li
        // className={`listItems ${route[2] === subdomain && "listItemsActive"}`}
        className="listItems"
        onClick={handleClick}
      >
        <div className="navTitle">
          <ListItemIcon>{NavIcon}</ListItemIcon>
          <ListItemText primary={`${component}`} />
        </div>
        <div className={`${open ? "iconOpen" : "iconClose"}`}>
          <ExpandMoreIcon />
        </div>
      </li>
      <Collapse className="collapseList" in={open} timeout="auto" unmountOnExit>
        <TransitionGroup>
          <List component="div" disablePadding>
            {subMenu.map((menu, index) => {
              // console.log(menu);

              return (
                <p
                  // className={`${(route[3] === menu.route) ? "listItemsTextActive" : (menu.route === "products" && props.location.pathname.includes("add-product")) ? "listItemsTextActive" : ""}`}
                  onClick={() => handleRoute(menu.route)}
                  style={{ textTransform: "capitalize" }}
                  key={index}
                  className={
                    location.pathname.split("/")[3] === menu.route
                      ? "activeLink"
                      : ""
                  }
                >
                  {menu.name}
                </p>
              );
            })}
          </List>
        </TransitionGroup>
      </Collapse>
    </div>
  );
};

export default CustomList;
