import React, { useState } from "react";
import { Modal, Form, InputNumber, Input, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { API } from "../../api/api";

const { TextArea } = Input;

function AddCredit({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Open modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await API.post("/credit-package/create", values);

      message.success("Credit added successfully");
      setIsModalOpen(false);
      form.resetFields();

      // Refetch the credits list
      if (refetch) {
        refetch();
      }
    } catch (error) {
      message.error("Failed to add credit");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        className="my-main-button"
        icon={<PlusOutlined />}
        onClick={showModal}
        size="large"
      >
        Add Credit
      </Button>

      <Modal
        title="Add New Credit Package"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            label="Credit Amount"
            name="credit"
            rules={[
              { required: true, message: "Please enter credit amount" },
              { type: "number", min: 1, message: "Credit must be positive" },
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder="Enter credit amount (e.g., 5000)"
              min={1}
            />
          </Form.Item>

          {/* <Form.Item
            label="Price ($)"
            name="price"
            rules={[
              { required: true, message: "Please enter price" },
              { type: "number", min: 0, message: "Price must be positive" },
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder="Enter price (e.g., 12000)"
              min={0}
              prefix="$"
            />
          </Form.Item> */}

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter description" },
              {
                min: 5,
                message: "Description must be at least 5 characters",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Enter description about the credit package"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                className="my-main-button"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Add Credit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddCredit;
