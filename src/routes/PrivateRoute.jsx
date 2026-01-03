import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import Loading from "../components/Loading";

const PrivateRoute = ({ children }) => {
  const { adminProfile, isLoading, isError, error } = useAdmin();

  const location = useLocation();
  const token = localStorage.getItem("token");

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // If there's an error, no profile, or no token, redirect to login
  if (isError || error || !adminProfile || !token) {
    // console.log("Redirecting to login due to authentication failure.", adminProfile, token);
    // localStorage.removeItem("token");
    // localStorage.removeItem("adminProfile");
    // localStorage.removeItem("profileTimestamp");
    // return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected route
  return children;
};

export default PrivateRoute;