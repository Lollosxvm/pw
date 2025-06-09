import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  Link,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";

const LoginPage = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  // Forziamo tema scuro solo per questa pagina
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const colors = tokens("dark"); // Forziamo anche i tokens su dark

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        height="100dvh"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor={colors.primary[500]}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={isMobile ? 3 : 5}
          borderRadius="16px"
          bgcolor={colors.primary[400]}
          width="90%"
          maxWidth="400px"
          boxShadow={4}
        >
          <Typography
            variant="h4"
            color={colors.greenAccent[500]}
            mb={2}
            fontWeight="bold"
            textAlign="center"
          >
            Banca NovaDigital
          </Typography>

          <TextField
            fullWidth
            label="Username"
            variant="filled"
            sx={{ mb: 2 }}
            InputProps={{ disableUnderline: true }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="filled"
            sx={{ mb: 2 }}
            InputProps={{ disableUnderline: true }}
          />

          <Box width="100%" textAlign="right" mb={2}>
            <Link href="#" underline="hover" color={colors.greenAccent[500]}>
              Password dimenticata?
            </Link>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{
              bgcolor: colors.greenAccent[600],
              fontWeight: "bold",
              ":hover": {
                bgcolor: colors.greenAccent[700],
              },
            }}
          >
            Accedi
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
