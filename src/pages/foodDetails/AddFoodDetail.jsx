import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Switch,
  Divider,
  message,
  Card,
  Image,
} from "antd";
import { UploadOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useMockCategory, useMockIngredients } from "../../api/foodApi";

const { TextArea } = Input;
const { Option } = Select;

function AddFoodDetail() {
  const { mockIngredients } = useMockIngredients();
  const { mockCategory } = useMockCategory();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedExtraIngredients, setSelectedExtraIngredients] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // ফর্ম ডেটা প্রস্তুত করা
      const foodData = {
        ...values,
        ingredients: selectedIngredients,
        extra_ingredients: selectedExtraIngredients,
        images: uploadedImages.map((img) => img.url),
        items: selectedIngredients, // items array হিসেবে same as ingredients
      };

      console.log("Food Data to be submitted:", foodData);

      // এখানে আপনার API call হবে
      // await addFoodAPI(foodData);

      message.success("Food added successfully!");
      handleCancel();
    } catch (error) {
      console.error("Submission Failed:", error);
      message.error("Failed to add food. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedIngredients([]);
    setSelectedExtraIngredients([]);
    setUploadedImages([]);
  };

  // ইঙ্গ্রেডিয়েন্ট যোগ করার ফাংশন
  const addIngredient = (ingredientId, type = "main") => {
    const ingredient = mockIngredients.find((ing) => ing._id === ingredientId);
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
      if (!selectedExtraIngredients.find((ing) => ing._id === ingredientId)) {
        setSelectedExtraIngredients((prev) => [
          ...prev,
          {
            ...ingredient,
            quentity: 1,
          },
        ]);
      }
    }
  };

  // ইঙ্গ্রেডিয়েন্ট সরানোর ফাংশন
  const removeIngredient = (ingredientId, type = "main") => {
    if (type === "main") {
      setSelectedIngredients((prev) =>
        prev.filter((ing) => ing.id !== ingredientId)
      );
    } else {
      setSelectedExtraIngredients((prev) =>
        prev.filter((ing) => ing._id !== ingredientId)
      );
    }
  };

  // ইমেজ আপলোড হ্যান্ডলার - মাল্টিপল ইমেজ সাপোর্ট
  const handleImageUpload = (info) => {
    let fileList = [...info.fileList];

    // শুধুমাত্র ইমেজ ফাইল allow করা
    fileList = fileList.filter((file) => {
      const isImage = file.type?.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
      }
      return isImage;
    });

    // File reader দিয়ে temporary URL তৈরি করা
    fileList = fileList.map((file) => {
      if (file.originFileObj) {
        file.url = URL.createObjectURL(file.originFileObj);
      }
      return file;
    });

    setUploadedImages(fileList);
  };

  // ইমেজ ডিলিট করার ফাংশন
  const removeImage = (uid) => {
    setUploadedImages((prev) => prev.filter((img) => img.uid !== uid));
  };

  // ইমেজ প্রিভিউ দেখানোর ফাংশন
  const previewImage = (url) => {
    Modal.info({
      title: "Image Preview",
      content: (
        <div className="text-center">
          <Image src={url} alt="Preview" style={{ maxWidth: "100%" }} />
        </div>
      ),
      icon: null,
      okText: "Close",
      width: 600,
    });
  };

  // ইমেজ আপলোডের প্রপস
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

      return false; // Prevent automatic upload
    },
    multiple: true,
    accept: "image/*",
    fileList: uploadedImages,
    onChange: handleImageUpload,
  };

  // সক্রিয় ক্যাটাগরি ফিল্টার
  const activeCategories = mockCategory.filter(
    (cat) => cat.status === "Active"
  );
  const activeIngredients = mockIngredients.filter(
    (ing) => ing.status === "Active"
  );

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
        footer={null} // Remove default footer
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
          onFinish={handleSubmit}
          scrollToFirstError
        >
          {/* Basic Information */}
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
              name="category"
              rules={[{ required: true, message: "Please select category!" }]}
            >
              <Select placeholder="Select category">
                {activeCategories.map((category) => (
                  <Option key={category._id} value={category.category_name}>
                    {category.category_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Enter food description" />
          </Form.Item>

          {/* Price & Quantity */}
          <Divider orientation="left">Price & Quantity</Divider>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: "Please input quantity!" }]}
            >
              <InputNumber min={0} className="w-full" placeholder="0" />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <InputNumber
                min={0}
                className="w-full"
                placeholder="0.00"
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              label="Cost on Me"
              name="cost_on_me"
              rules={[{ required: true, message: "Please input cost!" }]}
            >
              <InputNumber
                min={0}
                className="w-full"
                placeholder="0.00"
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </div>

          {/* Other Details */}
          <Divider orientation="left">Other Details</Divider>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Calories" name="calories">
              <Input placeholder="e.g., 100 calories" />
            </Form.Item>

            <Form.Item label="Cooking Time" name="cookign_time">
              <Input placeholder="e.g., 10 minutes" />
            </Form.Item>
          </div>

          {/* Main Ingredients */}
          <Divider orientation="left">Main Ingredients</Divider>

          <Form.Item>
            <Select
              placeholder="Select main ingredients"
              onChange={(value) => addIngredient(value, "main")}
              allowClear
            >
              {activeIngredients.map((ingredient) => (
                <Option key={ingredient._id} value={ingredient._id}>
                  {ingredient.ingredient_name} - ${ingredient.price}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="mb-4">
            {selectedIngredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2"
              >
                <span>
                  {ingredient.name} - ${ingredient.price}
                </span>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeIngredient(ingredient.id, "main")}
                />
              </div>
            ))}
          </div>

          {/* Extra Ingredients */}
          <Divider orientation="left">Extra Ingredients</Divider>

          <Form.Item>
            <Select
              placeholder="Select extra ingredients"
              onChange={(value) => addIngredient(value, "extra")}
              allowClear
            >
              {activeIngredients.map((ingredient) => (
                <Option key={ingredient._id} value={ingredient._id}>
                  {ingredient.ingredient_name} - ${ingredient.price}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="mb-4">
            {selectedExtraIngredients.map((ingredient) => (
              <div
                key={ingredient._id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2"
              >
                <span>
                  {ingredient.ingredient_name} - ${ingredient.price}
                </span>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeIngredient(ingredient._id, "extra")}
                />
              </div>
            ))}
          </div>

          {/* Food Images */}
          <Divider orientation="left">Food Images</Divider>

          <Form.Item>
            <Upload
              listType="picture"
              multiple
              maxCount={10}
              onChange={handleImageUpload}
              {...uploadProps}
            >
              <Button icon={<UploadOutlined />} className="mb-4">
                Upload Images (Max 10)
              </Button>
            </Upload>
          </Form.Item>

          {/* Submit Button */}
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
