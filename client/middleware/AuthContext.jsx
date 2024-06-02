import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null); // Add token state

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log(storedToken);
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken); // Set the token state if it exists
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setToken(null); // Clear token state on logout
  };

  const login = (newToken) => {
    setIsAuthenticated(true);
    localStorage.setItem("token", newToken);
    setToken(newToken); // Set the token state on login
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, login, token }}>
      {" "}
      {/* Provide token value in context */}
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
