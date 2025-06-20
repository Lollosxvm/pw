/* eslint-disable react/prop-types */
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import {
  BarChartOutlined,
  HelpOutlineOutlined,
  MapOutlined,
  MenuOutlined,
  PersonOutlined,
  TimelineOutlined,
  HomeOutlined,
} from "@mui/icons-material";
import EuroIcon from "@mui/icons-material/Euro";
import { Tooltip, Avatar } from "@mui/material";

import logo from "../../../assets/images/logo.png";
import Item from "./Item";
import { ToggledContext } from "../../../App";
import { useSelector } from "react-redux";

const SideBar = () => {
  const { collapsed, setCollapsed, toggled, setToggled } =
    useContext(ToggledContext);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const saldo = useSelector((state) => state.auth.saldo);

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: "100%",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu
        menuItemStyles={{
          button: { ":hover": { background: "transparent" } },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: "10px 0 20px 0",
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: ".3s ease" }}
              >
                <img
                  style={{ width: "30px", height: "30px", borderRadius: "8px" }}
                  src={logo}
                  alt="Argon"
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color={colors.greenAccent[500]}
                >
                  PW Bank
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>

      {/* Box saldo attuale */}
      {collapsed ? (
        <Tooltip
          title={
            saldo !== null
              ? saldo.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "EUR",
                })
              : "€0,00"
          }
          placement="right"
          arrow
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={2}
          >
            <Avatar
              sx={{
                bgcolor: colors.greenAccent[600],
                width: 40,
                height: 40,
                cursor: "default",
              }}
            >
              <EuroIcon />
            </Avatar>
          </Box>
        </Tooltip>
      ) : (
        <Box
          px={1}
          py={1}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={0.5}
          mb={2}
          bgcolor={colors.primary[500]}
          borderRadius="18px"
          maxWidth="120px"
          mx="auto"
        >
          <Typography variant="body2" color={colors.gray[300]}>
            Saldo attuale
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            color={colors.greenAccent[500]}
          >
            {saldo !== null
              ? saldo.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "EUR",
                })
              : "€0,00"}
          </Typography>
        </Box>
      )}

      {/* Sezioni menu */}
      <Box mb={5} pl={collapsed ? undefined : "5%"}>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Homepage"
            path="/dashboard"
            colors={colors}
            icon={<HomeOutlined />}
          />
        </Menu>

        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Data" : " "}
        </Typography>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Movimenti"
            path="/dashboard/movimenti"
            colors={colors}
            icon={<AccountBalanceOutlinedIcon />}
          />
        </Menu>

        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Pagine" : " "}
        </Typography>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Modifica Profilo"
            path="/dashboard/form"
            colors={colors}
            icon={<PersonOutlined />}
          />
          <Item
            title="Investimenti"
            path="/dashboard/investimenti"
            colors={colors}
            icon={<HelpOutlineOutlined />}
          />
          <Item
            title="FAQ"
            path="/dashboard/faq"
            colors={colors}
            icon={<HelpOutlineOutlined />}
          />
        </Menu>

        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Grafici Analitici" : " "}
        </Typography>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Bar Chart"
            path="/dashboard/bar"
            colors={colors}
            icon={<BarChartOutlined />}
          />
          <Item
            title="Line Chart"
            path="/dashboard/line"
            colors={colors}
            icon={<TimelineOutlined />}
          />
          <Item
            title="Geography Chart"
            path="/dashboard/geography"
            colors={colors}
            icon={<MapOutlined />}
          />
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
