import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MailOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import logo from "../../assets/logo.png";
import { API } from "../../api/api";

const CheckCode = () => {
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [form] = Form.useForm();

  const params = new URLSearchParams(location.search);
  const userType = params.get("type");
  const isInstructor = userType === "instructor";
  const userTypeText = isInstructor ? "Instructor" : "Admin";

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Check if email exists, if not redirect
  useEffect(() => {
    if (!email) {
      message.warning("Please enter your email first");
      navigate(
        isInstructor ? "/forget-password?type=instructor" : "/forget-password"
      );
    }
  }, [email, navigate, isInstructor]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const endpoint = isInstructor
        ? "/forgot-password/check-reset-code"
        : "/admin-forgot-password/check-reset-code";

      const response = await API.post(endpoint, {
        email: email,
        otp: values.otp,
      });

      localStorage.setItem("otp", values.otp);
      localStorage.setItem(
        "resetUserType",
        isInstructor ? "instructor" : "admin"
      );

      message.success("Verification code confirmed successfully!");

      setTimeout(() => {
        navigate(
          isInstructor
            ? "/set-new-password?type=instructor"
            : "/set-new-password"
        );
      }, 500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Verification failed. Please check your code and try again.";

      message.error(errorMessage);
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResendLoading(true);
    try {
      const endpoint = isInstructor
        ? "/forgot-password/send-reset-code"
        : "/admin-forgot-password/send-reset-code";

      const response = await API.post(endpoint, {
        email: email,
      });

      message.success("A new verification code has been sent to your email!");
      setCountdown(60); // Set 60 seconds countdown
      form.resetFields(); // Clear the OTP input
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to resend code. Please try again later."
      );
    } finally {
      setResendLoading(false);
    }
  };

  // Mask email for privacy
  const maskEmail = (email) => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.charAt(0) + "***" + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
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
            <SafetyOutlined
              className={`text-3xl ${
                isInstructor ? "text-purple-600" : "text-blue-600"
              }`}
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[32px] text-[#222222] font-bold text-center mb-3">
          Verify Your Email
        </h2>

        {/* Subtitle */}
        <p className="text-center text-[#6B7280] mb-2 text-[15px] leading-relaxed px-4">
          We've sent a 6-digit verification code to
        </p>
        <p className="text-center text-[#374151] font-semibold mb-8 text-[16px]">
          {maskEmail(email)}
        </p>

        {/* Form */}
        <Form form={form} onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="otp"
            rules={[
              {
                required: true,
                message: "Please enter the 6-digit code",
              },
              {
                pattern: /^[0-9]{6}$/,
                message: "Code must be exactly 6 digits",
              },
            ]}
            className="mb-6"
          >
            <div className="flex justify-center">
              <Input.OTP
                length={6}
                formatter={(str) => str.toUpperCase()}
                inputType="number"
                size="large"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                }}
              />
            </div>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item className="mb-4">
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
              {loading ? "Verifying Code..." : "Verify & Continue"}
            </Button>
          </Form.Item>

          {/* Resend Section */}
          <div className="text-center mt-6">
            <p className="text-[#6B7280] text-[15px] mb-2">
              Didn't receive the code?
            </p>
            <Button
              type="link"
              loading={resendLoading}
              onClick={handleResend}
              disabled={countdown > 0}
              className={`p-0 font-semibold text-[15px] ${
                countdown > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : isInstructor
                  ? "text-purple-600 hover:text-purple-700"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              {countdown > 0
                ? `Resend in ${countdown}s`
                : resendLoading
                ? "Sending..."
                : "Resend Code"}
            </Button>
          </div>
        </Form>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Button
            type="link"
            onClick={() =>
              navigate(
                isInstructor
                  ? "/forget-password?type=instructor"
                  : "/forget-password"
              )
            }
            className={`text-[14px] ${
              isInstructor
                ? "text-purple-600 hover:text-purple-700"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            ← Change Email Address
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckCode;
