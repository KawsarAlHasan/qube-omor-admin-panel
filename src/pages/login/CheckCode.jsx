import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
// import { API } from "../../api/api";

const CheckCode = () => {
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log("values", values.otp);

      message.success("OTP verified successfully!");

      navigate("/set-new-password");

      // console.log("response", response);
    } catch (error) {
      const errorMessage =
        error.response?.data?.non_field_errors[0] ||
        "Verification failed. Please try again.";

      message.error(errorMessage);
      console.log(error, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      // const response = await API.post("/password-reset-request/", {
      //   email: email,
      // });

      message.success("New OTP sent to your email!");
    } catch (error) {
      message.error("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  p-4 bg-[#e6f0f5]">
      <div className=" p-8 shadow-lg rounded-lg   w-[530px]">
        <img src={logo} alt="Logo" className=" w-[120px]  mx-auto pb-4" />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600">
            We sent a reset link to <strong>{email}</strong>. Enter the 6-digit
            code from the email.
          </p>
        </div>

        <Form form={form} onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="otp"
            rules={[
              {
                required: true,
                message: "Please input the OTP!",
              },
              {
                pattern: /^[0-9]{6}$/,
                message: "Please enter a valid 6-digit code",
              },
            ]}
            className="mb-6 text-center"
          >
            <Input.OTP
              length={6}
              formatter={(str) => str.toUpperCase()}
              inputType="number"
              inputStyle={{
                width: 50,
                height: 50,
                fontSize: 18,
                margin: "0 4px",
                textAlign: "center",
              }}
            />
          </Form.Item>

          <Form.Item className="mb-4">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="h-12 font-semibold text-lg my-main-button"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Didn't receive the email?{" "}
              <Button
                type="link"
                loading={resendLoading}
                onClick={handleResend}
                className="p-0 font-medium"
              >
                Resend
              </Button>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CheckCode;
