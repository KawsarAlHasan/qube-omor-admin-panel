import { useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { SettingOutlined } from "@ant-design/icons";
// import { API } from "../api/api";

const ChangePassword = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      // const res = await API.post("/change-password/", {
      //   old_password: values.old_password,
      //   new_password: values.new_password,
      //   retype_new_password: values.retype_new_password,
      // });
      message.success("Password changed successfully!");
      setIsModalOpen(false);
    } catch (err) {
      message.error(err.response?.data?.detail || "Failed to change password");
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
        <SettingOutlined /> Change Password
      </div>

      <Modal
        title="Change Password"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // we'll use Form submit button instead
      >
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Old Password"
            name="old_password"
            rules={[
              { required: true, message: "Please enter your old password" },
            ]}
          >
            <Input.Password placeholder="Enter your old password" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="new_password"
            rules={[{ required: true, message: "Please enter a new password" }]}
          >
            <Input.Password placeholder="Enter your new password" />
          </Form.Item>

          <Form.Item
            label="Retype New Password"
            name="retype_new_password"
            dependencies={["new_password"]}
            rules={[
              { required: true, message: "Please retype your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Retype your new password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" className="my-main-button" htmlType="submit" loading={loading} block>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangePassword;
