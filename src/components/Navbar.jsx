import { Avatar, Dropdown, Button, Divider } from "antd";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";
import { MenuOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
// import { signOutAdmin, useAdminDashboard } from "../api/api";
import ChangePassword from "./ChangePassword";
import AccountSetting from "./AccountSetting";

const Navbar = ({ showDrawer }) => {
  // const { adminDashboard, isLoading, isError, error, refetch } =
  //   useAdminDashboard();

  const navigate = useNavigate();

  const handleSignOut = () => {
    // signOutAdmin();
    navigate("/login");
  };

  const adminProfile = {
    name: "Admin Name",
    role: "Super Admin",
    email: "super@admin.com",
    phone_number: "1234567890",
  };

  const profileMenuItems = [
    {
      key: "adminProfile",
      label: (
        <div className="mb-[-25px] cursor-default">
          <h1 className="text-[#242424] text-[20px] font-bold">
            {adminProfile?.name}{" "}
            <span className="text-[16px] font-normal">
              ({adminProfile?.role})
            </span>
          </h1>
          <p className="text-[#242424] text-[12px] my-[-10px]">
            {adminProfile?.email}
          </p>

          <Divider />
        </div>
      ),
    },
    {
      key: "profile",
      label: <AccountSetting adminProfile={adminProfile}  />,
    },
    {
      key: "change-password",
      label: <ChangePassword />,
    },
    {
      key: "logout",
      label: (
        <span
          onClick={handleSignOut}
          className="flex items-center gap-2 px-1 py-2 hover:bg-gray-100"
        >
          <LogoutOutlined /> Logout
        </span>
      ),
    },
  ];

  return (
    <header className="w-full text-[#FFFFFF] shadow-sm fixed top-0 z-50 py-[8px]">
      <div className=" mx-2 lg:ml-[30px] lg:mr-24 ">
        <div className="flex items-center justify-between h-16 ">
          {/* Left section */}
          <div className="flex items-center">
            <Button
              type="text"
              className="md:hidden mr-2"
              icon={<MenuOutlined className="text-lg" />}
              onClick={showDrawer}
            />

            <Link
              to="/"
              className="text-4xl font-bold text-[#FE7400] whitespace-nowrap"
            >
              <img src={logoImage} alt="Logo" className="w-auto h-[60px]" />
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4 lg:gap-8">
            <Dropdown
              menu={{ items: profileMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
              overlayClassName="w-[300px]"
            >
              <Avatar
                icon={<UserOutlined className="" />}
                size="large"
                className="cursor-pointer border border-white hover:opacity-80 transition-opacity"
              />
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
