import { Modal, Table, Tag, Button, Space, message, Empty, Spin } from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useSingleUserCreditsDetails } from "../../api/spaApi";
import { useState } from "react";
import { API } from "../../api/api";

function CreditsDetails({ userData, isOpen, onClose }) {
  const [loadingAction, setLoadingAction] = useState(null);

  const { singleCreditsData, isLoading, isError, error, refetch } =
    useSingleUserCreditsDetails(
      { id: userData?._id },
      {
        enabled: isOpen && !!userData?._id,
      }
    );

  const handleAction = async (record, actionType) => {
    setLoadingAction(record._id);
    try {
      await API.put(`/credit/accept-borrow/${record._id}`, {
        action: actionType,
      });

      message.success(
        actionType === "accepted"
          ? "Borrow request accepted!"
          : "Borrow request rejected!"
      );

      refetch();
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Failed to update borrow request."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const paidStatusChange = async (record) => {
    setLoadingAction(record._id);
    try {
      const response = await API.put(
        `/credit/paid-status-change/${record._id}`,
        {
          borrow_paid_status: "Paid",
        }
      );

      message.success("Borrow status updated to Paid!");
      refetch();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to update paid status."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      Active: { color: "green", icon: <CheckCircleOutlined /> },
      Borrow: { color: "orange", icon: <ClockCircleOutlined /> },
      Inactive: { color: "red", icon: <CloseCircleOutlined /> },
    };

    const config = statusConfig[status] || {
      color: "default",
      icon: <ClockCircleOutlined />,
    };

    return (
      <Tag color={config.color} icon={config.icon}>
        {status}
      </Tag>
    );
  };

  const getBorrowStatusTag = (borrowStatus) => {
    const config = {
      Paid: { color: "success", text: "Paid" },
      Unpaid: { color: "error", text: "Unpaid" },
    };

    const { color, text } = config[borrowStatus] || {
      color: "default",
      text: borrowStatus,
    };

    return <Tag color={color}>{text}</Tag>;
  };

  const getPaymentMethodTag = (method) => {
    const config = {
      Cash: { color: "blue", icon: <DollarOutlined /> },
      Borrow: { color: "orange", icon: <ClockCircleOutlined /> },
    };

    const { color, icon } = config[method] || { color: "default", icon: null };

    return (
      <Tag color={color} icon={icon}>
        {method}
      </Tag>
    );
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => new Date(date).toLocaleDateString("en-US"),
    },
    {
      title: "Credits",
      dataIndex: "credit",
      key: "credit",
      width: 80,
      render: (credit) => (
        <span className="font-semibold text-blue-600">{credit}</span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 80,
      render: (price) => (
        <span className="font-semibold text-green-600">${price}</span>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 130,
      render: (method) => getPaymentMethodTag(method),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Borrow Status",
      dataIndex: "borrow_paid_status",
      key: "borrow_paid_status",
      width: 120,
      render: (status, record) => (
        <Space direction="vertical" size="small">
          {getBorrowStatusTag(status)}
          {/* Mark as Paid button - শুধু Unpaid থাকলে দেখাবে */}
          {status === "Unpaid" && (
            <Button
              type="link"
              size="small"
              className="p-0 h-auto text-green-600 hover:text-green-700"
              loading={loadingAction === record._id}
              onClick={() => paidStatusChange(record)}
            >
              Mark as Paid
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 180,
      render: (_, record) => {
        // Show action buttons only for Borrow status and Unpaid
        if (
          record.status === "Borrow" &&
          record.borrow_paid_status === "Unpaid"
        ) {
          return (
            <Space size="small">
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                loading={loadingAction === record._id}
                onClick={() => handleAction(record, "accepted")}
              >
                Accept
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                loading={loadingAction === record._id}
                onClick={() => handleAction(record, "rejected")}
              >
                Reject
              </Button>
            </Space>
          );
        }
        return <span className="text-gray-400">-</span>;
      },
    },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" tip="Loading credits data..." />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-8">
          <Empty
            description={
              <span className="text-red-500">
                {error?.message || "Failed to load credits data"}
              </span>
            }
          />
        </div>
      );
    }

    if (!singleCreditsData?.data || singleCreditsData.data.length === 0) {
      return (
        <div className="text-center py-8">
          <Empty description="No credit records found" />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Total Records</div>
            <div className="text-2xl font-bold text-blue-700">
              {singleCreditsData.data.length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-600 mb-1">Total Credits</div>
            <div className="text-2xl font-bold text-green-700">
              {singleCreditsData.data.reduce(
                (sum, item) => sum + item.credit,
                0
              )}
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="text-sm text-orange-600 mb-1">Unpaid Borrow</div>
            <div className="text-2xl font-bold text-orange-700">
              ${singleCreditsData.totalBorrowUnpaid || 0}
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={singleCreditsData.data}
          rowKey="_id"
          pagination={{
            pageSize: 20,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} records`,
          }}
          scroll={{ x: 900 }}
          size="small"
        />
      </div>
    );
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-blue-500" />
          <span className="text-lg font-semibold">
            User Credits Details
            {userData?.name && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({userData.name})
              </span>
            )}
          </span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={1000}
      bodyStyle={{ padding: "24px" }}
    >
      {renderContent()}
    </Modal>
  );
}

export default CreditsDetails;