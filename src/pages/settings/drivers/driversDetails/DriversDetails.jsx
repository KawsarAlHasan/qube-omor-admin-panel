import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAssignFoodOrders } from "../../../../api/userApi";
import IsLoading from "../../../../components/IsLoading";
import IsError from "../../../../components/IsError";
import { API } from "../../../../api/api";
import {
  Card,
  DatePicker,
  Button,
  Table,
  Tag,
  Row,
  Col,
  Space,
  Typography,
  Badge,
  Empty,
  Modal,
  Input,
  InputNumber,
  Form,
  message,
  Progress,
  Timeline,
  Collapse,
  Statistic,
  Alert,
} from "antd";
import {
  CalendarOutlined,
  FilterOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  PayCircleOutlined,
  WalletOutlined,
  HistoryOutlined,
  TruckOutlined,
  BankOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

function DriversDetails() {
  const { driverId } = useParams();
  const [dateRange, setDateRange] = useState(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [isPaidModalOpen, setIsPaidModalOpen] = useState(false);
  const [isStatusChangeLoading, setIsStatusChangeLoading] = useState(false);
  const [form] = Form.useForm();

  const filter = {
    userID: driverId,
    ...(dateRange && {
      startDate: dateRange[0].format("YYYY-MM-DD"),
      endDate: dateRange[1].format("YYYY-MM-DD"),
    }),
  };

  const { assignOrder, isLoading, isError, error, refetch } =
    useAssignFoodOrders(filter, { enabled: true });

  const data = assignOrder;

  const handleClearFilter = () => {
    setDateRange(null);
    setShowDateFilter(false);
  };

  const handlePaidAmountChange = async () => {
    if (!driverId) return;

    try {
      const values = await form.validateFields();
      const { amount, date } = values;

      if (!amount || amount < 0) {
        return message.error("Please enter a valid amount.");
      }

      setIsStatusChangeLoading(true);

      await API.put(`/user/today-paid-us`, {
        driver: driverId,
        amount: Number(amount),
        date: date.format("YYYY-MM-DD"),
      });

      message.success("Payment recorded successfully!");
      setIsPaidModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Failed to record payment");
    } finally {
      setIsStatusChangeLoading(false);
    }
  };

  const openPaidModal = () => {
    form.setFieldsValue({
      amount: "",
      date: dayjs(),
      notes: "",
    });
    setIsPaidModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsPaidModalOpen(false);
    form.resetFields();
  };

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  const {
    driverData,
    reportPeriod,
    summary,
    breakdown,
    payments,
    ordersByDay,
  } = data || {};

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

  // Check if admin owes driver (negative adminReceivable)
  const adminOwesDriver = (summary?.adminReceivable || 0) < 0;
  const absoluteReceivable = Math.abs(summary?.adminReceivable || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <TruckOutlined className="text-2xl text-white" />
            </div>
            <div>
              <Title level={2} className="!mb-0 !text-gray-800">
                Driver Financial Report
              </Title>
              <Text type="secondary" className="text-sm">
                Fixed Salary Model - Earnings Overview
              </Text>
            </div>
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PayCircleOutlined />}
          onClick={openPaidModal}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 border-0 shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all rounded-xl h-12 px-6"
        >
          Record Payment
        </Button>
      </div>

      {/* Driver Info Card */}
      {driverData && (
        <Card className="mb-6 border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-r from-white to-indigo-50/50">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              {driverData.profile_image ? (
                <img
                  src={driverData.profile_image}
                  alt={driverData.name}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">
                    {driverData.name?.charAt(0)?.toUpperCase() || "D"}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                <CheckCircleOutlined className="text-white text-sm" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <Title level={3} className="!mb-1 !text-gray-800">
                {driverData.name || "Driver"}
              </Title>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                <Tag
                  icon={<MailOutlined />}
                  color="blue"
                  className="rounded-full px-3 py-1"
                >
                  {driverData.email}
                </Tag>
                <Tag
                  icon={<PhoneOutlined />}
                  color="green"
                  className="rounded-full px-3 py-1"
                >
                  {driverData.phone}
                </Tag>
              </div>
              {driverData.latitude && driverData.longitude && (
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 text-gray-500">
                  <EnvironmentOutlined className="text-rose-500" />
                  <Text type="secondary" className="text-sm">
                    {driverData.latitude?.toFixed(4)},{" "}
                    {driverData.longitude?.toFixed(4)}
                  </Text>
                  <Button
                    type="link"
                    size="small"
                    className="text-xs p-0"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps?q=${driverData.latitude},${driverData.longitude}`,
                        "_blank"
                      )
                    }
                  >
                    View on Map
                  </Button>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
                <Text
                  type="secondary"
                  className="text-xs uppercase tracking-wider"
                >
                  Driver ID
                </Text>
                <Text code className="block mt-1 text-sm">
                  #{driverData._id?.slice(-8).toUpperCase()}
                </Text>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Date Filter Card */}
      <Card className="mb-6 border-0 shadow-sm rounded-2xl overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <CalendarOutlined className="text-xl text-indigo-600" />
            </div>
            <div>
              <Text strong className="text-gray-800 block">
                {dateRange
                  ? `${dateRange[0].format(
                      "MMM D, YYYY"
                    )} - ${dateRange[1].format("MMM D, YYYY")}`
                  : "Report Period"}
              </Text>
              <Text type="secondary" className="text-xs">
                {reportPeriod?.note || "All available data"}
              </Text>
            </div>
          </div>

          <Space wrap>
            {!showDateFilter ? (
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={() => setShowDateFilter(true)}
                className="bg-indigo-500 hover:bg-indigo-600 border-0 rounded-xl"
              >
                Filter by Date
              </Button>
            ) : (
              <>
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  format="YYYY-MM-DD"
                  className="rounded-xl"
                />
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleClearFilter}
                  className="rounded-xl"
                >
                  Clear
                </Button>
              </>
            )}
          </Space>
        </div>
      </Card>

      {/* Info Note */}
      {summary?.note && (
        <Alert
          message="Payment Model"
          description={summary.note}
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          className="mb-6 rounded-2xl border-0 shadow-sm"
        />
      )}

      {/* Main Financial Summary - Hero Card */}
      <Card className="mb-6 border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
        <Row gutter={[24, 24]}>
          {/* Admin Receivable - Main Highlight */}
          <Col xs={24} lg={10}>
            <div className="text-center lg:text-left p-4">
              <Text className="text-slate-400 uppercase tracking-wider text-sm font-medium">
                {adminOwesDriver ? "Admin Owes Driver" : "Driver Owes Admin"}
              </Text>
              <div className="flex items-baseline gap-2 mt-2 justify-center lg:justify-start">
                <span
                  className={`text-5xl md:text-6xl font-bold ${
                    adminOwesDriver ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  ${absoluteReceivable.toFixed(2)}
                </span>
                {adminOwesDriver ? (
                  <ArrowDownOutlined className="text-3xl text-emerald-400" />
                ) : (
                  <ArrowUpOutlined className="text-3xl text-rose-400" />
                )}
              </div>
              <div className="mt-4 flex items-center gap-2 justify-center lg:justify-start">
                <Tag
                  className={`${
                    adminOwesDriver
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                  } rounded-full px-3 py-1`}
                >
                  <BankOutlined className="mr-1" />
                  {adminOwesDriver ? "Credit Balance" : "Outstanding Balance"}
                </Tag>
              </div>
            </div>
          </Col>

          {/* Summary Stats */}
          <Col xs={24} lg={14}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8}>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                  <ShoppingCartOutlined className="text-2xl text-blue-400 mb-2" />
                  <Text className="text-3xl font-bold text-white block">
                    {summary?.totalOrders || 0}
                  </Text>
                  <Text className="text-slate-400 text-xs">Total Orders</Text>
                </div>
              </Col>
              <Col xs={12} sm={8}>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                  <CheckCircleOutlined className="text-2xl text-emerald-400 mb-2" />
                  <Text className="text-3xl font-bold text-white block">
                    {summary?.paidDeliveredOrders || 0}
                  </Text>
                  <Text className="text-slate-400 text-xs">
                    Paid & Delivered
                  </Text>
                </div>
              </Col>
              <Col xs={12} sm={8}>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                  <DollarOutlined className="text-2xl text-amber-400 mb-2" />
                  <Text className="text-3xl font-bold text-white block">
                    ${summary?.totalPaidDeliveredEarnings?.toFixed(2) || "0.00"}
                  </Text>
                  <Text className="text-slate-400 text-xs">Total Earnings</Text>
                </div>
              </Col>
              <Col xs={12} sm={8}>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                  <WalletOutlined className="text-2xl text-purple-400 mb-2" />
                  <Text className="text-3xl font-bold text-white block">
                    ${summary?.totalPaidByDriver?.toFixed(2) || "0.00"}
                  </Text>
                  <Text className="text-slate-400 text-xs">Paid by Driver</Text>
                </div>
              </Col>
              <Col xs={24} sm={16}>
                <div
                  className={`${
                    adminOwesDriver ? "bg-emerald-500/20" : "bg-rose-500/20"
                  } backdrop-blur rounded-2xl p-4`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="text-slate-300 text-sm block mb-1">
                        Settlement Status
                      </Text>
                      <Text
                        className={`text-2xl font-bold ${
                          adminOwesDriver ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {adminOwesDriver
                          ? `Admin owes $${absoluteReceivable.toFixed(2)}`
                          : `Driver owes $${absoluteReceivable.toFixed(2)}`}
                      </Text>
                    </div>
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        adminOwesDriver ? "bg-emerald-500/30" : "bg-rose-500/30"
                      }`}
                    >
                      {adminOwesDriver ? (
                        <ArrowDownOutlined className="text-3xl text-emerald-400" />
                      ) : (
                        <ArrowUpOutlined className="text-3xl text-rose-400" />
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Order Breakdown & Payment History */}
      <Row gutter={[20, 20]} className="mb-6">
        <Col xs={24} lg={14}>
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
        </Col>

        {/* Payment History */}
        <Col xs={24} lg={10}>
          <Card
            className="h-full border-0 shadow-sm rounded-2xl"
            title={
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <HistoryOutlined className="text-emerald-600" />
                </div>
                <span className="font-semibold">Payment History</span>
              </div>
            }
            extra={
              <Tag color="blue" className="rounded-full">
                {payments?.length || 0} payments
              </Tag>
            }
          >
            {payments && payments.length > 0 ? (
              <Timeline
                items={payments.map((payment) => ({
                  color: "green",
                  dot: (
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <DollarOutlined className="text-white text-sm" />
                    </div>
                  ),
                  children: (
                    <div className="ml-2 pb-4">
                      <div className="flex items-center justify-between">
                        <Text strong className="text-lg text-emerald-600">
                          ${payment.amount?.toFixed(2)}
                        </Text>
                        <Text code className="text-xs">
                          #{payment.transactionId?.slice(-6).toUpperCase()}
                        </Text>
                      </div>
                      <Text type="secondary" className="text-sm block">
                        {dayjs(payment.date).format("MMMM D, YYYY")}
                      </Text>
                      {payment.note && (
                        <Text type="secondary" className="text-xs italic">
                          {payment.note}
                        </Text>
                      )}
                    </div>
                  ),
                }))}
              />
            ) : (
              <Empty
                description="No payments recorded yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Daily Orders Breakdown */}
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

      {/* Pay Driver Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <PayCircleOutlined className="text-emerald-600 text-xl" />
            </div>
            <div>
              <Text strong className="block">
                Record Payment
              </Text>
              <Text type="secondary" className="text-xs">
                Add payment from driver to admin
              </Text>
            </div>
          </div>
        }
        open={isPaidModalOpen}
        onOk={handlePaidAmountChange}
        onCancel={handleModalCancel}
        confirmLoading={isStatusChangeLoading}
        okText="Submit Payment"
        okButtonProps={{
          className:
            "bg-emerald-500 hover:bg-emerald-600 border-0 rounded-xl h-10",
          icon: <PayCircleOutlined />,
        }}
        cancelButtonProps={{
          className: "rounded-xl h-10",
        }}
        cancelText="Cancel"
        className="rounded-2xl"
      >
        <Form form={form} layout="vertical" className="mt-6">
          {/* Current Balance Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl">
            <Text strong className="block mb-3 text-gray-700">
              Current Financial Status
            </Text>
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <Text type="secondary" className="text-xs block">
                    Total Earnings
                  </Text>
                  <Text strong className="text-lg text-emerald-600">
                    ${summary?.totalPaidDeliveredEarnings?.toFixed(2) || "0.00"}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <Text type="secondary" className="text-xs block">
                    Already Paid
                  </Text>
                  <Text strong className="text-lg text-blue-600">
                    ${summary?.totalPaidByDriver?.toFixed(2) || "0.00"}
                  </Text>
                </div>
              </Col>
              <Col span={24}>
                <div
                  className={`${
                    adminOwesDriver ? "bg-emerald-50" : "bg-rose-50"
                  } rounded-xl p-3 shadow-sm`}
                >
                  <Text type="secondary" className="text-xs block">
                    {adminOwesDriver ? "Admin Owes Driver" : "Balance Due"}
                  </Text>
                  <Text
                    strong
                    className={`text-xl ${
                      adminOwesDriver ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    ${absoluteReceivable.toFixed(2)}
                  </Text>
                </div>
              </Col>
            </Row>
          </div>

          <Form.Item
            name="date"
            label={<Text strong>Payment Date</Text>}
            rules={[{ required: true, message: "Please select payment date" }]}
          >
            <DatePicker
              className="w-full rounded-xl h-11"
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="amount"
            label={<Text strong>Payment Amount</Text>}
            rules={[
              { required: true, message: "Please enter payment amount" },
              {
                type: "number",
                min: 0.01,
                message: "Amount must be greater than 0",
              },
            ]}
          >
            <InputNumber
              className="w-full rounded-xl h-11"
              placeholder="Enter payment amount"
              prefix="$"
              min={0.01}
              step={0.01}
              precision={2}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Custom Styles */}
      <style jsx>{`
        .nested-table .ant-table {
          background: transparent;
        }
        .ant-collapse-item {
          border: 1px solid #f1f5f9 !important;
          border-radius: 16px !important;
          margin-bottom: 12px !important;
          overflow: hidden;
        }
        .ant-collapse-header {
          padding: 16px !important;
          background: #fafafa;
        }
        .ant-collapse-content-box {
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
}

export default DriversDetails;
