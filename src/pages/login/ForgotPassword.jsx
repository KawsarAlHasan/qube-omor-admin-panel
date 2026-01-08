import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.png";
import { API } from "../../api/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userType = params.get("type");

  const isInstructor = userType === "instructor";
  const userTypeText = isInstructor ? "Instructor" : "Admin";

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const endpoint = isInstructor
        ? "/forgot-password/send-reset-code"
        : "/admin-forgot-password/send-reset-code";

      const response = await API.post(endpoint, {
        email: values.email,
      });

      // Save the email and user type in localStorage
      localStorage.setItem("email", values.email);
      localStorage.setItem(
        "resetUserType",
        isInstructor ? "instructor" : "admin"
      );

      // Show success message
      message.success("Reset code sent successfully! Please check your email.");

      setTimeout(() => {
        navigate(isInstructor ? "/check-code?type=instructor" : "/check-code");
      }, 500);
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to send reset code. Please verify your email and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please enter a valid email address.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#e6f0f5] to-[#d4e7f0]">
      <div className="bg-white p-10 py-12 shadow-2xl rounded-2xl w-full max-w-[550px] border border-gray-100">
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
            {userTypeText} Portal
          </span>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isInstructor ? "bg-purple-100" : "bg-blue-100"
            }`}
          >
            <MailOutlined
              className={`text-3xl ${
                isInstructor ? "text-purple-600" : "text-blue-600"
              }`}
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[32px] text-[#222222] font-bold text-center mb-3">
          Forgot Password?
        </h2>

        {/* Subtitle */}
        <p className="text-center text-[#6B7280] mb-8 text-[15px] leading-relaxed px-4">
          No worries! Enter your email address and we'll send you a verification
          code to reset your password
        </p>

        {/* Form */}
        <Form
          name="forgotPasswordForm"
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
              prefix={<MailOutlined className="text-gray-400" />}
              type="email"
              className="p-3 rounded-lg"
              placeholder="Enter your registered email"
              size="large"
            />
          </Form.Item>

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
              {loading ? "Sending Code..." : "Send Verification Code"}
            </Button>
          </Form.Item>
        </Form>

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <Link
            to={isInstructor ? "/login?type=instructor" : "/login"}
            className={`inline-flex items-center gap-2 text-[15px] font-medium transition-colors ${
              isInstructor
                ? "text-purple-600 hover:text-purple-700"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            <ArrowLeftOutlined className="text-sm" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
