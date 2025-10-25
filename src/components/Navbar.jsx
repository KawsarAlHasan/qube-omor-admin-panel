import { Avatar, Dropdown, Button, Divider, Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";
import { MenuOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import ChangePassword from "./ChangePassword";
import AccountSetting from "./AccountSetting";
import { signOutAdmin, useAdminDashboard } from "../api/api";

const Navbar = ({ showDrawer }) => {
  const { adminProfile, isLoading, isError, error, refetch } =
    useAdminDashboard();

  const navigate = useNavigate();

  const handleSignOut = () => {
    signOutAdmin();
    navigate("/login");
  };

  const profileMenuItems = [
    {
      key: "adminProfile",
      label: (
        <div className="p-2 cursor-default">
          <div className="flex gap-3 items-start">
            <Avatar
              size={50}
              src={adminProfile?.profile_image}
              icon={<UserOutlined />}
            />
            <div>
              <h1 className="text-[#242424] text-[16px] font-bold mb-1">
                {adminProfile?.name}
              </h1>
              <Tag color="blue" className="m-0">
                {adminProfile?.role}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "profile",
      label: <AccountSetting adminProfile={adminProfile} refetch={refetch} />,
    },
    {
      key: "change-password",
      label: <ChangePassword />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <div
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
        >
          <LogoutOutlined /> Logout
        </div>
      ),
    },
  ];

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 z-50 py-2 border-b">
      <div className="mx-4 lg:mx-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <Button
              type="text"
              className="md:hidden mr-3"
              icon={<MenuOutlined className="text-lg" />}
              onClick={showDrawer}
            />

            <Link to="/" className="flex items-center">
              <img src={logoImage} alt="Logo" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <Dropdown
              menu={{ items: profileMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
              overlayStyle={{ width: "300px" }}
            >
              <div className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Avatar
                  size="large"
                  src={adminProfile?.profile_image}
                  icon={<UserOutlined />}
                  className="border-2 border-gray-200 hover:border-orange-400 transition-colors"
                />
                <div className="hidden md:block ">
                  <div className="text-[#242424] text-[14px] font-semibold leading-tight">
                    {adminProfile?.name}
                  </div>
                  <div className="text-[12px] text-gray-500 leading-tight">
                    {adminProfile?.role}
                  </div>
                </div>
                <div className="hidden md:block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
