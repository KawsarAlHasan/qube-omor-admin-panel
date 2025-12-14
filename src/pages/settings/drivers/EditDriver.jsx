import React, { useState, useEffect } from "react";
import {
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
} from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { API } from "../../../api/api";
import moment from "moment";

const { Option } = Select;

function EditDriver({ record, refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      phone: record.phone,
      date_of_birth: record.date_of_birth ? moment(record.date_of_birth) : null,
      gender: record.gender,
      address: record.address,
    });

    if (record.profile_image) {
      setFileList([
        {
          uid: "-1",
          name: "current_image.jpg",
          status: "done",
          url: record.profile_image,
        },
      ]);
    }
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const handleDriverChange = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (values.name) formData.append("name", values.name);
      if (values.email) formData.append("email", values.email);
      if (values.phone) formData.append("phone", values.phone);
      if (values.date_of_birth) {
        formData.append("date_of_birth", values.date_of_birth.toISOString());
      }
      if (values.gender) formData.append("gender", values.gender);
      if (values.address) formData.append("address", values.address);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("profile_image", fileList[0].originFileObj);
      }

      const response = await API.put(`/user/update/${record._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Driver updated successfully!");
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
      refetch?.();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update Driver");
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
    <>
      <Button
        className="my-main-button"
        icon={<EditOutlined />}
        size="small"
        type="primary"
        onClick={showModal}
      >
        Edit
      </Button>
      <Modal
        title="Edit Driver"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleDriverChange}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input name!" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Please enter valid email!" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please input phone number!" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item label="Date of Birth" name="date_of_birth">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item label="Gender" name="gender">
            <Select placeholder="Select gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input.TextArea rows={3} placeholder="Enter address" />
          </Form.Item>

          <Form.Item label="Profile Image">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EditDriver;
