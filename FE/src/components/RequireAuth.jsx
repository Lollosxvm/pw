import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const { token, loading } = useAuth();

  if (loading) return null;

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default RequireAuth;
