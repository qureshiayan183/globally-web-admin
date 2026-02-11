import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const user = JSON.parse(window.localStorage.getItem("user"));
  if (user?.token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default PublicRoute;
