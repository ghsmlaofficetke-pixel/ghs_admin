import { Navigate, Outlet } from "react-router-dom";
import { APICore } from "../helpers/api/apiCore";

const PrivateRoute = () => {
  const api = new APICore();
  const user = api.getLoggedInUser();
  return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
