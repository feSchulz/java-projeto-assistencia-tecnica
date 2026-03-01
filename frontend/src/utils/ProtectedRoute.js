
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { auth, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
