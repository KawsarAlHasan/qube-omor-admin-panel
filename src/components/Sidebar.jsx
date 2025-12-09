import { Menu } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { Link, matchPath, useLocation } from "react-router-dom";
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
  FaHome,
  FaCalendarAlt,
  FaBoxes,
  FaCarrot, // Physio Booking
  FaFileContract,
  FaShieldAlt,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { TbMessageMinus } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useAdminProfile } from "../api/api";
import driverIcon from "../assets/icons/driverIcon.png";
import { GiVerticalBanner } from "react-icons/gi";
import { RiCoupon2Fill } from "react-icons/ri";

const Sidebar = ({ onClick }) => {
  const location = useLocation();

  const { adminProfile } = useAdminProfile();

  // Determine the selected key based on current route
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/") return ["dashboard"];
    if (path === "/analytics") return ["analytics"];
    if (path === "/food-details") return ["food-details", "restaurant"];
    if (path === "/food-orders") return ["food-orders", "restaurant"];
    if (path === "/food-category") return ["food-category", "restaurant"];
    if (path === "/ingredients") return ["ingredients", "restaurant"];
    if (path === "/spa-classes") return ["spa-classes", "spa"];
    if (path === "/spa-booking") return ["spa-booking", "spa"];
    if (path === "/physio-classes") return ["physio-classes", "physio"];
    if (path === "/physio-booking") return ["physio-booking", "physio"];
    if (path === "/classes") return ["classes", "classes-management"];
    if (path === "/classes-booking")
      return ["classes-booking", "classes-management"];
    if (path === "/credits") return ["credits"];
    if (path === "/credits-buyers") return ["credits-buyers"];
    if (path === "/user-management") return ["user-management"];
    if (path === "/user-massages") return ["user-massages"];
    if (path === "/administrators") return ["administrators"];
    if (path === "/drivers") return ["drivers", "settings"];

    if (matchPath("/drivers/:driverId", path)) {
      return ["drivers", "settings"];
    }

    if (path === "/coupon-code") return ["coupon-code", "settings"];
    if (path === "/instructors") return ["instructors", "settings"];
    if (path === "/banner") return ["banner", "settings"];
    if (path === "/terms-and-conditions")
      return ["terms-and-conditions", "settings"];
    if (path === "/privacy-policy") return ["privacy-policy", "settings"];
    return ["dashboard"];
  };

  const isSuperAdmin = adminProfile?.role === "Super Admin";

  const sidebarItems = [
    {
      key: "dashboard",
      icon: <AppstoreOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    // {
    //   key: "analytics",
    //   icon: <IoMdAnalytics />,
    //   label: <Link to="/analytics">Analytics</Link>,
    // },
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
        {
          key: "food-category",
          icon: <FaBoxes />,
          label: <Link to="/food-category">Food Category</Link>,
        },
        {
          key: "ingredients",
          icon: <FaCarrot />,
          label: <Link to="/ingredients">Ingredients</Link>,
        },
      ],
    },
    {
      key: "spas",
      icon: <FaSpa />,
      label: "Spa",
      children: [
        {
          key: "spa-classes",
          icon: <FaHotTub />,
          label: <Link to="/spa-classes">Spa Classes</Link>,
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
          key: "physio-classes",
          icon: <FaHeartbeat />,
          label: <Link to="/physio-classes">Physio Classes</Link>,
        },
        {
          key: "physio-booking",
          icon: <FaCalendarAlt />,
          label: <Link to="/physio-booking">Physio Booking</Link>,
        },
      ],
    },
    {
      key: "classes-management",
      icon: <FaHome />,
      label: "Classes",
      children: [
        {
          key: "classes",
          icon: <FaHeartbeat />,
          label: <Link to="/classes">Classes</Link>,
        },
        {
          key: "classes-booking",
          icon: <FaCalendarAlt />,
          label: <Link to="/classes-booking">Classes Booking</Link>,
        },
      ],
    },
    {
      key: "credits",
      icon: <FaBoxes />,
      label: <Link to="/credits">Credits</Link>,
    },
    {
      key: "credits-buyers",
      icon: <FaBoxes />,
      label: <Link to="/credits-buyers">Credits Buyers</Link>,
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

    {
      key: "settings",
      icon: <IoSettingsOutline />,
      label: "Settings",
      children: [
        {
          key: "drivers",
          icon: <img className="w-4" src={driverIcon} alt="driver" />,
          label: <Link to="/drivers">Drivers</Link>,
        },
        {
          key: "instructors",
          icon: <FaChalkboardTeacher />,
          label: <Link to="/instructors">Instructors</Link>,
        },
        {
          key: "coupon-code",
          icon: <RiCoupon2Fill />,
          label: <Link to="/coupon-code">Coupon Code</Link>,
        },
        {
          key: "banner",
          icon: <GiVerticalBanner />,
          label: <Link to="/banner">Banner</Link>,
        },
        {
          key: "terms-and-conditions",
          icon: <FaFileContract />,
          label: <Link to="/terms-and-conditions">Terms and Conditions</Link>,
        },
        {
          key: "privacy-policy",
          icon: <FaShieldAlt />,
          label: <Link to="/privacy-policy">Privacy Policy</Link>,
        },
      ],
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        height: "90vh",
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
