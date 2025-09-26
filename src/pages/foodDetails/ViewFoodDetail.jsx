import React, { useState } from "react";
import { Modal, Tag, Image, List, Divider, Typography, Badge } from "antd";
import {
  EyeOutlined,
  DollarOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  FireOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function ViewFoodDetail({ record }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const profit = record.price - record.cost_on_me;

  return (
    <>
      <EyeOutlined
        className="text-blue-500 hover:text-blue-700 cursor-pointer text-xl"
        onClick={showModal}
      />

      <Modal
        title={
          <div className="flex items-center gap-2">
            <ShoppingOutlined className="text-green-500" />
            <span>{record.food_name} - Details</span>
            <Badge
              status={record.status === "Active" ? "success" : "error"}
              text={record.status}
              className="ml-2"
            />
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        {/* Images */}
        {record.images && record.images.length > 0 && (
          <>
            <div>
              <Title level={5}>Product Images</Title>
              <div className="flex gap-2 overflow-x-auto py-2">
                {record.images.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    width={80}
                    height={80}
                    className="rounded border"
                    preview={{
                      mask: <EyeOutlined />,
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Text strong>Price: </Text>
              <Tag color="green" className="ml-1">
                <DollarOutlined /> {record.price}
              </Tag>
            </div>
            <div>
              <Text strong>Cost: </Text>
              <Tag color="red" className="ml-1">
                <DollarOutlined /> {record.cost_on_me}
              </Tag>
            </div>
            <div>
              <Text strong>Profit: </Text>
              <Tag color="blue" className="ml-1">
                <DollarOutlined /> {profit}
              </Tag>
            </div>
            <div>
              <Text strong>Stock: </Text>
              <Tag color={record.quantity > 5 ? "green" : "orange"}>
                {record.quantity} units
              </Tag>
            </div>
            <div>
              <Text strong>Cooking Time: </Text>
              <Tag icon={<ClockCircleOutlined />}>{record.cookign_time}</Tag>
            </div>
            <div>
              <Text strong>Calories: </Text>
              <Tag icon={<FireOutlined />}>{record.calories}</Tag>
            </div>
          </div>

          {/* Description */}
          <div>
            <Text strong>Description: </Text>
            <Text className="ml-2">{record.description}</Text>
          </div>

          <Divider />

          {/* Main Ingredients */}
          <div>
            <Title level={5}>Main Ingredients</Title>
            <List
              size="small"
              dataSource={record.ingredients}
              renderItem={(item) => (
                <List.Item>
                  <Text>{item.name}</Text>
                  <Text type="secondary">${item.price}</Text>
                </List.Item>
              )}
            />
          </div>

          {/* Extra Ingredients */}
          <div>
            <Title level={5}>Extra Ingredients</Title>
            <List
              size="small"
              dataSource={record.extra_ingredients}
              renderItem={(item) => (
                <List.Item>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                      <Image
                        src={item.ingredient_image}
                        width={30}
                        height={30}
                        className="rounded"
                        preview={false}
                      />
                      <Text>{item.ingredient_name}</Text>
                      {item.status === "Active" ? (
                        <CheckCircleOutlined className="text-green-500" />
                      ) : (
                        <CloseCircleOutlined className="text-red-500" />
                      )}
                    </div>
                    <div className="text-right">
                      <Text strong>${item.price}</Text>
                      <br />
                      <Text type="secondary" size="small">
                        Stock: {item.quentity}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ViewFoodDetail;
