import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // wait for auth load

  if (!user) return <Navigate to="/" replace />; // not logged in

  if (adminOnly && !user.is_admin) {
    return <Navigate to="/user" replace />; // non-admin trying to access admin
  }

  return children;
}
