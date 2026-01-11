import React, { createContext, useContext } from "react";
import { useAdminProfile } from "../hooks/useAdminProfile";
import { Navigate } from "react-router-dom";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const profileData = useAdminProfile();

  // Check userType from localStorage
  const userType = localStorage.getItem("userType");

  // If user is instructor, redirect to instructor dashboard
  if (userType === "instructor") {
    return <Navigate to="/instructor" replace />;
  }

  return (
    <AdminContext.Provider value={profileData}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};
