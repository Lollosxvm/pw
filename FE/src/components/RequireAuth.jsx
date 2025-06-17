import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireAuth = () => {
  const token = useSelector((state) => state.auth.accessToken);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) return null;

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default RequireAuth;
