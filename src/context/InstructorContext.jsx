import React, { createContext, useContext } from "react";
import { Navigate } from "react-router-dom";
import { useInstructorProfile } from "../hooks/useInstructorProjile";

const InstructorContext = createContext();

export const InstructorProvider = ({ children }) => {
  const profileData = useInstructorProfile();

  // Check userType from localStorage
  const userType = localStorage.getItem("userType");

  // If user is instructor, redirect to instructor dashboard
  if (userType === "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <InstructorContext.Provider value={profileData}>
      {children}
    </InstructorContext.Provider>
  );
};

export const useInstructor = () => {
  const context = useContext(InstructorContext);
  if (!context) {
    throw new Error("useInstructor must be used within InstructorProvider");
  }
  return context;
};
