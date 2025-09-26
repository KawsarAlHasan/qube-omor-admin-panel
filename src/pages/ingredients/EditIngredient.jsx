import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Typography,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
// import { API } from "../../api/api";

const { Title } = Typography;

function EditIngredient({ ingredientDetails, isOpen, onClose, refetch }) {
  const { control, register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    // Reset form fields when ingredientDetails changes
    if (ingredientDetails) {
      reset({
        ingredient_name: ingredientDetails.ingredient_name || "",
        price: ingredientDetails.price || 0,
        cost_on_me: ingredientDetails.cost_on_me || 0,
      });
    }
  }, [ingredientDetails, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData(); // Handle file uploads

    formData.append("ingredient_name", data.ingredient_name);
    formData.append("price", data.price);
    formData.append("cost_on_me", data.cost_on_me);
    formData.append("quentity", data.quentity);

    if (data.image && data.image[0]) {
      formData.append("ingredient_image", data.image[0].originFileObj);
    }

    try {
      //   const response = await API.put(
      //     `/ingredient/update/${ingredientDetails?.id}`,
      //     formData
      //   ); // Updated endpoint

      //   if (response.status === 200) {
      //     message.success(`${data.name} updated successfully!`);
      //   }
      message.success(`${data.ingredient_name} updated successfully!`);

      refetch();
      onClose(); // Close modal on success
    } catch (error) {
      message.error(`Failed to add ${data.ingredient_name}. Try again.`);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Title level={3}>
          {ingredientDetails?.ingredient_name} Edit - Ingredient
        </Title>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Image Upload */}
        <Form.Item label="Upload Image">
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, value } }) => {
              const initialFileList = ingredientDetails?.ingredient_image
                ? [
                    {
                      uid: "-1",
                      name: "Current Image",
                      status: "done",
                      url: ingredientDetails?.ingredient_image,
                    },
                  ]
                : [];

              return (
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false} // Prevent auto-upload
                  maxCount={1}
                  accept="image/*"
                  fileList={value || initialFileList}
                  onChange={({ fileList }) => {
                    if (fileList[0]?.originFileObj) {
                      onChange(fileList); // Update only when a new image is added
                    } else if (fileList.length === 0) {
                      onChange([]); // Clear image if removed
                    }
                  }}
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
              );
            }}
          />
        </Form.Item>

        {/* Ingredient Name */}
        <Form.Item label="Ingredient Name">
          <Controller
            name="ingredient_name"
            defaultValue={ingredientDetails?.ingredient_name}
            control={control}
            rules={{ required: "Ingredient name is required" }}
            render={({ field }) => (
              <Input placeholder="Enter Ingredient name..." {...field} />
            )}
          />
        </Form.Item>

        {/* Price */}
        <Form.Item label="Price">
          <Controller
            name="price"
            defaultValue={ingredientDetails?.price}
            control={control}
            rules={{ required: "Price is required" }}
            render={({ field }) => (
              <InputNumber className="w-full" placeholder="Enter Price..." {...field} />
            )}
          />
        </Form.Item>

        {/* Cost on Me */}
        <Form.Item label="Cost on Me">
          <Controller
            name="cost_on_me"
            defaultValue={ingredientDetails?.cost_on_me}
            control={control}
            rules={{ required: "Cost on Me is required" }}
            render={({ field }) => (
              <InputNumber className="w-full" placeholder="Enter Cost on Me..." {...field} />
            )}
          />
        </Form.Item>

        {/* Quentity */}
        <Form.Item label="Quentity">
          <Controller
            name="quentity"
            defaultValue={ingredientDetails?.quentity}
            control={control}
            rules={{ required: "Quentity is required" }}
            render={({ field }) => (
              <InputNumber className="w-full" placeholder="Enter Quentity..." {...field} />
            )}
          />
        </Form.Item>



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
  );
}

export default EditIngredient;
