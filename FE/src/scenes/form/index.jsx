import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import axiosPrivate from "../../api/axiosPrivate";
import { useEffect, useState } from "react";

const phoneRegExp = /^\+39\s?\d{9,10}$/;

const checkoutSchema = yup.object().shape({
  nome: yup.string().required("Il nome è obbligatorio"),
  cognome: yup.string().required("Il cognome è obbligatorio"),
  email: yup.string().email("Email non valida").required("Email richiesta"),
  telefono: yup
    .string()
    .matches(phoneRegExp, "Numero di telefono non valido. Usa il formato +39")
    .required("Il telefono è obbligatorio"),
  indirizzo1: yup.string().required("Indirizzo 1 richiesto"),
  indirizzo2: yup.string(),
  citta: yup.string().required("Città richiesta"),
});

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const [initialValues, setInitialValues] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchDatiUtente = async () => {
    try {
      const res = await axiosPrivate.get("/utente/me");
      setInitialValues({
        nome: res.data.nome || "",
        cognome: res.data.cognome || "",
        email: res.data.email || "",
        telefono: res.data.telefono || "",
        indirizzo1: res.data.indirizzo1 || "",
        indirizzo2: res.data.indirizzo2 || "",
        citta: res.data.citta || "",
      });
    } catch (error) {
      console.error("Errore caricamento profilo:", error);
    }
  };

  useEffect(() => {
    fetchDatiUtente();
  }, []);

  const handleFormSubmit = async (values, actions) => {
    try {
      await axiosPrivate.put("/utente/update", values);
      setSnackbarOpen(true);
      fetchDatiUtente();
    } catch (error) {
      console.error("Errore aggiornamento profilo:", error);
    }
    actions.setSubmitting(false);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const evidenziaCampo = (field, values) => {
    return initialValues[field] !== values[field]
      ? {
          bgcolor: theme.palette.mode === "dark" ? "#37474f" : "#e0f7fa",
        }
      : {};
  };

  return (
    <Box m="20px">
      <Header
        title="MODIFICA PROFILO"
        subtitle="Aggiorna i dati del tuo profilo utente"
      />

      {initialValues && (
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            dirty,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": {
                    gridColumn: isNonMobile ? undefined : "span 4",
                  },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Nome"
                  name="nome"
                  value={values.nome}
                  InputProps={{ readOnly: true, sx: { cursor: "default" } }}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Cognome"
                  name="cognome"
                  value={values.cognome}
                  InputProps={{ readOnly: true, sx: { cursor: "default" } }}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="email"
                  label="Email"
                  name="email"
                  value={values.email}
                  InputProps={{ readOnly: true, sx: { cursor: "default" } }}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Telefono"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.telefono}
                  name="telefono"
                  error={touched.telefono && !!errors.telefono}
                  helperText={touched.telefono && errors.telefono}
                  sx={{
                    gridColumn: "span 4",
                    ...evidenziaCampo("telefono", values),
                  }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Indirizzo 1"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.indirizzo1}
                  name="indirizzo1"
                  error={touched.indirizzo1 && !!errors.indirizzo1}
                  helperText={touched.indirizzo1 && errors.indirizzo1}
                  sx={{
                    gridColumn: "span 4",
                    ...evidenziaCampo("indirizzo1", values),
                  }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Indirizzo 2"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.indirizzo2}
                  name="indirizzo2"
                  error={touched.indirizzo2 && !!errors.indirizzo2}
                  helperText={touched.indirizzo2 && errors.indirizzo2}
                  sx={{
                    gridColumn: "span 4",
                    ...evidenziaCampo("indirizzo2", values),
                  }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Città"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.citta}
                  name="citta"
                  error={touched.citta && !!errors.citta}
                  helperText={touched.citta && errors.citta}
                  sx={{
                    gridColumn: "span 4",
                    ...evidenziaCampo("citta", values),
                  }}
                />
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="end"
                mt="20px"
              >
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  disabled={!dirty}
                >
                  Salva modifiche
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Profilo aggiornato con successo
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Form;
