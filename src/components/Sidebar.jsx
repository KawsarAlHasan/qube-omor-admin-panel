import { Menu } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { Link, matchPath, useLocation } from "react-router-dom";
import {
  FaUtensils,
  FaPizzaSlice,
  FaShoppingCart,
  FaUsers,
  FaSpa,
  FaHotTub,
  FaCalendarCheck,
  FaUserMd,
  FaHeartbeat,
  FaHome,
  FaCalendarAlt,
  FaBoxes,
  FaCarrot,
  FaFileContract,
  FaShieldAlt,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { TbMessageMinus } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import driverIcon from "../assets/icons/driverIcon.png";
import { GiVerticalBanner } from "react-icons/gi";
import { RiCoupon2Fill } from "react-icons/ri";

const Sidebar = ({ adminProfile, onClick }) => {
  const location = useLocation();

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
    if (path === "/administrators/roles") return ["administrators"];
    if (path === "/drivers") return ["drivers", "settings"];
    if (matchPath("/drivers/:driverId", path)) return ["drivers", "settings"];
    if (path === "/coupon-code") return ["coupon-code", "settings"];
    if (path === "/instructors") return ["instructors", "settings"];
    if (path === "/banner") return ["banner", "settings"];
    if (path === "/terms-and-conditions")
      return ["terms-and-conditions", "settings"];
    if (path === "/privacy-policy") return ["privacy-policy", "settings"];
    return ["dashboard"];
  };

  // Permission-based sidebar filtering
  const getFilteredSidebarItems = () => {
    const permissions = adminProfile?.role?.permissions || [];

    // Permission check helper
    const hasPermission = (moduleName, action = "view") => {
      const module = permissions.find((p) => p.accessibleModule === moduleName);
      if (!module) return false;

      // Special handling for settings modules
      if (moduleName === "legal-and-banner") {
        if (action === "view") return module.view;
        if (action === "edit") return module.edit;
      }

      return module[action] || false;
    };

    const baseItems = [
      {
        key: "dashboard",
        icon: <AppstoreOutlined />,
        label: <Link to="/">Dashboard</Link>,
        show: hasPermission("dashboard", "view"),
      },
      {
        key: "restaurant",
        icon: <FaUtensils />,
        label: "Restaurant",
        show:
          hasPermission("food-details", "view") ||
          hasPermission("food-orders", "view") ||
          hasPermission("food-category", "view") ||
          hasPermission("ingredients", "view"),
        children: [
          {
            key: "food-details",
            icon: <FaPizzaSlice />,
            label: <Link to="/food-details">Food Details</Link>,
            show: hasPermission("food-details", "view"),
          },
          {
            key: "food-orders",
            icon: <FaShoppingCart />,
            label: <Link to="/food-orders">Food Orders</Link>,
            show: hasPermission("food-orders", "view"),
          },
          {
            key: "food-category",
            icon: <FaBoxes />,
            label: <Link to="/food-category">Food Category</Link>,
            show: hasPermission("food-category", "view"),
          },
          {
            key: "ingredients",
            icon: <FaCarrot />,
            label: <Link to="/ingredients">Ingredients</Link>,
            show: hasPermission("ingredients", "view"),
          },
        ].filter((item) => item.show),
      },
      {
        key: "spas",
        icon: <FaSpa />,
        label: "Spa",
        show:
          hasPermission("spa-classes", "view") ||
          hasPermission("spa-booking", "view"),
        children: [
          {
            key: "spa-classes",
            icon: <FaHotTub />,
            label: <Link to="/spa-classes">Spa Classes</Link>,
            show: hasPermission("spa-classes", "view"),
          },
          {
            key: "spa-booking",
            icon: <FaCalendarCheck />,
            label: <Link to="/spa-booking">Spa Booking</Link>,
            show: hasPermission("spa-booking", "view"),
          },
        ].filter((item) => item.show),
      },
      {
        key: "physio",
        icon: <FaUserMd />,
        label: "Physio",
        show:
          hasPermission("physio-classes", "view") ||
          hasPermission("physio-booking", "view"),
        children: [
          {
            key: "physio-classes",
            icon: <FaHeartbeat />,
            label: <Link to="/physio-classes">Physio Classes</Link>,
            show: hasPermission("physio-classes", "view"),
          },
          {
            key: "physio-booking",
            icon: <FaCalendarAlt />,
            label: <Link to="/physio-booking">Physio Booking</Link>,
            show: hasPermission("physio-booking", "view"),
          },
        ].filter((item) => item.show),
      },
      {
        key: "classes-management",
        icon: <FaHome />,
        label: "Classes",
        show:
          hasPermission("classes", "view") ||
          hasPermission("classes-booking", "view"),
        children: [
          {
            key: "classes",
            icon: <FaHeartbeat />,
            label: <Link to="/classes">Classes</Link>,
            show: hasPermission("classes", "view"),
          },
          {
            key: "classes-booking",
            icon: <FaCalendarAlt />,
            label: <Link to="/classes-booking">Classes Booking</Link>,
            show: hasPermission("classes-booking", "view"),
          },
        ].filter((item) => item.show),
      },
      {
        key: "credits",
        icon: <FaBoxes />,
        label: <Link to="/credits">Credits</Link>,
        show: hasPermission("credits", "view"),
      },
      {
        key: "credits-buyers",
        icon: <FaBoxes />,
        label: <Link to="/credits-buyers">Credits Buyers</Link>,
        show: hasPermission("credits-buyers", "view"),
      },
      {
        key: "user-management",
        icon: <FaUsers />,
        label: <Link to="/user-management">User Management</Link>,
        show: hasPermission("user-management", "view"),
      },
      {
        key: "user-massages",
        icon: <TbMessageMinus />,
        label: <Link to="/user-massages">User Massages</Link>,
        show: hasPermission("user-massages", "view"),
      },
      {
        key: "administrators",
        icon: <MdOutlineAdminPanelSettings />,
        label: <Link to="/administrators">Administrators</Link>,
        show:
          hasPermission("administrators", "view") 
          // && adminProfile?.role?.name === "Super Admin",
      },
      {
        key: "settings",
        icon: <IoSettingsOutline />,
        label: "Settings",
        show:
          hasPermission("drivers", "view") ||
          hasPermission("instructors", "view") ||
          hasPermission("coupon-code", "view") ||
          hasPermission("legal-and-banner", "view"),
        children: [
          {
            key: "drivers",
            icon: <img className="w-4" src={driverIcon} alt="driver" />,
            label: <Link to="/drivers">Drivers</Link>,
            show: hasPermission("drivers", "view"),
          },
          {
            key: "instructors",
            icon: <FaChalkboardTeacher />,
            label: <Link to="/instructors">Instructors</Link>,
            show: hasPermission("instructors", "view"),
          },
          {
            key: "coupon-code",
            icon: <RiCoupon2Fill />,
            label: <Link to="/coupon-code">Coupon Code</Link>,
            show: hasPermission("coupon-code", "view"),
          },
          {
            key: "banner",
            icon: <GiVerticalBanner />,
            label: <Link to="/banner">Banner</Link>,
            show: hasPermission("legal-and-banner", "view"),
          },
          {
            key: "terms-and-conditions",
            icon: <FaFileContract />,
            label: <Link to="/terms-and-conditions">Terms and Conditions</Link>,
            show: hasPermission("legal-and-banner", "view"),
          },
          {
            key: "privacy-policy",
            icon: <FaShieldAlt />,
            label: <Link to="/privacy-policy">Privacy Policy</Link>,
            show: hasPermission("legal-and-banner", "view"),
          },
        ].filter((item) => item.show),
      },
    ];

    // Filter items and remove empty parent items
    return baseItems
      .filter((item) => item.show)
      .map((item) => ({
        ...item,
        children:
          item.children && item.children.length > 0 ? item.children : undefined,
      }))
      .filter((item) => !item.children || item.children.length > 0);
  };

  // Show loading if profile not available
  if (!adminProfile) {
    return (
      <div
        style={{
          width: "256px",
          height: "90vh",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = getFilteredSidebarItems();

  return (
    <div style={{ position: "relative", height: "90vh" }}>
      <Menu
        mode="inline"
        selectedKeys={getSelectedKey()}
        items={sidebarItems}
        onClick={onClick}
        style={{
          height: "calc(100% - 64px)",
          backgroundColor: "#ffffff",
          color: "#002436",
          borderRight: 0,
        }}
      />
    </div>
  );
};

export default Sidebar;
