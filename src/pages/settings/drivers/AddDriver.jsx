import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, message } from "antd";
import {
  UserAddOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { API } from "../../../api/api";

const { Option } = Select;

function AddDriver({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        gender: values.gender,
      };

      await API.post("/auth/driver-create", payload);
      message.success("Driver added successfully!");
      form.resetFields();
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to add driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Button
        type="primary"
        icon={<UserAddOutlined />}
        onClick={showModal}
        size="large"
        className="my-main-button"
      >
        Add New Driver
      </Button>

      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-semibold">
            <UserAddOutlined className="text-blue-600" />
            <span>Add New Driver</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-6"
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: "Please enter driver name" },
              { min: 3, message: "Name must be at least 3 characters" },
            ]}
          >
            <Input
              prefix={<UserAddOutlined className="text-gray-400" />}
              placeholder="Enter full name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="driver@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please enter phone number" },
              {
                pattern: /^[0-9]{5,15}$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder="01744463140"
              size="large"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            {/* <Form.Item
              label="Date of Birth"
              name="date_of_birth"
              rules={[
                { required: true, message: "Please select date of birth" },
              ]}
            >
              <DatePicker
                className="w-full"
                size="large"
                format="YYYY-MM-DD"
                placeholder="Select date"
              />
            </Form.Item> */}

            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please select gender" }]}
            >
              <Select placeholder="Select gender" size="large">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item className="mb-0 mt-6">
            <div className="flex gap-3 justify-end">
              <Button onClick={handleCancel} size="large">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Driver
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddDriver;
