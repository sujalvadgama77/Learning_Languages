import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(() =>
    localStorage.getItem("userId") ? localStorage.getItem("userId") : null
  );
  let [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("userId") ? localStorage.getItem("userId") : null
  );

  const navigate = useNavigate();

  let logoutUser = () => {
    localStorage.removeItem("userId");
    setAuthToken(null);
    setUser(null);
    navigate("/login");
  };

  let contextData = {
    user: user,
    authToken: authToken,
    logoutUser: logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
