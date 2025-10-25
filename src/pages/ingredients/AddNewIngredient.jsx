import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  InputNumber,
  Radio,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";

const AddNewIngredient = ({ refetch }) => {
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

    formData.append("ingredient_name", data.ingredient_name);
    formData.append("price", data.price);
    formData.append("cost_on_me", data.cost_on_me);
    formData.append("quentity", data.quantity);
    formData.append("allow_backorder", true);

    if (data.ingredient_image && data.ingredient_image[0]) {
      formData.append(
        "ingredient_image",
        data.ingredient_image[0].originFileObj
      );
    }

    try {
      const response = await API.post("/food-ingredient/create", formData);
      message.success("Ingredient added successfully!");
      refetch();
      handleCancel(); // Close the modal on success
    } catch (error) {
      console.log(error, "error");
      message.error(
        error?.response?.data?.message || "Failed to add ingredient. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={showModal} type="primary" className="my-main-button">
        + Create New Ingredient
      </Button>

      <Modal
        title="Create New Ingredient"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Custom footer to use form submit
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Ingredient Name */}
          <Form.Item label="Ingredient Name">
            <Controller
              name="ingredient_name"
              rules={{ required: "Ingredient name is required" }}
              control={control}
              render={({ field }) => (
                <Input placeholder="Ingredient Name..." {...field} />
              )}
            />
          </Form.Item>

          {/* Price */}
          <Form.Item label="Price">
            <Controller
              name="price"
              rules={{ required: "Price is required" }}
              control={control}
              render={({ field }) => (
                <InputNumber
                  className="w-full"
                  placeholder="Price..."
                  {...field}
                />
              )}
            />
          </Form.Item>

          {/* Cost on Me */}
          <Form.Item label="Cost on Me">
            <Controller
              name="cost_on_me"
              rules={{ required: "Cost on Me is required" }}
              control={control}
              render={({ field }) => (
                <InputNumber
                  className="w-full"
                  placeholder="Cost on Me..."
                  {...field}
                />
              )}
            />
          </Form.Item>

          {/* Quantity */}
          <Form.Item label="Quantity">
            <Controller
              name="quantity"
              rules={{ required: "Quantity is required" }}
              control={control}
              render={({ field }) => (
                <InputNumber
                  className="w-full"
                  placeholder="Quantity..."
                  {...field}
                />
              )}
            />
          </Form.Item>

          {/* Allow purchese when out of stock redio button */}
          <Form.Item label="Allow purchese when out of stock">
            <Form.Item>
              <Controller
                name="allow_backorder"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Radio.Group
                    onChange={onChange}
                    defaultValue={true}
                    value={value}
                  >
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                )}
              />
            </Form.Item>
          </Form.Item>

          {/* Ingredient Image */}
          <Form.Item label="Ingredient Image">
            <Controller
              name="ingredient_image"
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
export default AddNewIngredient;
