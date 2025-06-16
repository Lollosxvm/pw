import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Divider,
} from "@mui/material";
import {
  Logout,
  Settings,
  PersonOutline,
  HomeOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // o token clear
    navigate("/login");
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Avatar alt="User" src="/assets/images/avatar.png" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            mt: 1.5,
            borderRadius: 2,
            width: 220,
            boxShadow: 3,
          },
        }}
      >
        <Typography px={2} fontWeight={600}>
          Jaydon Frankie
        </Typography>
        <Typography px={2} variant="body2" color="text.secondary">
          demo@minimals.cc
        </Typography>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={() => navigate("/dashboard")}>
          <ListItemIcon>
            <HomeOutlined fontSize="small" />
          </ListItemIcon>
          Home
        </MenuItem>

        <MenuItem onClick={() => navigate("/dashboard/form")}>
          <ListItemIcon>
            <PersonOutline fontSize="small" />
          </ListItemIcon>
          Profilo
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
