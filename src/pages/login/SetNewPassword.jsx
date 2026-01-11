import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Progress } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LockOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import logo from "../../assets/logo.png";
import { API } from "../../api/api";

const SetNewPassword = () => {
  const email = localStorage.getItem("email");
  const otp = localStorage.getItem("otp");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const userType = params.get("type");
  const isInstructor = userType === "instructor";
  const userTypeText = isInstructor ? "Instructor" : "Admin";

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Calculate password strength
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordCriteria({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      });
      return;
    }

    const criteria = {
      length: password.length >= 8,
      // uppercase: /[A-Z]/.test(password),
      // lowercase: /[a-z]/.test(password),
      // number: /[0-9]/.test(password),
      // special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordCriteria(criteria);

    const strength = Object.values(criteria).filter(Boolean).length;
    setPasswordStrength((strength / 5) * 100);
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "#ef4444";
    if (passwordStrength < 80) return "#f59e0b";
    return "#22c55e";
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 80) return "Medium";
    return "Strong";
  };

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isInstructor
        ? "/forgot-password/set-new-password"
        : "/admin-forgot-password/set-new-password";

      const response = await API.post(endpoint, {
        email: email,
        otp: otp,
        password: values.password,
      });

      // Save the token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userType", isInstructor ? "instructor" : "admin");

      // Clear reset-related data
      localStorage.removeItem("email");
      localStorage.removeItem("otp");
      localStorage.removeItem("resetUserType");

      // Show success message
      message.success("Password has been reset successfully!");

      // Redirect to the dashboard
      setTimeout(() => {
        navigate(isInstructor ? "/instructor" : "/");
      }, 500);
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please fill in all required fields correctly.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-[#e6f0f5] to-[#d4e7f0]">
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
            <LockOutlined
              className={`text-3xl ${
                isInstructor ? "text-purple-600" : "text-blue-600"
              }`}
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[32px] text-[#222222] font-bold text-center mb-3">
          Create New Password
        </h2>

        {/* Subtitle */}
        <p className="text-center text-[#6B7280] mb-8 text-[15px] leading-relaxed px-4">
          Your new password must be different from previously used passwords for
          security
        </p>

        {/* Form */}
        <Form
          form={form}
          name="setNewPasswordForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          {/* New Password Field */}
          <Form.Item
            label={
              <span className="text-[16px] text-[#374151] font-medium">
                New Password
              </span>
            }
            name="password"
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              className="p-3 rounded-lg"
              placeholder="Enter your new password"
              size="large"
              onChange={(e) => checkPasswordStrength(e.target.value)}
            />
          </Form.Item>

          {/* Confirm Password Field */}
          <Form.Item
            label={
              <span className="text-[16px] text-[#374151] font-medium">
                Confirm Password
              </span>
            }
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              className="p-3 rounded-lg"
              placeholder="Confirm your new password"
              size="large"
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className={`h-12 text-[17px] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all ${
                isInstructor
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "my-main-button"
              }`}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </Form.Item>
        </Form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Button
            type="link"
            onClick={() =>
              navigate(isInstructor ? "/login?type=instructor" : "/login")
            }
            className={`text-[14px] ${
              isInstructor
                ? "text-purple-600 hover:text-purple-700"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            ← Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
