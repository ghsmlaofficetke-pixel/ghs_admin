import { Navigate, Outlet } from "react-router-dom";
import { APICore } from "../helpers/api/apiCore";

const PrivateRoute = () => {
  const api = new APICore();
  // ✅ Check JWT expiry — expired token ಇದ್ದರೆ login ಗೆ redirect
  return api.isUserAuthenticated() ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
