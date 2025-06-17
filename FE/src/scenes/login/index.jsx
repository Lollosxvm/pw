import React, { useState } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PasswordRecovery from "./PasswordRecovery";
import axios from "../../api/axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../../redux/slices/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const colors = tokens("dark");
  const [showPassword, setShowPassword] = useState(false);
  const [openRecovery, setOpenRecovery] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("/login", {
        email,
        password,
      });

      const { token, utente } = res.data;

      dispatch(
        setAuth({
          utente,
          token,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      setErrore("Credenziali non valide");
      setOpenSnackbar(true);
    }
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
            label="Email"
            variant="filled"
            sx={{ mb: 2 }}
            InputProps={{ disableUnderline: true }}
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="filled"
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      <PasswordRecovery
        open={openRecovery}
        onClose={() => setOpenRecovery(false)}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
          variant="filled"
        >
          {errore}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default LoginPage;
