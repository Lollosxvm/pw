import React, { createContext, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Navbar, SideBar } from "./scenes";
import { Outlet } from "react-router-dom";

export const ToggledContext = createContext(null);

function App() {
  const [theme, colorMode] = useMode();
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const values = { collapsed, setCollapsed, toggled, setToggled };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToggledContext.Provider value={values}>
          <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
            <SideBar />
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                width: "100vw",
                overflow: "hidden",
              }}
            >
              <Navbar />
              <Box sx={{ overflowY: "auto", flex: 1, overflowX: "hidden" }}>
                <Outlet />
              </Box>
            </Box>
          </Box>
        </ToggledContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
