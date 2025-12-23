import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAssignFoodOrders } from "../../../../api/userApi";
import IsLoading from "../../../../components/IsLoading";
import IsError from "../../../../components/IsError";
import { API } from "../../../../api/api";
import {
  Card,
  DatePicker,
  Button,
  Tag,
  Row,
  Col,
  Space,
  Typography,
  Modal,
  InputNumber,
  Form,
  message,
} from "antd";
import {
  CalendarOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  PayCircleOutlined,
  TruckOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import OrdersbyDay from "./OrdersbyDay";
import PaymentHistory from "./PaymentHistory";
import OrderBreakdown from "./OrderBreakdown";
import FinancialSummary from "./FinancialSummary";
import AdminReturnMoney from "./AdminReturnMoney";
import DriverPayMoney from "./DriverPayMoney";

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

      // if (!amount || amount < 0) {
      //   return message.error("Please enter a valid amount.");
      // }

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
        {/* <div className="flex gap-4">
          <AdminReturnMoney />
          <DriverPayMoney />
        </div> */}
        <Button
          type="primary"
          size="large"
          icon={<DollarOutlined />}
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

      {/* Main Financial Summary - Hero Card */}
      <FinancialSummary summary={summary} />

      {/* Order Breakdown & Payment History */}
      <Row gutter={[20, 20]} className="mb-6">
        <Col xs={24} lg={14}>
          <OrderBreakdown breakdown={breakdown} />
        </Col>

        {/* Payment History */}
        <Col xs={24} lg={10}>
          <PaymentHistory payments={payments} />
        </Col>
      </Row>

      {/* Daily Orders Breakdown */}
      <OrdersbyDay ordersByDay={ordersByDay} />

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
              // {
              //   type: "number",
              //   min: 0.01,
              //   message: "Amount must be greater than 0",
              // },
            ]}
          >
            <InputNumber
              className="w-full rounded-xl h-11"
              placeholder="Enter payment amount"
              prefix="$"
              // min={0.01}
              // step={0.01}
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
