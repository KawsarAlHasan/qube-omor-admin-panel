import React from "react";
import { Card, Tag, Empty, Avatar, Badge, Tooltip } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function LastOrdersCard({ ordersList, isLoading }) {
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "On Going":
        return <SyncOutlined spin style={{ color: "#faad14" }} />;
      case "Pending":
        return <ClockCircleOutlined style={{ color: "#1890ff" }} />;
      default:
        return null;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "On Going":
        return "processing";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  // Get payment badge color
  const getPaymentBadgeColor = (paymentStatus) => {
    return paymentStatus === "COD" ? "#faad14" : "#52c41a";
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${(amount || 0).toFixed(2)}`;
  };

  // Get last 10 orders sorted by date
  const lastOrders = React.useMemo(() => {
    if (!ordersList || ordersList.length === 0) return [];

    return [...ordersList]
      .sort(
        (a, b) =>
          new Date(b.order_date || b.createdAt) -
          new Date(a.order_date || a.createdAt)
      )
      .slice(0, 10);
  }, [ordersList]);

  return (
    <div>
      <Card
        title={
          <div className="flex items-center justify-between">
            <span>Last Orders</span>
            {lastOrders.length > 0 && (
              <Badge
                count={lastOrders.length}
                style={{ backgroundColor: "#52c41a" }}
              />
            )}
          </div>
        }
        className="shadow-lg"
        loading={isLoading}
        bodyStyle={{ padding: 0 }}
      >
        {lastOrders.length > 0 ? (
          <div
            className="overflow-y-auto overflow-x-hidden"
            style={{ maxHeight: "400px", minHeight: "300px" }}
          >
            {lastOrders.map((order, index) => (
              <div
                key={order?._id || index}
                className="border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="p-4">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="small"
                        src={order?.user?.profile_image}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: "#1890ff" }}
                      />
                      <div>
                        <div className="font-medium text-sm">
                          {order?.user?.name || "Guest User"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.order_id || `#${order._id?.slice(-6)}`}
                        </div>
                      </div>
                    </div>
                    <Tag color={getStatusColor(order.status)} className="m-0">
                      {order.status}
                    </Tag>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-1 mb-2">
         

                    {/* Items */}
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <ShoppingCartOutlined />
                      <span>
                        {order.total_quantity || order.items?.length || 0} items
                        {order.items && order.items.length > 0 && (
                          <Tooltip
                            title={order.items
                              .map((item) => item.name)
                              .join(", ")}
                          >
                            <span className="text-gray-400 ml-1">
                              (
                              {order.items
                                .slice(0, 2)
                                .map((item) => item.name)
                                .join(", ")}
                              {order.items.length > 2 &&
                                ` +${order.items.length - 2}`}
                              )
                            </span>
                          </Tooltip>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <DollarOutlined style={{ color: "#52c41a" }} />
                        <span className="font-semibold text-green-600">
                          {formatCurrency(order.total_price)}
                        </span>
                      </div>
                      <Badge
                        status="processing"
                        color={getPaymentBadgeColor(order.paid_status)}
                        text={
                          <span className="text-xs">
                            {order.paid_status || "N/A"}
                          </span>
                        }
                      />
                    </div>
                    <Tooltip
                      title={dayjs(order.order_date || order.createdAt).format(
                        "DD MMM YYYY, hh:mm A"
                      )}
                    >
                      <span className="text-xs text-gray-500">
                        {dayjs(order.order_date || order.createdAt).fromNow()}
                      </span>
                    </Tooltip>
                  </div>

                  {/* Profit indicator */}
                  {order.order_profit !== undefined && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Profit</span>
                        <span
                          className={`font-medium ${
                            order.order_profit > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(order.order_profit)}
                          {order.profit_margin !== undefined && (
                            <span className="ml-1 text-gray-400">
                              ({parseFloat(order.profit_margin).toFixed(1)}%)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <Empty
              description="No orders available"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

export default LastOrdersCard;
