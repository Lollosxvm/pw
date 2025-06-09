import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Fade,
  Backdrop,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { tokens } from "../../theme";

const PasswordRecovery = ({ open, onClose }) => {
  const colors = tokens("dark");
  const [email, setEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setLoading(false);
    }
  }, [open]);

  const handleSend = () => {
    setLoading(true);
    setSnackbarOpen(true);

    setTimeout(() => {
      setLoading(false);
      setSnackbarOpen(false);
      onClose();
      setEmail("");
    }, 2000);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: colors.primary[400],
              color: colors.gray[100],
              p: 4,
              borderRadius: 2,
              boxShadow: 24,
              width: 300,
            }}
          >
            <Typography variant="h6" mb={2}>
              Recupero password
            </Typography>
            <Typography variant="body2" mb={2}>
              Inserisci l’indirizzo email associato al tuo account.
            </Typography>
            <TextField
              fullWidth
              type="email"
              variant="filled"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{ disableUnderline: true }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleSend}
              disabled={!email || loading}
              sx={{
                bgcolor: colors.greenAccent[600],
                ":hover": { bgcolor: colors.greenAccent[700] },
                fontWeight: "bold",
                height: 40,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Invia"
              )}
            </Button>
          </Box>
        </Fade>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }} variant="filled">
          Email di recupero inviata!
        </Alert>
      </Snackbar>
    </>
  );
};

export default PasswordRecovery;
