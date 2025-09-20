import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login/Login";
import ForgotPassword from "../pages/login/ForgotPassword";
import SetNewPassword from "../pages/login/SetNewPassword";
import PasswordUpdateLogin from "../pages/login/PasswordUpdateLogin";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import NotFound from "../components/NotFound";
import Test from "../Test";
import UserManagement from "../pages/usersManagement/UserManagement";
import CheckCode from "../pages/login/CheckCode";
import Administrators from "../pages/administrators/Administrators";
import PrivateRoute from "./PrivateRoute";
import RestaurantOrder from "../pages/restaurantOrder/RestaurantOrder";
import FoodDetails from "../pages/foodDetails/FoodDetails";
import SpaPackages from "../pages/spaPackages/SpaPackages";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forget-password",
    element: <ForgotPassword />,
  },
  {
    path: "/check-code",
    element: <CheckCode />,
  },
  {
    path: "/set-new-password",
    element: <SetNewPassword />,
  },
  {
    path: "/password-update-login",
    element: <PasswordUpdateLogin />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/user-management",
        element: <UserManagement />,
      },
      {
        path: "/food-details",
        element: <FoodDetails />,
      },
      {
        path: "/administrators",
        element: <Administrators />,
      },
      {
        path: "/spa-packages",
        element: <SpaPackages />,
      },
      {
        path: "/restaurant-order",
        element: <RestaurantOrder />,
      },
      {
        path: "/test",
        element: <Test />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
