import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { API } from "../../api/api";

const Login = () => {
  const [loading, setLoading] = useState(false); // Loading state for login button
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const onFinish = async (values) => {
    setLoading(true); // Start loading when submitting form
    try {
      const response = await API.post("/admin/login", values);

      // // If successful, save the token in localStorage
      localStorage.setItem("token", response.data.token);

      // Show success message
      message.success("Admin Login successful!");

      // Redirect to the admin dashboard (replace with your route)
      window.location.href = "/";
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false); // Stop loading after request
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please input valid email and password.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#e6f0f5]">
      <div className="p-8 pt-5 pb-7 shadow-lg rounded-lg w-[530px] h-[635px]">
        <img src={logo} alt="Logo" className=" w-[120px]  mx-auto pb-4" />
        <h2 className="text-[30px] text-[#222222] font-bold text-center mb-6">
          Login to Account
        </h2>
        <h6 className="text-center text-[#4E4E4E] mb-6 text-[18px]">
          Please enter your email and password to continue
        </h6>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          // autoComplete="off"
        >
          {/* Email Field */}
          <div className="mb-3">
            <label className="text-[18px] text-[#222222] block mb-1">
              Email address:
            </label>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                type="email"
                className="p-3"
                placeholder="Enter your email..."
              />
            </Form.Item>
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label className="text-[18px] text-[#222222] block mb-1">
              Password:
            </label>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                className="p-3"
                placeholder="Enter your password..."
              />
            </Form.Item>
          </div>

          {/* Remember Me */}
          <div className="mb-3 flex justify-between">
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>
                <span className="text-[16px] text-[#4E4E4E]">Remember me</span>
              </Checkbox>
            </Form.Item>
            <Link to="/forget-password" className="text-[#3F5EAB] text-[16px]">
              Forget Password?
            </Link>
          </div>

          {/* Submit Button */}
          <div className="mb-4">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full py-6 text-[18px] font-semibold my-main-button"
                loading={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
