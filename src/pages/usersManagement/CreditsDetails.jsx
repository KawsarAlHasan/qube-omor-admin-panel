import {
  Modal,
  Table,
  Tag,
  Button,
  Space,
  message,
  Empty,
  Spin,
  Popconfirm,
  InputNumber,
  Form,
  Radio,
} from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useSingleUserCreditsDetails } from "../../api/spaApi";
import { useState, useEffect } from "react";
import { API } from "../../api/api";

function CreditsDetails({ userData, isOpen, onClose, mainRefetch }) {
  const [loadingAction, setLoadingAction] = useState(null);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [removeCreditForm] = Form.useForm();
  const [localTotalCredits, setLocalTotalCredits] = useState(
    userData?.credit || 0
  );

  const { singleCreditsData, isLoading, isError, error, refetch } =
    useSingleUserCreditsDetails(
      { id: userData?._id },
      {
        enabled: isOpen && !!userData?._id,
      }
    );

  useEffect(() => {
    if (userData?.credit !== undefined) {
      setLocalTotalCredits(userData.credit);
    }
  }, [userData?.credit]);

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

      // Refetch both to update data
      await Promise.all([refetch(), mainRefetch?.()]);
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Failed to update borrow request."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async (record) => {
    setLoadingAction(record._id);
    try {
      await API.delete("/credit/admin-delete-credit", {
        data: {
          userId: userData?._id,
          creditId: record?._id,
        },
      });
      message.success("Credit record deleted successfully!");

      // Refetch both to update data
      await Promise.all([refetch(), mainRefetch?.()]);

      setLocalTotalCredits((prev) => prev - record.credit);
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Failed to delete credit record."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const paidStatusChange = async (record) => {
    setLoadingAction(record._id);
    try {
      await API.put(`/credit/paid-status-change/${record._id}`, {
        borrow_paid_status: "Paid",
      });

      message.success("Borrow status updated to Paid!");

      // Refetch both to update data
      await Promise.all([refetch(), mainRefetch?.()]);
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to update paid status."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRemoveCredit = async (values) => {
    setLoadingAction("remove-credit");
    try {
      const payload = {
        userId: userData?._id,
        credit: values.credit,
        paidStatus: paymentStatus,
      };

      await API.post("/credit/admin-remove-credit", payload);

      // Optimistic update - immediately update local state
      setLocalTotalCredits((prev) => prev - values.credit);

      message.success("Credit removed successfully!");
      setRemoveModalOpen(false);
      removeCreditForm.resetFields();
      setPaymentStatus("Paid");

      // Refetch both to get fresh data from server
      await Promise.all([refetch(), mainRefetch?.()]);
    } catch (err) {
      message.error(err?.response?.data?.message || "Failed to remove credit.");
      // Revert optimistic update on error
      setLocalTotalCredits(userData?.credit || 0);
    } finally {
      setLoadingAction(null);
    }
  };

  const openRemoveCreditModal = () => {
    setRemoveModalOpen(true);
    removeCreditForm.resetFields();
    setPaymentStatus("Paid");
  };

  const closeRemoveCreditModal = () => {
    setRemoveModalOpen(false);
    removeCreditForm.resetFields();
    setPaymentStatus("Paid");
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
        <span
          className={`font-semibold ${
            credit < 0 ? "text-red-600" : "text-blue-600"
          }`}
        >
          {credit}
        </span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 80,
      render: (price) => (
        <span
          className={`font-semibold ${
            price < 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          ${price}
        </span>
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
        return (
          <span className="text-gray-400">
            {record.credit <= localTotalCredits &&
            record.borrow_paid_status === "Unpaid" ? (
              <Popconfirm
                title="Delete Credit Record"
                description="Are you sure you want to delete this credit record?"
                onConfirm={() => handleDelete(record)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  loading={loadingAction === record._id}
                >
                  Remove
                </Button>
              </Popconfirm>
            ) : (
              "-"
            )}
          </span>
        );
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
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Total Records</div>
            <div className="text-2xl font-bold text-blue-700">
              {singleCreditsData.data.length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-600 mb-1">Total Credits</div>
            <div className="text-2xl font-bold text-green-700">
              {localTotalCredits}
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="text-sm text-orange-600 mb-1">
              Admin Owed Amount
            </div>
            <div className="text-2xl font-bold text-orange-700">
              ${singleCreditsData.totalBorrowUnpaid?.toFixed(2) || 0}
            </div>
          </div>
        </div>

        {/* Remove Credit Button */}
        <div className="flex justify-end mb-4">
          <Button
            danger
            type="default"
            icon={<MinusCircleOutlined />}
            onClick={openRemoveCreditModal}
          >
            Remove Credit
          </Button>
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
    <>
      {/* Main Modal */}
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

      {/* Remove Credit Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MinusCircleOutlined className="text-red-500" />
            <span className="text-lg font-semibold">Remove Credit</span>
          </div>
        }
        open={removeModalOpen}
        onCancel={closeRemoveCreditModal}
        footer={null}
        centered
        width={500}
      >
        <Form
          form={removeCreditForm}
          layout="vertical"
          onFinish={handleRemoveCredit}
          className="mt-4"
        >
          <Form.Item
            label="Credit Amount"
            name="credit"
            rules={[
              {
                required: true,
                message: "Please enter credit amount!",
              },
              {
                type: "number",
                min: 0.01,
                message: "Credit must be greater than 0!",
              },
              {
                type: "number",
                max: localTotalCredits,
                message: `Credit amount cannot exceed ${localTotalCredits}!`,
              },
            ]}
          >
            <InputNumber
              placeholder="Enter credit amount"
              style={{ width: "100%" }}
              min={0}
              max={localTotalCredits}
              step={0.01}
              precision={2}
              prefix={<DollarOutlined />}
            />
          </Form.Item>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <Radio.Group
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full"
            >
              <Radio.Button
                value="Paid"
                className="w-1/2 text-center"
                style={{
                  backgroundColor:
                    paymentStatus === "Paid" ? "#10b981" : "white",
                  color: paymentStatus === "Paid" ? "white" : "inherit",
                  borderColor: paymentStatus === "Paid" ? "#10b981" : "#d9d9d9",
                }}
              >
                <CheckCircleOutlined className="mr-2" />
                Paid
              </Radio.Button>
              <Radio.Button
                value="Unpaid"
                className="w-1/2 text-center"
                style={{
                  backgroundColor:
                    paymentStatus === "Unpaid" ? "#ef4444" : "white",
                  color: paymentStatus === "Unpaid" ? "white" : "inherit",
                  borderColor:
                    paymentStatus === "Unpaid" ? "#ef4444" : "#d9d9d9",
                }}
              >
                <DollarOutlined className="mr-2" />
                Unpaid
              </Radio.Button>
            </Radio.Group>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 my-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This will remove the specified credit
              amount from the user's account.
            </p>
            <p className="text-sm text-yellow-800 mt-1">
              Current balance: <strong>{localTotalCredits} credits</strong>
            </p>
            <p className="text-sm text-yellow-800 mt-1">
              Maximum removable: <strong>{localTotalCredits} credits</strong>
            </p>
          </div>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={closeRemoveCreditModal}>Cancel</Button>
              <Button
                type="primary"
                danger
                htmlType="submit"
                loading={loadingAction === "remove-credit"}
                icon={<MinusCircleOutlined />}
              >
                Remove Credit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CreditsDetails;
