import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./AuthContext";

const ProtectedRoute = ({ children, ...rest }) => {
  let { user } = useContext(AuthContext);

  return !localStorage.getItem("userId") ? <Navigate to="/login" /> : children;
};

export default ProtectedRoute;
