import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminDashboard } from "../api/api";
import Loading from "../components/Loading";

const PrivateRoute = ({ children }) => {
  const { adminDashboard, isLoading, isError, error, refetch } =
    useAdminDashboard();

  const location = useLocation();
  const token = localStorage.getItem("token");

  if (isLoading) {
    return <Loading />;
  }

  if (isError || error || !adminDashboard || !token) {
    localStorage.removeItem("token");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
