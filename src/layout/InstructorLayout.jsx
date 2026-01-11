import React, { useState, useEffect } from "react";
import { Breadcrumb, Layout, Drawer } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import InstructorSidebar from "../components/InstructorSidebar";
import { useInstructor } from "../context/InstructorContext";
import Navbar from "../components/Navbar";

const { Header, Content, Sider } = Layout;

const InstructorLayout = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const location = useLocation();
  const navigate = useNavigate();

  const { instructorProfile, refetch } = useInstructor();

  // Breadcrumb create
  const generateBreadcrumbItems = () => {
    // Remove '/instructor' from pathname and split by '/'
    const pathnames = location.pathname
      .replace("/instructor", "")
      .split("/")
      .filter((x) => x); // Filter out empty strings

    const breadcrumbItems = [
      { title: "Instructor Dashboard", href: "/instructor" },
    ];

    // Add remaining path segments
    pathnames.forEach((value, index) => {
      const url = `/instructor/${pathnames
        .slice(0, index + 1)
        .join("/")}`;
      breadcrumbItems.push({
        title: value
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        href: url,
      });
    });

    return breadcrumbItems;
  };

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);
  const handleGoBack = () => navigate(-1);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout>
      <Header className="bg-[#FFFFFF] sticky top-0 z-10 w-full flex items-center p-0 h-20">
        <Navbar
          adminProfile={instructorProfile}
          refetch={refetch}
          showDrawer={showDrawer}
        />
      </Header>

      <Layout>
        {isLargeScreen && (
          <Sider
            className="hidden lg:block h-screen fixed left-0 top-20"
            width={320}
            style={{
              backgroundColor: "#FFFFFF",
              overflow: "auto",
              height: "93vh",
              position: "fixed",
              insetInlineStart: 0,
              bottom: 64,
              scrollbarWidth: "thin",
              scrollbarGutter: "stable",
            }}
          >
            <InstructorSidebar instructorProfile={instructorProfile} />
          </Sider>
        )}

        <Drawer
          title="Instructor Menu"
          placement="left"
          onClose={closeDrawer}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
        >
          <InstructorSidebar
            instructorProfile={instructorProfile}
            onClick={closeDrawer}
          />
        </Drawer>

        <Layout style={{ marginLeft: isLargeScreen ? 320 : 0 }}>
          <Content>
            <div
              className="p-2 lg:px-8  min-h-[88vh]"
              style={{ background: "#e6f0f5" }}
            >
              <div className="flex items-center gap-x-2 mb-5">
                <ArrowLeftOutlined
                  onClick={handleGoBack}
                  className="text-gray-500 text-[20px] lg:text-[26px] mt-1 font-semibold cursor-pointer hover:text-black"
                />

                <Breadcrumb
                  separator={<span style={{ color: "gray" }}>/</span>}
                  className=" text-[20px] lg:text-[28px] font-semibold"
                >
                  {generateBreadcrumbItems().map((item, index) => (
                    <Breadcrumb.Item key={index}>
                      <Link to={item.href}>{item.title}</Link>
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>
              </div>

              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default InstructorLayout;
