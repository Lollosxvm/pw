import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  Movimenti,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
  LoginPage ,
} from "./scenes";

const AppRouter = () => {
  return (
    <Router>
  <Routes>
    {/* ROUTA PUBBLICA: LOGIN */}
    <Route path="/" element={<LoginPage />} />

    {/* LAYOUT PROTETTO */}
    <Route path="/dashboard" element={<App />}>
      <Route index element={<Dashboard />} />
      <Route path="contacts" element={<Contacts />} />
      <Route path="movimenti" element={<Movimenti />} />
      <Route path="form" element={<Form />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="bar" element={<Bar />} />
      <Route path="pie" element={<Pie />} />
      <Route path="stream" element={<Stream />} />
      <Route path="line" element={<Line />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="geography" element={<Geography />} />
    </Route>
  </Routes>
</Router>

  );
};

export default AppRouter;
