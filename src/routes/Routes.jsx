import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login/Login";
import ForgotPassword from "../pages/login/ForgotPassword";
import SetNewPassword from "../pages/login/SetNewPassword";
import PasswordUpdateLogin from "../pages/login/PasswordUpdateLogin";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import NotFound from "../components/NotFound";
import UserManagement from "../pages/usersManagement/UserManagement";
import CheckCode from "../pages/login/CheckCode";
import Administrators from "../pages/administrators/Administrators";
import PrivateRoute from "./PrivateRoute";
import RestaurantOrder from "../pages/restaurantOrder/RestaurantOrder";
import FoodDetails from "../pages/foodDetails/FoodDetails";
import SpaPackages from "../pages/spaPackages/SpaPackages";
import FoodOrders from "../pages/food-orders/FoodOrders";
import FoodCategory from "../pages/food-category/FoodCategory";
import UserMassages from "../pages/user-massages/UserMassages";
import Ingredients from "../pages/ingredients/Ingredients";
import SpaBooking from "../pages/spa-booking/SpaBooking";
import TermsAndConditions from "../pages/settings/terms-and-conditions/TermsAndConditions";
import PrivacyPolicy from "../pages/settings/privacy-policy/PrivacyPolicy";
import Credits from "../pages/credits/Credits";
import Drivers from "../pages/settings/drivers/Drivers";
import Instructors from "../pages/settings/instructors/Instructors";

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
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
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
        path: "/food-orders",
        element: <FoodOrders />,
      },
      {
        path: "/food-category",
        element: <FoodCategory />,
      },
      {
        path: "/ingredients",
        element: <Ingredients />,
      },
      {
        path: "/administrators",
        element: <Administrators />,
      },
      {
        path: "/user-massages",
        element: <UserMassages />,
      },
      {
        path: "/spa-classes",
        element: <SpaPackages />,
      },
      {
        path: "/spa-booking",
        element: <SpaBooking />,
      },
      {
        path: "/physio-classes",
        element: <SpaPackages />,
      },
      {
        path: "/physio-booking",
        element: <SpaBooking />,
      },
      {
        path: "/classes",
        element: <SpaPackages />,
      },
      {
        path: "/classes-booking",
        element: <SpaBooking />,
      },
      {
        path: "/restaurant-order",
        element: <RestaurantOrder />,
      },
      {
        path: "/credits",
        element: <Credits />,
      },
      {
        path: "/drivers",
        element: <Drivers />,
      },
      {
        path: "/instructors",
        element: <Instructors />,
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
