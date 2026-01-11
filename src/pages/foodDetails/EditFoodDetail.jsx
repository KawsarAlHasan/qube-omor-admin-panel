import React, { useState, useEffect } from "react";
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
  Radio,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useIngredients, useAllCategory } from "../../api/foodApi";
import { API } from "../../api/api";

const { TextArea } = Input;
const { Option } = Select;

function EditFoodDetail({ record, refetch }) {
  const { ingredients = [], isLoading: isLoadingIngredients } = useIngredients({
    status: "Active",
  });

  const { mockCategory = [], isLoading: isLoadingCategory } = useAllCategory({
    status: "Active",
  });

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedExtraIngredients, setSelectedExtraIngredients] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
    initializeFormData();
  };

  const initializeFormData = () => {
    if (!record) return;

    // Set form values
    form.setFieldsValue({
      food_name: record.food_name,
      food_category: record.food_category,
      food_description: record.food_description,
      quentity: record.quentity,
      food_price: record.food_price,
      cost_on_me: record.cost_on_me,
      colories: record.colories,
      cook_time: record.cook_time,
      allow_backorder: record.allow_backorder,
    });

    // Set existing images
    if (record.food_images && record.food_images.length > 0) {
      setExistingImages(record.food_images);
    }

    // Set uploaded images to empty (for new uploads)
    setUploadedImages([]);
  };

  // Initialize ingredients when modal opens and ingredients are loaded
  useEffect(() => {
    if (isModalOpen && ingredients.length > 0 && record) {
      // Set main ingredients - Add uniqueKey for each item
      if (record.food_ingredients && record.food_ingredients.length > 0) {
        const mainIngs = record.food_ingredients
          .map((ingId) => {
            const ingredient = ingredients.find((ing) => ing._id === ingId);
            if (ingredient) {
              return {
                id: ingredient._id,
                name: ingredient.ingredient_name,
                price: ingredient.price,
                uniqueKey: `${ingredient._id}_${Date.now()}_${Math.random()}`, // Unique key
              };
            }
            return null;
          })
          .filter(Boolean);
        setSelectedIngredients(mainIngs);
      }

      // Set extra ingredients - Add uniqueKey for each item
      if (record.extra_ingredients && record.extra_ingredients.length > 0) {
        const extraIngs = record.extra_ingredients
          .map((ingId) => {
            const ingredient = ingredients.find((ing) => ing._id === ingId);
            if (ingredient) {
              return {
                id: ingredient._id,
                name: ingredient.ingredient_name,
                price: ingredient.price,
                uniqueKey: `${ingredient._id}_${Date.now()}_${Math.random()}`, // Unique key
              };
            }
            return null;
          })
          .filter(Boolean);
        setSelectedExtraIngredients(extraIngs);
      }
    }
  }, [isModalOpen, ingredients, record]);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedIngredients([]);
    setSelectedExtraIngredients([]);
    setUploadedImages([]);
    setExistingImages([]);
  };

  // 🧩 Ingredient add - ✅ একাধিকবার যোগ করা যাবে (AddFoodDetail এর মতো)
  const addIngredient = (ingredientId, type) => {
    const ingredient = ingredients.find((ing) => ing._id === ingredientId);
    if (!ingredient) return;

    const newIngredient = {
      id: ingredient._id,
      name: ingredient.ingredient_name,
      price: ingredient.price,
      uniqueKey: Date.now() + Math.random(), // Unique key for each addition
    };

    if (type === "main") {
      setSelectedIngredients((prev) => [...prev, newIngredient]);
    } else {
      setSelectedExtraIngredients((prev) => [...prev, newIngredient]);
    }
  };

  // 🧩 Ingredient remove - uniqueKey দ্বারা রিমুভ করা হবে
  const removeIngredient = (uniqueKey, type) => {
    if (type === "main") {
      setSelectedIngredients((prev) =>
        prev.filter((ing) => ing.uniqueKey !== uniqueKey)
      );
    } else {
      setSelectedExtraIngredients((prev) =>
        prev.filter((ing) => ing.uniqueKey !== uniqueKey)
      );
    }
  };

  // 🖼️ Remove existing image
  const removeExistingImage = (imageUrl) => {
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  // 🖼️ Image upload handler
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
      formData.append("allow_backorder", values.allow_backorder);

      formData.append(
        "food_ingredients",
        JSON.stringify(selectedIngredients.map((ing) => ing.id))
      );
      formData.append(
        "extra_ingredients",
        JSON.stringify(selectedExtraIngredients.map((ing) => ing.id))
      );

      // Send existing images that weren't removed
      formData.append("existing_images", JSON.stringify(existingImages));

      // Append new uploaded images
      if (uploadedImages && uploadedImages.length > 0) {
        uploadedImages.forEach((file) => {
          if (file.originFileObj) {
            formData.append("food_images", file.originFileObj);
          }
        });
      }

      const response = await API.put(`/food/update/${record._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("✅ Food updated successfully!");
      handleCancel();
      refetch();
    } catch (error) {
      console.error("❌ Update Failed:", error);
      message.error(error?.response?.data?.message || "Failed to update food.");
    } finally {
      setLoading(false);
    }
  };

  if (!record) return null;

  return (
    <div>
      <EditOutlined
        className="text-blue-500 text-xl cursor-pointer"
        onClick={showModal}
      />

      <Modal
        title={`Edit Food: ${record.food_name}`}
        open={isModalOpen}
        onCancel={handleCancel}
        width={900}
        style={{ top: 20 }}
        footer={null}
        destroyOnClose
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

          <div className="grid grid-cols-3 gap-4">
            {/* Allow purchase when out of stock radio button */}
            <Form.Item
              label="Allow purchase when out of stock"
              name="allow_backorder"
            >
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Calories" name="colories">
              <Input placeholder="e.g., 100 calories" />
            </Form.Item>

            <Form.Item label="Cooking Time" name="cook_time">
              <Input placeholder="e.g., 10 minutes" />
            </Form.Item>
          </div>

          {/* 🧂 Main Ingredients - ✅ একাধিকবার যোগ করা যাবে */}
          <Divider orientation="left">Main Ingredients</Divider>

          <Form.Item>
            <Select
              placeholder="Select main ingredients"
              onChange={(value) => {
                addIngredient(value, "main");
              }}
              allowClear
              loading={isLoadingIngredients}
              value={null} // ✅ প্রতিবার সিলেক্ট করার পর reset হবে
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
              key={ing.uniqueKey} // ✅ uniqueKey ব্যবহার করছি
              className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2"
            >
              <span>
                {ing.name} - ${ing.price}
              </span>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeIngredient(ing.uniqueKey, "main")}
              />
            </div>
          ))}

          {/* 🧁 Extra Ingredients - ✅ একাধিকবার যোগ করা যাবে */}
          <Divider orientation="left">Extra Ingredients</Divider>

          <Form.Item>
            <Select
              placeholder="Select extra ingredients"
              onChange={(value) => {
                addIngredient(value, "extra");
              }}
              allowClear
              loading={isLoadingIngredients}
              value={null} // ✅ প্রতিবার সিলেক্ট করার পর reset হবে
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
              key={ing.uniqueKey} // ✅ uniqueKey ব্যবহার করছি
              className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2"
            >
              <span>
                {ing.name} - ${ing.price}
              </span>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeIngredient(ing.uniqueKey, "extra")}
              />
            </div>
          ))}

          {/* 📸 Existing Food Images */}
          <Divider orientation="left">Existing Images</Divider>

          {existingImages.length > 0 ? (
            <div className="flex flex-wrap gap-3 mb-4">
              {existingImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative group border rounded-lg overflow-hidden"
                  style={{ width: 100, height: 100 }}
                >
                  <img
                    src={imageUrl}
                    alt={`Food ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="text"
                      danger
                      icon={
                        <DeleteOutlined
                          style={{ color: "white", fontSize: 18 }}
                        />
                      }
                      onClick={() => removeExistingImage(imageUrl)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mb-4">No existing images</p>
          )}

          {/* 📸 Upload New Images */}
          <Divider orientation="left">Upload New Images</Divider>
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
            {loading ? "Updating..." : "Update Food"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default EditFoodDetail;
