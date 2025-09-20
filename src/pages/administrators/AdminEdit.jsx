import React, { useState } from "react";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Input, message, Select } from "antd";
// import { API } from "../../api/api";

const AdminEdit = ({ adminProfile, refetch }) => {
  const isSuperAdmin = adminProfile.role === "superadmin";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);





  const handleFinish = async (values) => {
    try {
      setLoading(true);

      const submitData = {
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        role: values.role,
      };

      console.log(submitData, "submitData");

      // await API.put(
      //   `/admin/administrators/${adminProfile.id}/update/`,
      //   submitData
      // );

      message.success("Admin updated successfully!");
      refetch();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err, "err");
      message.error(err.response?.data?.error || "Failed to update Admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <EditOutlined
        className={`text-[23px] my-main-button p-1 rounded-sm text-white ${
          isSuperAdmin
            ? "!cursor-not-allowed opacity-50"
            : "hover:text-blue-300 cursor-pointer"
        }`}
        onClick={isSuperAdmin ? undefined : showModal}
      />

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
            id: adminProfile?.id,
            full_name: adminProfile?.full_name,
            email: adminProfile?.email,
            phone: adminProfile?.phone,
            role: adminProfile?.role,
          }}
        >
          <Form.Item
            label="Name"
            name="full_name"
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
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="superadmin">Super Admin</Option>
            </Select>
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

export default AdminEdit;
