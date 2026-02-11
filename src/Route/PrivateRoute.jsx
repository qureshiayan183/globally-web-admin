import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const user = JSON.parse(window.localStorage.getItem("user"));

  if (!user || !user.token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
