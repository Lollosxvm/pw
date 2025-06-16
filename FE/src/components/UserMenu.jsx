import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Divider,
  Grow,
} from "@mui/material";
import {
  Logout,
  Settings,
  PersonOutline,
  HomeOutlined,
} from "@mui/icons-material";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import avatarImg from "../assets/images/avatar.png";

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { logout, utente } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Avatar alt="User" src={avatarImg} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        TransitionComponent={Grow} // <-- animazione qui
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
        {utente && [
          <Typography key="nome" px={2} fontWeight={600}>
            {utente.nome}
          </Typography>,
          <Typography key="email" px={2} variant="body2" color="text.secondary">
            {utente.email}
          </Typography>,
          <Divider key="divider" sx={{ my: 1 }} />,
        ]}

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
