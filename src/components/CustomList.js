import * as React from "react";

import "./styles/customlist.scss";

import { Collapse, List, ListItemIcon, ListItemText } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TransitionGroup } from "react-transition-group";
import { useNavigate, useLocation } from "react-router-dom";

const CustomList = (props) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { component, subMenu, subdomain, NavIcon } = props;

  React.useEffect(() => {
    if (location.pathname.includes(subdomain)) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [location.pathname]);

  const handleClick = () => {
    setOpen(!open);
    navigate(`/${subdomain}/${subMenu[0].route}`);
  };

  const handleRoute = (route) => {
    navigate(`/${subdomain}/${route}`);
  };

  return (
    <div className="customList">
      <li className="listItems" onClick={handleClick}>
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
              return (
                <p
                  onClick={() => handleRoute(menu.route)}
                  style={{ textTransform: "capitalize", cursor: "pointer" }}
                  key={index}
                  className={
                    location.pathname.split("/")[2] === menu.route
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
