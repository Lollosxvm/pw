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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PasswordRecovery from "./PasswordRecovery";

const LoginPage = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const colors = tokens("dark");
  const [showPassword, setShowPassword] = React.useState(false);
  const [openRecovery, setOpenRecovery] = React.useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

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
          <img src={logo} alt="Logo" style={{ width: 80, marginBottom: 16 }} />

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
            autoComplete="username"
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="filled"
            sx={{ mb: 2 }}
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            autoComplete="current-password"
          />

          <Box width="100%" textAlign="right" mb={2}>
            <Link
              component="button"
              underline="hover"
              color={colors.greenAccent[500]}
              onClick={() => setOpenRecovery(true)}
            >
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

      {/* Modale per il recupero password */}
      <PasswordRecovery open={openRecovery} onClose={() => setOpenRecovery(false)} />
    </ThemeProvider>
  );
};

export default LoginPage;
