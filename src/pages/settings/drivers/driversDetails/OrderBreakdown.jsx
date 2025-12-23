import { Card, Empty, Progress, Typography } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
  TruckOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

function OrderBreakdown({ breakdown }) {
  // Calculate total amount for percentage calculation
  const totalBreakdownAmount =
    breakdown?.reduce((sum, item) => sum + (item.totalAmount || 0), 0) || 0;

  // Get breakdown percentage
  const getBreakdownPercentage = (amount) => {
    if (totalBreakdownAmount === 0) return 0;
    return ((amount / totalBreakdownAmount) * 100).toFixed(1);
  };

  const getBreakdownColor = (category) => {
    const colors = {
      paidDelivered: "#10b981",
      delivered: "#3b82f6",
      codDelivered: "#f59e0b",
      ongoing: "#8b5cf6",
      cancelled: "#ef4444",
    };
    return colors[category] || "#6b7280";
  };

  const getCategoryLabel = (category) => {
    const labels = {
      paidDelivered: "Online Paid & Delivered",
      delivered: "Delivered (Unpaid)",
      codDelivered: "COD Delivered",
      ongoing: "Ongoing",
      cancelled: "Cancelled",
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      paidDelivered: <CheckCircleOutlined />,
      delivered: <TruckOutlined />,
      codDelivered: <WalletOutlined />,
      ongoing: <ClockCircleOutlined />,
      cancelled: <CloseCircleOutlined />,
    };
    return icons[category] || <ShoppingCartOutlined />;
  };

  return (
    <div>
      <Card
        className="h-full border-0 shadow-sm rounded-2xl"
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <ShoppingCartOutlined className="text-indigo-600" />
            </div>
            <span className="font-semibold">Order Breakdown</span>
          </div>
        }
      >
        {breakdown && breakdown.some((item) => item.orderCount > 0) ? (
          <div className="space-y-4">
            {breakdown?.map((item) => {
              const percentage = getBreakdownPercentage(item.totalAmount);
              return (
                <div key={item.category} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                        style={{
                          backgroundColor: getBreakdownColor(item.category),
                        }}
                      >
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <Text strong className="block">
                          {getCategoryLabel(item.category)}
                        </Text>
                        <Text type="secondary" className="text-xs">
                          {item.orderCount} order
                          {item.orderCount !== 1 ? "s" : ""}
                        </Text>
                      </div>
                    </div>
                    <div className="text-right">
                      <Text strong className="text-lg block">
                        ${item.totalAmount?.toFixed(2)}
                      </Text>
                      <Text type="secondary" className="text-xs">
                        {percentage}%
                      </Text>
                    </div>
                  </div>
                  <Progress
                    percent={parseFloat(percentage)}
                    showInfo={false}
                    strokeColor={getBreakdownColor(item.category)}
                    trailColor="#f1f5f9"
                    strokeWidth={8}
                    className="group-hover:scale-[1.02] transition-transform"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <Empty
            description="No orders in this period"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
}

export default OrderBreakdown;
