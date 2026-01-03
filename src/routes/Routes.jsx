import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login/Login";
import ForgotPassword from "../pages/login/ForgotPassword";
import SetNewPassword from "../pages/login/SetNewPassword";
import PasswordUpdateLogin from "../pages/login/PasswordUpdateLogin";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import NotFound from "../components/NotFound";
import Unauthorized from "../components/Unauthorized";
import UserManagement from "../pages/usersManagement/UserManagement";
import CheckCode from "../pages/login/CheckCode";
import Administrators from "../pages/administrators/Administrators";
import PrivateRoute from "./PrivateRoute";
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
import Banner from "../pages/settings/banner/Banner";
import CreditsBuyers from "../pages/credits-buyers/CreditsBuyers";
import DriversDetails from "../pages/settings/drivers/driversDetails/DriversDetails";
import CouponCode from "../pages/settings/coupon-code/CouponCode";
import Roles from "../pages/administrators/roles/Roles";
import PermissionProtectedRoute from "./PermissionProtectedRoute";
import DashboardOrRedirect from "./DashboardOrRedirect";

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
    path: "/unauthorized",
    element: <Unauthorized />,
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
        element: <DashboardOrRedirect />,
      },
      {
        path: "/user-management",
        element: (
          <PermissionProtectedRoute requiredModule="user-management" requiredAction="view">
            <UserManagement />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/food-details",
        element: (
          <PermissionProtectedRoute requiredModule="food-details" requiredAction="view">
            <FoodDetails />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/food-orders",
        element: (
          <PermissionProtectedRoute requiredModule="food-orders" requiredAction="view">
            <FoodOrders />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/food-category",
        element: (
          <PermissionProtectedRoute requiredModule="food-category" requiredAction="view">
            <FoodCategory />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/ingredients",
        element: (
          <PermissionProtectedRoute requiredModule="ingredients" requiredAction="view">
            <Ingredients />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/administrators",
        element: (
          <PermissionProtectedRoute requiredModule="administrators" requiredAction="view">
            <Administrators />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/administrators/roles",
        element: (
          <PermissionProtectedRoute requiredModule="administrators" requiredAction="view">
            <Roles />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/user-massages",
        element: (
          <PermissionProtectedRoute requiredModule="user-massages" requiredAction="view">
            <UserMassages />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/spa-classes",
        element: (
          <PermissionProtectedRoute requiredModule="spa-classes" requiredAction="view">
            <SpaPackages />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/spa-booking",
        element: (
          <PermissionProtectedRoute requiredModule="spa-booking" requiredAction="view">
            <SpaBooking />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/physio-classes",
        element: (
          <PermissionProtectedRoute requiredModule="physio-classes" requiredAction="view">
            <SpaPackages />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/physio-booking",
        element: (
          <PermissionProtectedRoute requiredModule="physio-booking" requiredAction="view">
            <SpaBooking />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/classes",
        element: (
          <PermissionProtectedRoute requiredModule="classes" requiredAction="view">
            <SpaPackages />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/classes-booking",
        element: (
          <PermissionProtectedRoute requiredModule="classes-booking" requiredAction="view">
            <SpaBooking />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/credits",
        element: (
          <PermissionProtectedRoute requiredModule="credits" requiredAction="view">
            <Credits />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/credits-buyers",
        element: (
          <PermissionProtectedRoute requiredModule="credits-buyers" requiredAction="view">
            <CreditsBuyers />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/drivers",
        element: (
          <PermissionProtectedRoute requiredModule="drivers" requiredAction="view">
            <Drivers />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/drivers/:driverId",
        element: (
          <PermissionProtectedRoute requiredModule="drivers" requiredAction="veiwDetails">
            <DriversDetails />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/instructors",
        element: (
          <PermissionProtectedRoute requiredModule="instructors" requiredAction="view">
            <Instructors />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/coupon-code",
        element: (
          <PermissionProtectedRoute requiredModule="coupon-code" requiredAction="view">
            <CouponCode />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/banner",
        element: (
          <PermissionProtectedRoute requiredModule="legal-and-banner" requiredAction="view">
            <Banner />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/terms-and-conditions",
        element: (
          <PermissionProtectedRoute requiredModule="legal-and-banner" requiredAction="view">
            <TermsAndConditions />
          </PermissionProtectedRoute>
        ),
      },
      {
        path: "/privacy-policy",
        element: (
          <PermissionProtectedRoute requiredModule="legal-and-banner" requiredAction="view">
            <PrivacyPolicy />
          </PermissionProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);