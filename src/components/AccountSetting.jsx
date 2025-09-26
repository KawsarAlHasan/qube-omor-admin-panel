import React, { useState } from "react";
import { UserOutlined, CameraOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Avatar,
  Upload,
  Space,
} from "antd";
// import { API } from "../api/api";

const AccountSetting = ({ adminProfile }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // নতুন সিলেক্ট করা ইমেজ স্টোর করার স্টেট
  const [imageFile, setImageFile] = useState(null); // আসল ফাইল স্টোর করার জন্য

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setSelectedImage(null); // মোডাল বন্ধ করলে সিলেক্ট করা ইমেজ রিসেট
    setImageFile(null);
    setIsModalOpen(false);
  };

  // ইমেজ সিলেক্ট হ্যান্ডলার
  const handleImageSelect = (file) => {
    setImageFile(file);

    // ফাইল থেকে URL তৈরি করে প্রিভিউ দেখানোর জন্য
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };
    reader.readAsDataURL(file);

    return false; // অটো আপলোড বন্ধ করতে
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      // FormData তৈরি করা
      const formData = new FormData();
      formData.append("full_name", values.name);
      formData.append("email", values.email);
      formData.append("phone_number", values.phone_number);

      // যদি নতুন ইমেজ সিলেক্ট করা থাকে তাহলে append করা
      if (imageFile) {
        formData.append("profile", imageFile);
      }

      // API কল
      // await API.put(`/profile/update/`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      message.success("Profile updated successfully!");
      // refetch(); // প্রোফাইল ডেটা রিফ্রেশ করতে হবে

      // স্টেট রিসেট
      setSelectedImage(null);
      setImageFile(null);
      setIsModalOpen(false);
    } catch (err) {
      message.error(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return false;
    }
    return true;
  };

  return (
    <>
      <div
        onClick={showModal}
        className="flex items-center gap-2 px-1 py-2 cursor-pointer"
      >
        <UserOutlined />
        <span>Profile</span>
      </div>

      <Modal
        title="Update Profile"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <Avatar
              size={100}
              src={selectedImage || adminProfile?.profile}
              icon={<UserOutlined />}
              className="border-2 border-gray-200"
            />

            <Upload
              name="avatar"
              showUploadList={false}
              beforeUpload={beforeUpload}
              accept="image/jpeg,image/png"
              customRequest={({ file, onSuccess }) => {
                onSuccess("ok");
              }}
              onChange={(info) => {
                if (info.file.status === "done") {
                  handleImageSelect(info.file.originFileObj);
                }
              }}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<CameraOutlined />}
                size="small"
                className="absolute -bottom-1 -right-1 shadow-md"
                style={{ backgroundColor: "#1890ff" }}
              />
            </Upload>
          </div>

          {selectedImage && (
            <p className="text-green-600 text-sm mb-2">
              New image selected. Click "Update Profile" to save changes.
            </p>
          )}
        </div>

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
            <Input prefix={<UserOutlined />} />
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
            <Button
              className="my-main-button"
              block
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AccountSetting;