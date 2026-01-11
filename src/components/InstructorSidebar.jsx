import { Menu } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { FaSpa, FaUserMd, FaHome } from "react-icons/fa";
import { TbMessageMinus } from "react-icons/tb";

const InstructorSidebar = ({ onClick }) => {
  const location = useLocation();

  // Determine the selected key based on current route
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/instructor") return ["instructor"];
    if (path === "/instructor/my-spa-classes") return ["my-spa-classes"];
    if (path === "/instructor/my-physio-classes") return ["my-physio-classes"];
    if (path === "/instructor/my-classes") return ["my-classes"];
    if (path === "/instructor/massages") return ["massages"];
    return ["instructor"];
  };

  const sidebarItems = [
    {
      key: "instructor",
      icon: <AppstoreOutlined />,
      label: <Link to="/instructor">Dashboard</Link>,
    },
    {
      key: "my-spa-classes",
      icon: <FaSpa />,
      label: <Link to="/instructor/my-spa-classes">My Spa Classes</Link>,
    },
    {
      key: "my-physio-classes",
      icon: <FaUserMd />,
      label: <Link to="/instructor/my-physio-classes">My Physio Classes</Link>,
    },
    {
      key: "my-classes",
      icon: <FaHome />,
      label: <Link to="/instructor/my-classes">My Classes</Link>,
    },

    {
      key: "massages",
      icon: <TbMessageMinus />,
      label: <Link to="/instructor/massages">Massages</Link>,
    },
  ];

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

export default InstructorSidebar;
