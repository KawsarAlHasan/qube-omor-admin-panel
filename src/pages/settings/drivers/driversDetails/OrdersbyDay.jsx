import {
  Badge,
  Card,
  Collapse,
  DatePicker,
  Empty,
  Table,
  Tag,
  Typography,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

function OrdersbyDay({ ordersByDay }) {
  // Order columns for daily breakdown - Updated to match new JSON
  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      width: 140,
      render: (id) => (
        <Text code className="text-xs">
          #{id?.slice(-8).toUpperCase()}
        </Text>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paidStatus",
      key: "paidStatus",
      width: 120,
      render: (status) => (
        <Tag
          color={
            status === "Paid" ? "green" : status === "COD" ? "gold" : "red"
          }
          className="rounded-full"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Order Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const colors = {
          Delivered: "success",
          Pending: "processing",
          Processing: "processing",
          "On Going": "warning",
          Ready: "cyan",
          Cancelled: "error",
        };
        return <Badge status={colors[status] || "default"} text={status} />;
      },
    },
    {
      title: "Amount",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 100,
      align: "right",
      render: (price) => (
        <Text className="font-bold text-emerald-600">${price?.toFixed(2)}</Text>
      ),
    },
  ];

  // Generate daily orders collapse items
  const dailyOrderItems = ordersByDay?.map((day, index) => ({
    key: index.toString(),
    label: (
      <div className="flex justify-between items-center w-full pr-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
            {dayjs(day.date).format("DD")}
          </div>
          <div>
            <Text strong>
              {day.formattedDate || dayjs(day.date).format("MMM D, YYYY")}
            </Text>
            <Text type="secondary" className="block text-xs">
              {day.orderCount} order{day.orderCount > 1 ? "s" : ""}
            </Text>
          </div>
        </div>
        <Tag color="green" className="text-base font-semibold">
          ${day.totalAmount?.toFixed(2)}
        </Tag>
      </div>
    ),
    children: (
      <Table
        columns={orderColumns}
        dataSource={day.orders}
        rowKey="orderId"
        pagination={false}
        size="small"
        className="nested-table"
      />
    ),
  }));

  return (
    <div>
      <Card
        className="border-0 shadow-sm rounded-2xl"
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <CalendarOutlined className="text-purple-600" />
            </div>
            <span className="font-semibold">Orders by Day</span>
          </div>
        }
        extra={
          <Tag color="purple" className="rounded-full">
            {ordersByDay?.length || 0} days
          </Tag>
        }
      >
        {ordersByDay && ordersByDay.length > 0 ? (
          <Collapse
            items={dailyOrderItems}
            bordered={false}
            className="bg-transparent"
            expandIconPosition="end"
          />
        ) : (
          <Empty
            description="No orders found for this period"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
}

export default OrdersbyDay;
