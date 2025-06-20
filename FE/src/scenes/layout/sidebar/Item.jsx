/* eslint-disable react/prop-types */
import { MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, Box } from "@mui/material";
import { useContext } from "react";
import { ToggledContext } from "../../../App";

const Item = ({ title, path, icon }) => {
  const location = useLocation();
  const { collapsed } = useContext(ToggledContext);

  const itemContent = (
    <MenuItem
      component={<Link to={path} />}
      to={path}
      icon={icon}
      rootStyles={{
        color: path === location.pathname && "#6870fa",
      }}
    >
      {title}
    </MenuItem>
  );

  return collapsed ? (
    <Tooltip title={title} placement="right" arrow>
      <Box>{itemContent}</Box>
    </Tooltip>
  ) : (
    itemContent
  );
};

export default Item;
