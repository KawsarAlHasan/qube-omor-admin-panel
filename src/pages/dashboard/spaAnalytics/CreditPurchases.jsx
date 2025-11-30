import { Avatar, Card, Table, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function CreditPurchases({ dataSource, isLoading }) {
  const creditPurchaseColumns = [
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar size="small" icon={<UserOutlined />} />
          <span>{text || "N/A"}</span>
        </div>
      ),
    },
    {
      title: "Credits",
      dataIndex: "credit",
      key: "credit",
      render: (credit) => (
        <span className="font-bold text-blue-600">{credit}</span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="font-medium text-green-600">${price?.toFixed(2)}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("MMM DD, YYYY"),
    },
  ];

  return (
    <Card className="shadow-lg">
      <Table
        columns={creditPurchaseColumns}
        dataSource={dataSource}
        rowKey="_id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 600 }}
      />
    </Card>
  );
}

export default CreditPurchases;
