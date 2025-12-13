import { useState } from "react";
import { useCreditsBuyers } from "../../api/spaApi";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";
import { Button, Table, Tag, Modal, message, Divider, Space } from "antd";
import userIcon from "../../assets/icons/userIcon.png";
import { EditOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { API } from "../../api/api";
import AdminGiveCreditByCash from "./AdminGiveCreditByCash";

function CreditsBuyers() {
  const [filter, setFilter] = useState({ page: 1, limit: 10 });
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingPaidStatus, setLoadingPaidStatus] = useState(null);

  const { creditBuyers, isLoading, isError, error, refetch } =
    useCreditsBuyers(filter);

  // Pagination Handler
  const handleTableChange = (pagination) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  // Open modal when click "Borrow Action"
  const openActionModal = (record) => {
    setSelectedBorrow(record);
    setIsModalOpen(true);
  };

  // Accept or Reject handler
  const handleAction = async (actionType) => {
    try {
      await API.put(`/credit/accept-borrow/${selectedBorrow?._id}`, {
        action: actionType, // accepted or rejected
      });

      message.success(
        actionType === "accepted"
          ? "Borrow request accepted!"
          : "Borrow request rejected!"
      );

      setIsModalOpen(false);
      refetch(); // Refresh data
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Failed to update borrow request."
      );
    }
  };

  // Paid Status Change Handler
  const paidStatusChange = async (record) => {
    setLoadingPaidStatus(record._id);
    try {
      await API.put(`/credit/paid-status-change/${record._id}`, {
        borrow_paid_status: "Paid",
      });

      message.success("Borrow status updated to Paid!");
      refetch();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to update paid status."
      );
    } finally {
      setLoadingPaidStatus(null);
    }
  };

  // Table Columns
  const columns = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <img
            className="w-[40px] h-[40px] rounded-full"
            src={record?.user?.profile_image || userIcon}
            alt={record?.user?.name}
          />
          <div>
            <h1 className="font-medium">{record?.user?.name}</h1>
            <p className="text-gray-500 text-sm">{record?.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      render: (credit) => (
        <span className="font-semibold text-blue-600">{credit} Credits</span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="font-semibold text-green-600">${price}</span>
      ),
    },
    {
      title: "Paid Status",
      dataIndex: "borrow_paid_status",
      key: "borrow_paid_status",
      render: (borrow_paid_status, record) => (
        <Space direction="vertical" size="small">
          <Tag
            color={
              borrow_paid_status === "Paid"
                ? "green"
                : borrow_paid_status === "Cash"
                ? "blue"
                : "red"
            }
          >
            {borrow_paid_status}
          </Tag>

          {/* Mark as Paid button - শুধু Unpaid থাকলে দেখাবে */}
          {borrow_paid_status === "Unpaid" && (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              className="p-0 h-auto text-green-600 hover:text-green-700"
              loading={loadingPaidStatus === record._id}
              onClick={() => paidStatusChange(record)}
            >
              Mark as Paid
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: "Payment Method",
      key: "paymentMethod",
      render: (_, record) => (
        <Tag
          color={
            record.paymentMethod === "Stripe"
              ? "green"
              : record.paymentMethod === "Cash"
              ? "blue"
              : "orange"
          }
        >
          {record.paymentMethod}
        </Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tag color={record.status === "Active" ? "green" : "orange"}>
            {record.status}
          </Tag>

          {record.status === "Borrow" && (
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => openActionModal(record)}
            >
              Action
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError isError={isError} error={error} />;

  return (
    <div>
      <div className="mb-4">
        <AdminGiveCreditByCash refetch={refetch} />
      </div>

      <Table
        columns={columns}
        dataSource={creditBuyers?.data || []}
        rowKey="_id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: creditBuyers?.pagination?.total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
      />

      {/* ACTION MODAL */}
      <Modal
        open={isModalOpen}
        title={
          <div className="text-xl font-semibold text-gray-800">
            Borrow Request Confirmation
          </div>
        }
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="reject"
            danger
            size="large"
            className="px-6"
            onClick={() => handleAction("rejected")}
          >
            Reject
          </Button>,
          <Button
            key="accept"
            type="primary"
            size="large"
            className="px-6"
            onClick={() => handleAction("accepted")}
          >
            Accept
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <p className="text-lg font-medium text-gray-700">
            Are you sure you want to take action on this borrow request?
          </p>

          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            {/* User info */}
            <div className="flex items-center gap-3 pb-3 border-b">
              <img
                className="w-[48px] h-[48px] rounded-full shadow"
                src={selectedBorrow?.user?.profile_image || userIcon}
                alt={selectedBorrow?.user?.name}
              />
              <div>
                <h1 className="font-semibold text-gray-800">
                  {selectedBorrow?.user?.name}
                </h1>
                <p className="text-gray-500 text-sm">
                  {selectedBorrow?.user?.email}
                </p>
              </div>
            </div>

            {/* Borrow Details */}
            <div className="mt-3 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Credits:</span>
                <span className="text-blue-600 font-semibold">
                  {selectedBorrow?.credit}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Price:</span>
                <span className="text-green-600 font-semibold">
                  ${selectedBorrow?.price}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Payment Method:</span>
                <span className="text-blue-600 font-medium">
                  {selectedBorrow?.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Request Date:</span>
                <span>
                  {new Date(selectedBorrow?.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CreditsBuyers;