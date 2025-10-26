import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Divider,
  message,
  Image,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useIngredients, useMockCategory } from "../../api/foodApi";
import { API } from "../../api/api";

const { TextArea } = Input;
const { Option } = Select;

function AddFoodDetail({refetch}) {
  const { ingredients = [], isLoading: isLoadingIngredients } = useIngredients({
    status: "Active",
  });
  const { mockCategory = [], isLoading: isLoadingCategory } = useMockCategory({
    status: "Active",
  });

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedExtraIngredients, setSelectedExtraIngredients] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedIngredients([]);
    setSelectedExtraIngredients([]);
    setUploadedImages([]);
  };

  // 🧩 Ingredient যোগ করা
  const addIngredient = (ingredientId, type) => {
    const ingredient = ingredients.find((ing) => ing._id === ingredientId);
    if (!ingredient) return;

    if (type === "main") {
      if (!selectedIngredients.find((ing) => ing.id === ingredientId)) {
        setSelectedIngredients((prev) => [
          ...prev,
          {
            id: ingredient._id,
            name: ingredient.ingredient_name,
            price: ingredient.price,
          },
        ]);
      }
    } else {
      if (!selectedExtraIngredients.find((ing) => ing.id === ingredientId)) {
        setSelectedExtraIngredients((prev) => [
          ...prev,
          {
            id: ingredient._id,
            name: ingredient.ingredient_name,
            price: ingredient.price,
          },
        ]);
      }
    }
  };

  // 🧩 Ingredient সরানো
  const removeIngredient = (ingredientId, type) => {
    if (type === "main") {
      setSelectedIngredients((prev) => prev.filter((ing) => ing.id !== ingredientId));
    } else {
      setSelectedExtraIngredients((prev) => prev.filter((ing) => ing.id !== ingredientId));
    }
  };

  // 🖼️ ইমেজ হ্যান্ডলার
  const handleImageUpload = (info) => {
    let fileList = [...info.fileList];

    fileList = fileList.filter((file) => {
      const isImage = file.type?.startsWith("image/");
      if (!isImage) message.error("You can only upload image files!");
      return isImage;
    });

    fileList = fileList.map((file) => {
      if (file.originFileObj) {
        file.url = URL.createObjectURL(file.originFileObj);
      }
      return file;
    });

    setUploadedImages(fileList);
  };

  const uploadProps = {
    beforeUpload: (file) => {
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
      return false;
    },
    multiple: true,
    accept: "image/*",
    fileList: uploadedImages,
    onChange: handleImageUpload,
  };

  // 🧾 Submit Handler
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("food_name", values.food_name);
      formData.append("food_category", values.food_category);
      formData.append("food_description", values.food_description || "");
      formData.append("quentity", values.quentity);
      formData.append("food_price", values.food_price);
      formData.append("cost_on_me", values.cost_on_me);
      formData.append("colories", values.colories || "");
      formData.append("cook_time", values.cook_time || "");
      formData.append("allow_backorder", values.allow_backorder ?? true);

      formData.append("food_ingredients", JSON.stringify(selectedIngredients.map((ing) => ing.id)));
      formData.append(
        "extra_ingredients",
        JSON.stringify(selectedExtraIngredients.map((ing) => ing.id))
      );

      if (uploadedImages && uploadedImages.length > 0) {
        uploadedImages.forEach((file) => {
          if (file.originFileObj) {
            formData.append("food_images", file.originFileObj);
          }
        });
      }

      const response = await API.post("/food/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("✅ Food added successfully!");
      handleCancel();
      refetch();
      console.log("Food created:", response.data);
    } catch (error) {
      console.error("❌ Submission Failed:", error);
      message.error(error?.response?.data?.message || "Failed to add food.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={showModal} type="primary" className="my-main-button">
        + Add New Food
      </Button>

      <Modal
        title="Add New Food"
        open={isModalOpen}
        onCancel={handleCancel}
        width={900}
        style={{ top: 20 }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
          onFinish={handleSubmit}
          scrollToFirstError
        >
          {/* 🧾 Basic Information */}
          <Divider orientation="left">Basic Information</Divider>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Food Name"
              name="food_name"
              rules={[{ required: true, message: "Please input food name!" }]}
            >
              <Input placeholder="Enter food name" />
            </Form.Item>

            <Form.Item
              label="Category"
              name="food_category"
              rules={[{ required: true, message: "Please select category!" }]}
            >
              <Select placeholder="Select category" loading={isLoadingCategory}>
                {mockCategory.map((cat) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Description" name="food_description">
            <TextArea rows={3} placeholder="Enter food description" />
          </Form.Item>

          {/* 💰 Price & Quantity */}
          <Divider orientation="left">Price & Quantity</Divider>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              label="Quantity"
              name="quentity"
              rules={[{ required: true, message: "Please input quantity!" }]}
            >
              <InputNumber min={0} className="w-full" placeholder="0" />
            </Form.Item>

            <Form.Item
              label="Price"
              name="food_price"
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <InputNumber min={0} className="w-full" placeholder="0.00" />
            </Form.Item>

            <Form.Item
              label="Cost on Me"
              name="cost_on_me"
              rules={[{ required: true, message: "Please input cost!" }]}
            >
              <InputNumber min={0} className="w-full" placeholder="0.00" />
            </Form.Item>
          </div>

          {/* 🍳 Other Details */}
          <Divider orientation="left">Other Details</Divider>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Calories" name="colories">
              <Input placeholder="e.g., 100 calories" />
            </Form.Item>

            <Form.Item label="Cooking Time" name="cook_time">
              <Input placeholder="e.g., 10 minutes" />
            </Form.Item>
          </div>

          {/* 🧂 Main Ingredients */}
          <Divider orientation="left">Main Ingredients</Divider>

          <Form.Item>
            <Select
              placeholder="Select main ingredients"
              onChange={(value) => addIngredient(value, "main")}
              allowClear
              loading={isLoadingIngredients}
            >
              {ingredients.map((ing) => (
                <Option key={ing._id} value={ing._id}>
                  {ing.ingredient_name} - ${ing.price}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedIngredients.map((ing) => (
            <div
              key={ing.id}
              className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2"
            >
              <span>
                {ing.name} - ${ing.price}
              </span>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeIngredient(ing.id, "main")}
              />
            </div>
          ))}

          {/* 🧁 Extra Ingredients */}
          <Divider orientation="left">Extra Ingredients</Divider>

          <Form.Item>
            <Select
              placeholder="Select extra ingredients"
              onChange={(value) => addIngredient(value, "extra")}
              allowClear
            >
              {ingredients.map((ing) => (
                <Option key={ing._id} value={ing._id}>
                  {ing.ingredient_name} - ${ing.price}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedExtraIngredients.map((ing) => (
            <div
              key={ing.id}
              className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2"
            >
              <span>
                {ing.name} - ${ing.price}
              </span>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeIngredient(ing.id, "extra")}
              />
            </div>
          ))}

          {/* 📸 Food Images */}
          <Divider orientation="left">Food Images</Divider>
          <Form.Item>
            <Upload listType="picture" maxCount={10} {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload Images (Max 10)</Button>
            </Upload>
          </Form.Item>

          {/* 🚀 Submit */}
          <Divider />
          <Button
            block
            type="primary"
            htmlType="submit"
            loading={loading}
            className="my-main-button"
          >
            {loading ? "Submitting..." : "Submit Food"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default AddFoodDetail;
