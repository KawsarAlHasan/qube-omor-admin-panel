import React, { useState, useMemo } from "react";
import {
  Modal,
  Tag,
  Image,
  Divider,
  Typography,
  Badge,
  Spin,
  Carousel,
  Descriptions,
  Space,
  Card,
  Tooltip,
} from "antd";
import {
  EyeOutlined,
  DollarOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  FireOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  AppstoreOutlined,
  InboxOutlined,
  TagOutlined,
  PlusCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useAllCategory, useIngredients } from "../../api/foodApi";

const { Title, Text } = Typography;

function ViewFoodDetail({ record }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { ingredients = [], isLoading: isLoadingIngredients } = useIngredients(
    { status: "all" },
    { enabled: isModalVisible }
  );

  const { mockCategory = [], isLoading: isLoadingCategory } = useAllCategory(
    { status: "all" },
    { enabled: isModalVisible }
  );

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  // Get category name
  const categoryName = useMemo(() => {
    if (record?.category?.category_name) return record.category.category_name;
    const found = mockCategory.find((c) => c._id === record?.food_category);
    return found?.category_name || "N/A";
  }, [record, mockCategory]);

  // Map ingredient IDs to names
  const foodIngredientsList = useMemo(() => {
    if (!record?.food_ingredients || !ingredients.length) return [];
    return record.food_ingredients
      .map((id) => ingredients.find((ing) => ing._id === id))
      .filter(Boolean);
  }, [record?.food_ingredients, ingredients]);

  const extraIngredientsList = useMemo(() => {
    if (!record?.extra_ingredients || !ingredients.length) return [];
    return record.extra_ingredients
      .map((id) => ingredients.find((ing) => ing._id === id))
      .filter(Boolean);
  }, [record?.extra_ingredients, ingredients]);

  const isLoading = isLoadingIngredients || isLoadingCategory;

  // Calculate profit
  const profit = (record?.food_price || 0) - (record?.cost_on_me || 0);
  const profitPercentage = record?.cost_on_me
    ? ((profit / record.cost_on_me) * 100).toFixed(1)
    : 0;

  return (
    <>
      <Tooltip title="View Details">
        <EyeOutlined
          className="text-blue-500 hover:text-blue-700 cursor-pointer text-xl transition-colors duration-200"
          onClick={showModal}
        />
      </Tooltip>

      <Modal
        title={
          <div className="flex items-center gap-3">
            <ShoppingOutlined className="text-green-500 text-xl" />
            <span className="text-lg font-semibold">{record?.food_name}</span>
            <Tag
              color={record?.food_status === "Active" ? "success" : "error"}
              icon={
                record?.food_status === "Active" ? (
                  <CheckCircleOutlined />
                ) : (
                  <CloseCircleOutlined />
                )
              }
            >
              {record?.food_status}
            </Tag>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
        bodyStyle={{ maxHeight: "75vh", overflowY: "auto" }}
      >
        <Spin spinning={isLoading}>
          {/* Image Carousel */}
          {record?.food_images?.length > 0 && (
            <div className="mb-6">
              <Carousel autoplay dots={{ className: "custom-dots" }}>
                {record.food_images.map((img, index) => (
                  <div key={index}>
                    <div className="flex justify-center bg-gray-100 rounded-lg p-2">
                      <Image
                        src={img}
                        alt={`${record.food_name} - ${index + 1}`}
                        style={{
                          maxHeight: "300px",
                          objectFit: "contain",
                          borderRadius: "8px",
                        }}
                        fallback="https://via.placeholder.com/400x300?text=No+Image"
                      />
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          )}

          {/* Basic Info */}
          <Descriptions
            bordered
            size="small"
            column={{ xs: 1, sm: 2, md: 2 }}
            className="mb-4"
          >
            <Descriptions.Item
              label={
                <Space>
                  <AppstoreOutlined className="text-purple-500" />
                  Category
                </Space>
              }
            >
              <Tag color="purple">{categoryName}</Tag>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <InboxOutlined className="text-blue-500" />
                  Quantity in Stock
                </Space>
              }
            >
              <Tag color={record?.quentity > 50 ? "green" : "orange"}>
                {record?.quentity || 0} units
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <ClockCircleOutlined className="text-orange-500" />
                  Cook Time
                </Space>
              }
            >
              {record?.cook_time || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <FireOutlined className="text-red-500" />
                  Calories
                </Space>
              }
            >
              <Tag color="volcano">{record?.colories || "N/A"}</Tag>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <InfoCircleOutlined className="text-cyan-500" />
                  Allow Backorder
                </Space>
              }
            >
              {record?.allow_backorder ? (
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  Yes
                </Tag>
              ) : (
                <Tag color="error" icon={<CloseCircleOutlined />}>
                  No
                </Tag>
              )}
            </Descriptions.Item>
          </Descriptions>

          {/* Pricing Section */}
          <Card
            size="small"
            title={
              <Space>
                <DollarOutlined className="text-green-600" />
                <span>Pricing Information</span>
              </Space>
            }
            className="mb-4"
          >
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded-lg">
                <Text type="secondary" className="block text-xs">
                  Selling Price
                </Text>
                <Text strong className="text-xl text-green-600">
                  ${record?.food_price?.toFixed(2) || "0.00"}
                </Text>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <Text type="secondary" className="block text-xs">
                  Cost Price
                </Text>
                <Text strong className="text-xl text-red-500">
                  ${record?.cost_on_me?.toFixed(2) || "0.00"}
                </Text>
              </div>
              {/* <div className="bg-blue-50 p-3 rounded-lg">
                <Text type="secondary" className="block text-xs">
                  Profit
                </Text>
                <Text strong className="text-xl text-blue-600">
                  ${profit.toFixed(2)}{" "}
                  <span className="text-sm">({profitPercentage}%)</span>
                </Text>
              </div> */}
            </div>
          </Card>

          {/* Description */}
          {record?.food_description && (
            <Card size="small" className="mb-4">
              <Text type="secondary" className="block mb-1">
                Description
              </Text>
              <Text>{record.food_description}</Text>
            </Card>
          )}

          {/* Ingredients Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Ingredients */}
            <Card
              size="small"
              title={
                <Space>
                  <TagOutlined className="text-blue-500" />
                  <span>Main Ingredients</span>
                </Space>
              }
            >
              {foodIngredientsList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {foodIngredientsList.map((ing) => (
                    <Tooltip
                      key={ing._id}
                      title={`Price: $${ing.price} | Cost: $${ing.cost_on_me}`}
                    >
                      <Tag color="blue" className="m-0">
                        {ing.ingredient_name}
                      </Tag>
                    </Tooltip>
                  ))}
                </div>
              ) : (
                <Text type="secondary">No main ingredients</Text>
              )}
            </Card>

            {/* Extra Ingredients */}
            <Card
              size="small"
              title={
                <Space>
                  <PlusCircleOutlined className="text-green-500" />
                  <span>Extra Ingredients (Add-ons)</span>
                </Space>
              }
            >
              {extraIngredientsList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {extraIngredientsList.map((ing) => (
                    <Tooltip
                      key={ing._id}
                      title={`Price: $${ing.price} | Cost: $${ing.cost_on_me}`}
                    >
                      <Tag color="green" className="m-0">
                        {ing.ingredient_name} (+${ing.price})
                      </Tag>
                    </Tooltip>
                  ))}
                </div>
              ) : (
                <Text type="secondary">No extra ingredients available</Text>
              )}
            </Card>
          </div>

          {/* Timestamps */}
          <Divider className="my-4" />
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              Created: {new Date(record?.createdAt).toLocaleDateString()}
            </span>
            <span>
              Last Updated: {new Date(record?.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </Spin>
      </Modal>
    </>
  );
}

export default ViewFoodDetail;