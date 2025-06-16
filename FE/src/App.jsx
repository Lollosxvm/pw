import React, { createContext, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Navbar, SideBar } from "./scenes";
import { Outlet } from "react-router-dom";
import { AssetProvider } from "../src/context/AssetContext";

export const ToggledContext = createContext(null);

function App() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const values = { toggled, setToggled };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AssetProvider>
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
        </AssetProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
