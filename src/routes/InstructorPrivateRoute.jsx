import { Navigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import { useInstructor } from "../context/InstructorContext";

const InstructorPrivateRoute = ({ children }) => {
  const { instructorProfile, isLoading, isError, error } = useInstructor();

  const location = useLocation();
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  // If user is instructor, redirect to instructor dashboard
  if (userType === "admin") {
    return <Navigate to="/" replace />;
  }

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // If there's an error, no profile, or no token, redirect to login
  if (isError || error || !instructorProfile || !token) {
    localStorage.removeItem("token");
    localStorage.removeItem("instructorProfile");
    localStorage.removeItem("profileTimestamp");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected route
  return children;
};

export default InstructorPrivateRoute;
