import React, { JSX } from "react";
import { Navigate } from "react-router-dom";

interface RequireAdminAuthProps {
  children: JSX.Element;
}

const RequireAdminAuth: React.FC<RequireAdminAuthProps> = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default RequireAdminAuth;
