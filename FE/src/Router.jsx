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

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* ROUTA PUBBLICA: LOGIN */}
        <Route path="/" element={<LoginPage />} />

        {/* LAYOUT PROTETTO */}
        <Route path="/dashboard" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard/movimenti" element={<Movimenti />} />
          <Route path="/dashboard/form" element={<Form />} />
          <Route path="/dashboard/investimenti" element={<InvestmentsPage />} />
          <Route path="/dashboard/bar" element={<Bar />} />
          <Route path="/dashboard/line" element={<Line />} />
          <Route path="/dashboard/faq" element={<FAQ />} />
          <Route path="/dashboard/geography" element={<Geography />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
