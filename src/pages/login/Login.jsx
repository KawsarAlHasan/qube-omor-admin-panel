import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, message, Divider } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.png";
import { API } from "../../api/api";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const type = params.get("type");
  const isInstructor = type === "instructor";

  // Dynamic content based on user type
  const userType = isInstructor ? "Instructor" : "Admin";
  const loginEndpoint = isInstructor ? "/auth/email/login" : "/admin/login";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await API.post(loginEndpoint, values);

      if (isInstructor) {
        if (
          response?.data?.data?.user?.role === "Instructor" &&
          response?.data?.data?.user?.status === "Active"
        ) {
          localStorage.setItem("token", response?.data?.data?.token);
          localStorage.setItem("userType", "instructor");
          message.success(`Instructor login successful!`);
          window.location.href = "/";
        } else {
          message.error("Your account is not active! Please contact the super admin.");
        }
      } else {
        if (response?.data?.data?.status === "Active") {
          localStorage.setItem("token", response?.data?.token);
          localStorage.setItem("userType", "admin");
          message.success(`Admin login successful!`);
          window.location.href = "/";
        } else {
          message.error("Your account is not active! Please contact the super admin.");
        }
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please provide valid email and password.");
  };

  const handleSwitchType = () => {
    if (isInstructor) {
      navigate("/login");
    } else {
      navigate("/login?type=instructor");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#e6f0f5] to-[#d4e7f0]">
      <div className="bg-white p-10 pt-8 pb-8 shadow-2xl rounded-2xl w-full max-w-[550px] border border-gray-100">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-[130px] h-auto" />
        </div>

        {/* User Type Badge */}
        <div className="flex justify-center mb-4">
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
              isInstructor
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {userType} Portal
          </span>
        </div>

        {/* Title */}
        <h2 className="text-[32px] text-[#222222] font-bold text-center mb-3">
          Welcome Back!
        </h2>

        {/* Subtitle */}
        <p className="text-center text-[#6B7280] mb-8 text-[16px] leading-relaxed">
          Sign in to your {userType.toLowerCase()} account to access the
          dashboard and manage your platform
        </p>

        {/* Login Form */}
        <Form
          name="loginForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          {/* Email Field */}
          <Form.Item
            label={
              <span className="text-[16px] text-[#374151] font-medium">
                Email Address
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              type="email"
              className="p-3 rounded-lg"
              placeholder="Enter your email address"
              size="large"
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label={
              <span className="text-[16px] text-[#374151] font-medium">
                Password
              </span>
            }
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              className="p-3 rounded-lg"
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          {/* Remember Me and Forgot Password */}
          <div className="flex justify-between items-center mb-6">
            <Form.Item name="remember" valuePropName="checked" className="mb-0">
              <Checkbox>
                <span className="text-[15px] text-[#6B7280]">
                  Keep me signed in
                </span>
              </Checkbox>
            </Form.Item>
            <Link
              to={
                isInstructor
                  ? "/forget-password?type=instructor"
                  : "/forget-password"
              }
              className="text-[#3F5EAB] hover:text-[#2d4485] text-[15px] font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              className={`w-full h-12 text-[17px] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all ${
                isInstructor
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "my-main-button"
              }`}
              loading={loading}
              size="large"
            >
              {loading ? "Signing in..." : `Sign In as ${userType}`}
            </Button>
          </Form.Item>
        </Form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Switch Login Type */}
        <div className="text-center">
          <p className="text-[#6B7280] text-[15px] mb-2">
            Looking for a different portal?
          </p>
          <button
            onClick={handleSwitchType}
            className={`text-[16px] font-semibold hover:underline transition-colors ${
              isInstructor
                ? "text-blue-600 hover:text-blue-700"
                : "text-purple-600 hover:text-purple-700"
            }`}
          >
            {isInstructor
              ? "Switch to Admin Login →"
              : "Switch to Instructor Login →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
