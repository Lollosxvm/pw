import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [utente, setUtente] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("utente");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUtente(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = (user, jwt) => {
    setUtente(user);
    setToken(jwt);
    localStorage.setItem("utente", JSON.stringify(user));
    localStorage.setItem("token", jwt);
  };

  const logout = () => {
    setUtente(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ utente, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
