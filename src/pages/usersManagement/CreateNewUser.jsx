import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  message,
  Upload,
} from "antd";
import {
  UserAddOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { API } from "../../api/api";

const { Option } = Select;

function CreateNewUser({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Required fields
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("phone", values.phone);
      formData.append("gender", values.gender);
      formData.append("role", "User");

      // Optional fields
      if (values.date_of_birth) {
        formData.append("date_of_birth", values.date_of_birth.toISOString());
      }
      if (values.address) {
        formData.append("address", values.address);
      }

      // Image file
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("profile_image", fileList[0].originFileObj);
      }

      await API.post("/auth/user-create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("User added successfully!");
      form.resetFields();
      setFileList([]);
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to add user.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent auto upload
  };

  return (
    <div className="">
      <Button
        type="primary"
        icon={<UserAddOutlined />}
        onClick={showModal}
        size="large"
        className="my-main-button"
      >
        Create New User
      </Button>

      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-semibold">
            <UserAddOutlined className="text-blue-600" />
            <span>Create New User</span>
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
              { required: true, message: "Please enter full name" },
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
              placeholder="user@example.com"
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
            <Form.Item label="Date of Birth" name="date_of_birth">
              <DatePicker
                className="w-full"
                size="large"
                format="YYYY-MM-DD"
                placeholder="Select date"
              />
            </Form.Item>

            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please select gender" }]}
            >
              <Select placeholder="Select gender" size="large">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Address" name="address">
            <Input.TextArea rows={3} placeholder="Enter address" size="large" />
          </Form.Item>

          <Form.Item label="Profile Image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              maxCount={1}
              accept="image/*"
            >
              {fileList.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div className="mt-2">Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

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
                className="my-main-button"
              >
                Create New User
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CreateNewUser;
