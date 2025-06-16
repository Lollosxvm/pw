import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  Movimenti,
  Form,
  Bar,
  Line,
  FAQ,
  Geography,
  LoginPage,
  InvestmentsPage,
} from "./scenes";
import RequireAuth from "./components/RequireAuth";

const AppRouter = () => {
  return (
    <Routes>
      {/* ROUTE PUBBLICA */}
      <Route path="/" element={<LoginPage />} />

      {/* ROUTES PROTETTE */}
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="movimenti" element={<Movimenti />} />
          <Route path="form" element={<Form />} />
          <Route path="investimenti" element={<InvestmentsPage />} />
          <Route path="bar" element={<Bar />} />
          <Route path="line" element={<Line />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="geography" element={<Geography />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
