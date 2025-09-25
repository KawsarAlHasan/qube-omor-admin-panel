import React, { useState } from "react";
import {
  DeleteFilled,
  EditOutlined,
  EyeOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Modal,
  Tag,
  Divider,
  Descriptions,
  Image,
  Avatar,
  Card,
  Row,
  Col,
} from "antd";

const FoodOrderDetails = ({ record, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "On Going":
        return "blue";
      case "Cancelled":
        return "red";
      case "Delivered":
        return "green";
      default:
        return "default";
    }
  };

  // Paid status color mapping
  const getPaidStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "green";
      case "Online Pay":
        return "blue";
      case "COD":
        return "red";
      default:
        return "default";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <EyeOutlined
        onClick={showModal}
        className="text-blue-500 hover:text-blue-700 text-[25px] cursor-pointer transition-colors duration-200"
        title="View Details"
      />

      <Modal
        title={
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-gray-800">
              Food Order Details
            </span>
            <Tag
              color={getStatusColor(record?.status)}
              className="text-sm font-medium mr-6 px-3 py-1"
            >
              {record?.status}
            </Tag>
          </div>
        }
        width={1000}
        closable={true}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="close"
            onClick={handleCancel}
            className="bg-gray-100 hover:bg-gray-200"
          >
            Close
          </Button>,
        ]}
      >
        {record && (
          <div className="space-y-6">
            {/* Customer Information */}
            <Card
              title="Customer Information"
              size="small"
              className="shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <Avatar
                  src={record.user?.profile}
                  size={64}
                  className="border-2 border-gray-200"
                >
                  {record.user?.name?.charAt(0)}
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {record.user?.name}
                  </h3>
                  <p className="text-gray-600">{record.user?.email}</p>
                  <p className="text-gray-500 text-sm">
                    {record.contact_number}
                  </p>
                </div>
              </div>

              <Divider className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Delivery Address
                  </h4>
                  <p className="text-gray-600 bg-gray-50 p-2 rounded">
                    {record.delivery_address}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Order Date</h4>
                  <p className="text-gray-600">{formatDate(record.date)}</p>
                </div>
              </div>
            </Card>

            {/* Order Items */}
            <Card title="Order Items" size="small" className="shadow-sm">
              <div className="space-y-4">
                {record.food?.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <Image
                      width={80}
                      height={80}
                      src={item.image}
                      alt={item.name}
                      className="rounded-md object-cover"
                      preview={false}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {item.name}
                      </h4>
                      <p className="text-gray-600 text-sm">{item.category}</p>
                      <p className="text-gray-500 text-xs line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        ${item.price}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-medium text-green-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Order Summary */}
            <Card title="Order Summary" size="small" className="shadow-sm">
              <Row gutter={[16, 16]} className="text-gray-700">
                <Col span={12}>
                  <div className="flex justify-between py-2 border-b">
                    <span>Food Cost:</span>
                    <span className="font-medium">${record.food_cost}</span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex justify-between py-2 border-b">
                    <span>Total Quantity:</span>
                    <span className="font-medium">
                      {record.total_quantity} items
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex justify-between py-2 border-b">
                    <span>Delivery Fee:</span>
                    <span className="font-medium">${record?.delivery_fee}</span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex justify-between py-2 border-b">
                    <span>Coupon Discount:</span>
                    <span className="font-medium">
                      -${record?.coupon_discount}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex justify-between py-2 border-b">
                    <span>Order Status:</span>
                    <Tag color={getStatusColor(record.status)}>
                      {record.status}
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex justify-between py-2 border-b">
                    <span>Payment Status:</span>
                    <Tag color={getPaidStatusColor(record.paid_status)}>
                      {record.paid_status}
                    </Tag>
                  </div>
                </Col>

                <Col span={24}>
                  <div className="flex justify-between py-2 bg-blue-50 px-3 rounded mt-2">
                    <span className="font-semibold text-lg">Total Amount:</span>
                    <span className="font-bold text-lg text-blue-600">
                      ${record.total_price}
                    </span>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Driver Information */}
            {record.driver ? (
              <Card
                title="Driver Information"
                size="small"
                className="shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <Avatar size={48} src={record.driver.profile} />
                  <div className="mt-3">
                    <h4 className="font-semibold text-gray-800">
                      {record.driver.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {record.driver.email}
                    </p>
                  </div>
                </div>
                {/* <p className="text-gray-600 mt-2">Driver ID: {record.driver._id}</p> */}
                <p className="text-gray-600 mt-2">
                  Driver phone: {record.driver.phone}
                </p>
              </Card>
            ) : (
              <Card
                title="Driver Information"
                size="small"
                className="shadow-sm"
              >
                Not Assigned
              </Card>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default FoodOrderDetails;
