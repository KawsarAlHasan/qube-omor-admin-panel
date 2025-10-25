import React, { useState } from "react";
import { Button, Modal, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";

const AddNewCategory = ({ refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  // Open Modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCancel = () => {
    setIsModalOpen(false);
    reset(); // Reset form fields
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData(); // Handle image uploads properly

    formData.append("category_name", data.category_name);

    if (data.category_image && data.category_image[0]) {
      formData.append("category_image", data.category_image[0].originFileObj);
    }

    try {
      const response = await API.post("/food-category/create", formData);
      message.success("Category added successfully!");
      refetch();
      handleCancel(); // Close the modal on success
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to add category. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={showModal} type="primary" className="my-main-button">
        + Create New Category
      </Button>

      <Modal
        title="Create New Category"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Custom footer to use form submit
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Category Name */}
          <Form.Item label="Category Name">
            <Controller
              name="category_name"
              rules={{ required: "Category name is required" }}
              control={control}
              render={({ field }) => (
                <Input placeholder="Category Name..." {...field} />
              )}
            />
          </Form.Item>

          {/* Category Image */}
          <Form.Item label="Category Image">
            <Controller
              name="category_image"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false} // Prevent auto-upload
                  maxCount={1}
                  accept="image/*"
                  fileList={value || []} // Sync file list with form state
                  onChange={({ fileList }) => onChange(fileList)}
                  onPreview={(file) => {
                    const src =
                      file.url || URL.createObjectURL(file.originFileObj);
                    const imgWindow = window.open(src);
                    imgWindow.document.write(
                      `<img src="${src}" style="width: 100%;" />`
                    );
                  }}
                >
                  {value && value.length >= 1 ? null : (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload Image</div>
                    </div>
                  )}
                </Upload>
              )}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              className="my-main-button"
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AddNewCategory;
