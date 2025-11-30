import { Avatar, Card, Table, Tag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

function RecentBookings({ dataSource, isLoading }) {
  // Get attendees type icon and color
  const getAttendeesTypeConfig = (type) => {
    switch (type) {
      case "inClass":
        return {
          icon: <CheckCircleOutlined />,
          color: "success",
          label: "In Class",
        };
      case "waiting":
        return {
          icon: <ClockCircleOutlined />,
          color: "warning",
          label: "Waiting",
        };
      case "classEnd":
        return { icon: <SyncOutlined />, color: "default", label: "Class End" };
      default:
        return { icon: null, color: "default", label: type };
    }
  };

  // Recent bookings table columns
  const bookingColumns = [
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{text || "N/A"}</div>
            <div className="text-xs text-gray-500">{record.userEmail}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Service",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (text, record) => (
        <div>

          {console.log(record, "record")}
          <div>{text || "N/A"}</div>
          <Tag color={record.type === "Spa" ? "blue" : "green"} size="small">
            {record.type}
          </Tag>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "attendees_type",
      key: "attendees_type",
      render: (type) => {
        const config = getAttendeesTypeConfig(type);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      render: (credit) => <span className="font-medium">{credit || 0}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("MMM DD, YYYY HH:mm"),
    },
  ];

  return (
    <Card className="shadow-lg">
      <Table
        columns={bookingColumns}
        dataSource={dataSource}
        rowKey="_id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />
    </Card>
  );
}

export default RecentBookings;
