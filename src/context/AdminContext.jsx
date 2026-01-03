import React, { createContext, useContext } from "react";
import { useAdminProfile } from "../hooks/useAdminProfile";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const profileData = useAdminProfile();

  React.useEffect(() => {
    console.log("AdminProvider data:", {
      profile: profileData.adminProfile,
      isLoading: profileData.isLoading,
      isFetching: profileData.isFetching,
    });
  }, [profileData]);

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
