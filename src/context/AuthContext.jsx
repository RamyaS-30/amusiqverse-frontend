import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const parsedStoredUser = JSON.parse(storedUser);
        const payload = JSON.parse(atob(token.split(".")[1]));

        // Use stored is_admin in case approval is delayed
        setUser({
          id: payload.id,
          email: payload.email,
          name: parsedStoredUser.name,
          is_admin: parsedStoredUser.is_admin || false,
        });
      } catch (err) {
        console.error("Failed to parse token or stored user", err);
        setUser(JSON.parse(storedUser));
      }
    }

    setLoading(false); // important for ProtectedRoute
  }, []);

  // Login function
  const login = (data) => {
    const { token, user: loggedUser } = data;

    // Parse token for ID/email
    const payload = JSON.parse(atob(token.split(".")[1]));

    const userWithAdmin = {
      id: payload.id,
      email: payload.email,
      name: loggedUser.name,
      is_admin: loggedUser.is_admin || false, // user is normal until approved
    };

    setUser(userWithAdmin);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userWithAdmin));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
