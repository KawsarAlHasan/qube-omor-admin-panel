import { Avatar, Badge, Card, Table, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

function TopCreditBuyers({ dataSource, isLoading }) {
  return (
    <Card className="shadow-lg">
      <Table
        columns={[
          {
            title: "Rank",
            key: "rank",
            width: 60,
            render: (_, __, index) => (
              <Badge
                count={index + 1}
                style={{
                  backgroundColor:
                    index === 0
                      ? "#faad14"
                      : index === 1
                      ? "#bfbfbf"
                      : index === 2
                      ? "#d48806"
                      : "#1890ff",
                }}
              />
            ),
          },
          {
            title: "User",
            dataIndex: "userName",
            key: "userName",
            render: (text, record) => (
              <div className="flex items-center gap-2">
                <Avatar icon={<UserOutlined />} />
                <div>
                  <div className="font-medium">{text || "N/A"}</div>
                  <div className="text-xs text-gray-500">
                    {record.userEmail}
                  </div>
                </div>
              </div>
            ),
          },
          {
            title: "Credits Bought",
            dataIndex: "totalCreditsBought",
            key: "totalCreditsBought",
            render: (credits) => (
              <span className="font-bold text-purple-600">{credits}</span>
            ),
          },
          {
            title: "Total Spent",
            dataIndex: "totalSpent",
            key: "totalSpent",
            render: (amount) => (
              <span className="font-medium text-green-600">
                ${amount?.toFixed(2)}
              </span>
            ),
          },
          {
            title: "Purchases",
            dataIndex: "purchaseCount",
            key: "purchaseCount",
            render: (count) => <Tag color="blue">{count} times</Tag>,
          },
        ]}
        dataSource={dataSource}
        rowKey="_id"
        loading={isLoading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 600 }}
      />
    </Card>
  );
}

export default TopCreditBuyers;
