import React, { useState } from "react";
import { Button, Modal, Form, Input, Select, message } from "antd";
import { FaPlus } from "react-icons/fa";
// import { API } from "../../api/api";

const { Option } = Select;

const AddAdmin = ({ refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      // await API.post("/admin/administrators/create/", values);
      message.success("Admin created successfully!");
      refetch?.();
      setIsModalOpen(false);
    } catch (err) {
      message.error(err.response?.data?.detail || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" className="mb-2 my-main-button" onClick={showModal}>
        <FaPlus />
        New Administrators Profile Create
      </Button>

      <Modal
        title="Create New Admin"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter admin name" }]}
          >
            <Input placeholder="Enter admin name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter admin email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter admin email" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="+880..." />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="superadmin">Super Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" className="my-main-button" htmlType="submit" loading={loading} block>
              Create Admin
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddAdmin;
