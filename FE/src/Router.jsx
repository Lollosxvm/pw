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
      <Route path="/dashboard/contacts" element={<Contacts />} />
      <Route path="/dashboard/movimenti" element={<Movimenti />} />
      <Route path="/dashboard/form" element={<Form />} />
      <Route path="/dashboard/calendar" element={<Calendar />} />
      <Route path="/dashboard/bar" element={<Bar />} />
      <Route path="/dashboard/pie" element={<Pie />} />
      <Route path="/dashboard/stream" element={<Stream />} />
      <Route path="/dashboard/line" element={<Line />} />
      <Route path="/dashboard/faq" element={<FAQ />} />
      <Route path="/dashboard/geography" element={<Geography />} />
    </Route>
  </Routes>
</Router>

  );
};

export default AppRouter;
