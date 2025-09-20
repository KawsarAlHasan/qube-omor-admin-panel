import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Input, message } from "antd";
// import { API } from "../api/api";

const AccountSetting = ({ adminProfile }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      // const formData = new FormData();

      // formData.append("full_name", values.name);
      // formData.append("email", values.email);
      // formData.append("phone_number", values.phone_number);

      // await API.put(`/profile/update/`, formData);
      message.success("Profile updated successfully!");
      // refetch();
      setIsModalOpen(false);
    } catch (err) {
      message.error(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={showModal}
        className="flex items-center gap-2 px-1 py-2 cursor-pointer"
      >
        <UserOutlined /> Profile
      </div>

      <Modal
        title="Update Profile"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            name: adminProfile?.name,
            email: adminProfile?.email,
            phone_number: adminProfile?.phone_number,
            role: adminProfile?.role,
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Input disabled />
          </Form.Item>

          <Form.Item>
            <Button type="primary" className="my-main-button" htmlType="submit" loading={loading} block>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AccountSetting;
