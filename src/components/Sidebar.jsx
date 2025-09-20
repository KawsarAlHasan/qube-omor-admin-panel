import { Menu } from "antd";
import { AppstoreOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { FaShoppingCart, FaUsers } from "react-icons/fa";
import {
  FaUtensils, // Restaurant
  FaPizzaSlice, // Food Details
  FaShoppingCart, // Food Orders
  FaUsers,
  FaSpa, // Spa
  FaHotTub, // Spa Service / Massage
  FaCalendarCheck, // Spa Booking
  FaUserMd, // Physio / Doctor
  FaHeartbeat, // Physio Service
  FaCalendarAlt, // Physio Booking
} from "react-icons/fa";
import { TbMessageMinus } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";




import { FaBuildingFlag } from "react-icons/fa6";
import { Children } from "react";
// import { signOutAdmin, useAdminDashboard } from "../api/api";

const { SubMenu } = Menu;

const Sidebar = ({ onClick }) => {
  const location = useLocation();

  // const { adminDashboard, isLoading, isError, error, refetch } =
  //   useAdminDashboard();

  const navigate = useNavigate();
  const handleSignOut = () => {
    // signOutAdmin();
    navigate("/login");
  };

  // Determine the selected key based on current route
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/") return ["1"];
    if (path === "/food-details") return ["food-details", "restaurant"];
    if (path === "/food-orders") return ["food-orders", "restaurant"];
    if (path === "/spa-packages") return ["spa-packages", "spa"];
    if (path === "/spa-booking") return ["spa-booking", "spa"];
    if (path === "/physio-packages") return ["physio-packages", "physio"];
    if (path === "/physio-booking") return ["physio-booking", "physio"];
    if (path === "/user-management") return ["user-management"];
    if (path === "/user-massages") return ["user-massages"];
    if (path === "/administrators") return ["administrators"];
    return ["1"];
  };

  const isSuperAdmin = "superadmin";

  const sidebarItems = [
    {
      key: "1",
      icon: <AppstoreOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },

    {
      key: "restaurant",
      icon: <FaUtensils />,
      label: "Restaurant",
      children: [
        {
          key: "food-details",
          icon: <FaPizzaSlice />,
          label: <Link to="/food-details">Food Details</Link>,
        },
        {
          key: "food-orders",
          icon: <FaShoppingCart />,
          label: <Link to="/food-orders">Food Orders</Link>,
        },
      ],
    },
    {
      key: "spas",
      icon: <FaSpa />,
      label: "Spa",
      children: [
        {
          key: "spa-packages",
          icon: <FaHotTub />,
          label: <Link to="/spa-packages">Spa Packages</Link>,
        },
        {
          key: "spa-booking",
          icon: <FaCalendarCheck />,
          label: <Link to="/spa-booking">Spa Booking</Link>,
        },
      ],
    },
    {
      key: "physio",
      icon: <FaUserMd />,
      label: "Physio",
      children: [
        {
          key: "physio-packages",
          icon: <FaHeartbeat />,
          label: <Link to="/physio-packages">Physio Packages</Link>,
        },
        {
          key: "physio-booking",
          icon: <FaCalendarAlt />,
          label: <Link to="/physio-booking">Physio Booking</Link>,
        },
      ],
    },

    {
      key: "user-management",
      icon: <FaUsers />,
      label: <Link to="/user-management">User Management</Link>,
    },

    {
      key: "user-massages",
      icon: <TbMessageMinus />,
      label: <Link to="/user-massages">User Massages</Link>,
    },

    ...(isSuperAdmin
      ? [
          {
            key: "administrators",
            icon: <MdOutlineAdminPanelSettings />,
            label: <Link to="/administrators">Administrators</Link>,
          },
        ]
      : []),

    // Add logout as a menu item at the bottom
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      className: "bottom-20",
      onClick: handleSignOut,
      style: {
        position: "absolute",
        width: "100%",
      },
      danger: true,
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={getSelectedKey()}
        items={sidebarItems}
        onClick={onClick}
        style={{
          height: "calc(100% - 64px)",
          backgroundColor: "#ffffff",
          color: "#002436",
        }}
      />
    </div>
  );
};

export default Sidebar;
