import React, { useEffect } from "react";
import { Modal, Spin, Empty, Tag, Divider, Avatar } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useUsersDriverList } from "../../../api/userApi";

function ViewDriverOrders({ record, isOpen, onClose }) {
  const { assignOrder, isLoading, isError, error, refetch } =
    useUsersDriverList({ userID: record?._id }, { enabled: isOpen });

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen]);

  const currentOrders = assignOrder?.currentOrders || [];
  const previousOrders = assignOrder?.previousOrders || [];

  const getStatusColor = (status) => {
    const colors = {
      "On Going": "processing",
      Delivered: "success",
      Cancelled: "error",
      Pending: "warning",
    };
    return colors[status] || "default";
  };

  const OrderCard = ({ order, isPrevious = false }) => (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src={order.user?.profile_image}
              size={48}
              className="border-2 border-white shadow-sm"
            >
              {order.user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">
                {order.user?.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <PhoneOutlined className="text-gray-400 text-xs" />
                <span className="text-xs text-gray-600">
                  {order.user?.phone}
                </span>
              </div>
            </div>
          </div>
          <Tag color={getStatusColor(order.status)} className="font-medium">
            {order.status}
          </Tag>
        </div>
      </div>

      {/* Order Details */}
      <div className="p-4 space-y-3">
        {/* Food Items */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShoppingOutlined className="text-blue-500" />
            <span className="font-medium text-gray-700 text-sm">
              Order Items
            </span>
          </div>
          <div className="space-y-2 ml-6">
            {order.food?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-2 bg-gray-50 rounded-md"
              >
                <img
                  src={item.food_image}
                  alt={item.food_name}
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {item.food_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.food_quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">
                      ${item.amount.toFixed(2)}
                    </span>
                  </div>
                  {item.food_ingredients?.length > 0 && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-500">
                        Ingredients:{" "}
                        {item.food_ingredients.map((i) => i.name).join(", ")}
                      </p>
                    </div>
                  )}
                  {item.extra_Ingredients?.length > 0 && (
                    <div className="mt-1">
                      <p className="text-xs text-green-600">
                        + Extra:{" "}
                        {item.extra_Ingredients.map((i) => i.name).join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Divider className="my-3" />

        {/* Delivery Address */}
        <div className="flex items-start gap-2">
          <EnvironmentOutlined className="text-red-500 mt-1 flex-shrink-0" />
          <div>
            <span className="font-medium text-gray-700 text-sm">
              Delivery Address
            </span>
            <p className="text-sm text-gray-600 mt-1">
              {order.delivery_address}
            </p>
          </div>
        </div>

        <Divider className="my-3" />

        {/* Price Breakdown */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Food Cost:</span>
            <span className="font-medium text-gray-800">
              ${order.food_cost.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Delivery Fee:</span>
            <span className="font-medium text-gray-800">
              ${order.delivery_fee.toFixed(2)}
            </span>
          </div>
          <Divider className="my-2" />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">Total:</span>
            <span className="font-bold text-blue-600 text-lg">
              ${order.total_price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-blue-200">
            <span className="text-xs text-gray-600">Payment Method:</span>
            <Tag color="gold" className="font-medium">
              {order.paid_status}
            </Tag>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <div className="flex items-center gap-1">
            <ClockCircleOutlined />
            <span>Order ID: {order._id.slice(-8)}</span>
          </div>
          <span>{new Date(order.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      title={false}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={900}
      className="driver-orders-modal"
    >
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 -m-6 mb-6 p-6 text-white">
        <div className="flex items-center gap-4">
          <Avatar
            src={record?.profile_image}
            size={64}
            className="border-4 border-white shadow-lg"
          >
            {record?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold mb-1">{record?.name}'s Orders</h2>
            <div className="flex items-center gap-4 text-blue-100 text-sm">
              <span className="flex items-center gap-1">
                <PhoneOutlined /> {record?.phone}
              </span>
              <span className="flex items-center gap-1">
                <MailOutlined /> {record?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[600px] overflow-y-auto px-1">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" tip="Loading orders..." />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Orders */}
            {currentOrders.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ClockCircleOutlined className="text-blue-500 text-lg" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Current Orders ({currentOrders.length})
                  </h3>
                </div>
                <div className="grid gap-4">
                  {currentOrders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              </div>
            )}

            {/* Previous Orders */}
            {previousOrders.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 mt-8">
                  <CheckCircleOutlined className="text-green-500 text-lg" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Previous Orders ({previousOrders.length})
                  </h3>
                </div>
                <div className="grid gap-4">
                  {previousOrders.map((order) => (
                    <OrderCard key={order._id} order={order} isPrevious />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {currentOrders.length === 0 &&
              previousOrders.length === 0 &&
              !isLoading && (
                <Empty
                  description="No orders found for this driver"
                  className="py-20"
                />
              )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ViewDriverOrders;
