import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  DatePicker,
  Radio,
  Space,
  Statistic,
  Spin,
  Alert,
  Row,
  Col,
  Tag,
  Progress,
  message,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TruckOutlined,
  ShopOutlined,
  PercentageOutlined,
  WalletOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useAnalytics } from "../../api/settingsApi";
import LastOrdersCard from "./LastOrdersCard";
import { API } from "../../api/api";

const { RangePicker } = DatePicker;

// Color palette for charts
const COLORS = {
  primary: "#1890ff",
  success: "#52c41a",
  warning: "#faad14",
  danger: "#f5222d",
  purple: "#722ed1",
  cyan: "#13c2c2",
  magenta: "#eb2f96",
  orange: "#fa8c16",
};

function EarningsGrowth() {
  const [dateRange, setDateRange] = useState("1m");
  const [customRange, setCustomRange] = useState(null);
  const [dateParams, setDateParams] = useState({
    startDate: null,
    endDate: null,
  });

  // Calculate dates based on selected range
  useEffect(() => {
    let startDate, endDate;
    const today = new Date();
    endDate = today;

    switch (dateRange) {
      case "Today":
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "1w":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case "1m":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "3m":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "6m":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 6);
        break;
      case "1y":
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
    }

    setDateParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }, [dateRange]);

  // Handle custom date range
  const handleCustomRange = (dates) => {
    if (dates) {
      const startDate = dates[0].toDate();
      const endDate = dates[1].toDate();

      setCustomRange([startDate, endDate]);
      setDateRange("custom");

      setDateParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    } else {
      setCustomRange(null);
      setDateRange("1m");
    }
  };

  // Use the analytics hook with dynamic dates
  const { analyticsData, isLoading, isError, error, refetch } =
    useAnalytics(dateParams);

  // Format chart data from API response
  const formatChartData = (data) => {
    if (!data || !data.chartData || !Array.isArray(data.chartData)) {
      console.log("No chart data found");
      return [];
    }

    return data.chartData.map((item) => ({
      date: item.date,
      earnings: item.earnings || 0,
      orders: item.orders || 0,
      items: item.items || 0,
    }));
  };

  // Calculate stats from API data
  const calculateStats = () => {
    if (!analyticsData) {
      return {
        totalEarnings: 0,
        totalOrders: 0,
        totalItems: 0,
        avgOrderValue: 0,
        totalFoodCost: 0,
        totalDeliveryFee: 0,
        profit: 0,
        profitMargin: 0,
        growthPercentage: 0,
        isPositiveGrowth: true,
        period: "1 month",
        chartData: [],
        paymentMethods: [],
        orderStatus: [],
      };
    }

    const summary = analyticsData.summary || {};
    const chartData = formatChartData(analyticsData);
    const paymentMethods = analyticsData.paymentMethods || [];
    const orderStatus = analyticsData.orderStatus || [];

    // Calculate growth from chart data
    let growthPercentage = 0;
    if (chartData && chartData.length > 1) {
      const dataWithEarnings = chartData.filter((item) => item.earnings > 0);

      if (dataWithEarnings.length >= 2) {
        const midPoint = Math.ceil(dataWithEarnings.length / 2);
        const firstHalf = dataWithEarnings.slice(0, midPoint);
        const secondHalf = dataWithEarnings.slice(midPoint);

        const firstAvg =
          firstHalf.reduce((sum, item) => sum + item.earnings, 0) /
          firstHalf.length;
        const secondAvg =
          secondHalf.reduce((sum, item) => sum + item.earnings, 0) /
          secondHalf.length;

        if (firstAvg > 0) {
          growthPercentage = ((secondAvg - firstAvg) / firstAvg) * 100;
        }
      }
    }

    // Calculate period label
    let period = "";
    if (dateRange === "1w") period = "1 week";
    else if (dateRange === "1m") period = "1 month";
    else if (dateRange === "3m") period = "3 months";
    else if (dateRange === "6m") period = "6 months";
    else if (dateRange === "1y") period = "1 year";
    else if (dateRange === "custom") {
      const days = chartData.length;
      period =
        days <= 7
          ? `${days} days`
          : days <= 30
          ? `${Math.round(days / 7)} weeks`
          : `${Math.round(days / 30)} months`;
    }

    return {
      totalEarnings: summary.totalEarnings || 0,
      totalOrders: summary.totalOrders || 0,
      totalItems: summary.totalItems || 0,
      avgOrderValue: summary.avgOrderValue || 0,
      totalFoodCost: summary.totalFoodCost || 0,
      totalDeliveryFee: summary.totalDeliveryFee || 0,
      profit: summary.profit || 0,
      profitMargin: summary.profitMargin || 0,
      growthPercentage: growthPercentage,
      isPositiveGrowth: growthPercentage >= 0,
      period,
      chartData,
      paymentMethods,
      orderStatus,
    };
  };

  const stats = calculateStats();

  // Format tooltip for chart
  const formatTooltip = (value, name) => {
    if (name === "earnings") {
      return [`$${value.toLocaleString()}`, "Earnings"];
    }
    if (name === "items") {
      return [value, "Items"];
    }
    return [value, name];
  };

  // Format X-axis dates
  const formatXAxis = (value) => {
    try {
      const date = new Date(value);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return value;
    }
  };

  // Format Y-axis values
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircleOutlined style={{ color: COLORS.success }} />;
      case "On Going":
        return <SyncOutlined spin style={{ color: COLORS.warning }} />;
      case "Pending":
        return <ClockCircleOutlined style={{ color: COLORS.primary }} />;
      default:
        return null;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "On Going":
        return "processing";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await API.get(
        `/settings/analytics/download-pdf?startDate=${dateParams.startDate}&endDate=${dateParams.endDate}`,
        {
          responseType: "blob",
        }
      );

      console.log("XLSX Response:", response);

      const contentDisposition = response.headers["content-disposition"];
      let filename = `analytics-report-${dateParams.startDate}-to-${dateParams.endDate}.xlsx`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const blob = new Blob([response.data], { type: "application/xlsx" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);

      // Better error handling
      if (error.response) {
        console.error(
          "Response error:",
          error.response.status,
          error.response.data
        );
        message.error(
          `XLSX download failed: ${error.response.status} - ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else if (error.request) {
        console.error("Request error:", error.request);
        message.error("XLSX download failed: No response from server");
      } else {
        console.error("Error:", error.message);
        message.error("XLSX download failed: " + error.message);
      }
    }
  };

  if (isError) {
    return (
      <div className="p-4">
        <Alert
          message="Error Loading Analytics"
          description={error?.message || "Failed to fetch analytics data"}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="">
      <div className="">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Restaurant Analytics
          </h1>

          <Space direction="horizontal" size="middle">
            <Radio.Group
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              buttonStyle="solid"
              disabled={isLoading}
            >
              <Radio.Button value="Today">Today</Radio.Button>
              <Radio.Button value="1w">1W</Radio.Button>
              <Radio.Button value="1m">1M</Radio.Button>
              <Radio.Button value="3m">3M</Radio.Button>
              <Radio.Button value="6m">6M</Radio.Button>
              <Radio.Button value="1y">1Y</Radio.Button>
            </Radio.Group>

            <RangePicker
              onChange={handleCustomRange}
              format="YYYY-MM-DD"
              placeholder={["Start Date", "End Date"]}
              disabled={isLoading}
              value={
                customRange
                  ? [dayjs(customRange[0]), dayjs(customRange[1])]
                  : null
              }
            />

            <button
              onClick={downloadPDF}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Report
            </button>
          </Space>
        </div>

        {/* Key Metrics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <Statistic
                title={
                  <>
                    <DollarOutlined /> Total Earnings
                  </>
                }
                value={stats.totalEarnings}
                precision={2}
                valueStyle={{ color: COLORS.success }}
                prefix="$"
                loading={isLoading}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <Statistic
                title={
                  <>
                    <ShoppingCartOutlined /> Total Orders
                  </>
                }
                value={stats.totalOrders}
                precision={0}
                valueStyle={{ color: COLORS.primary }}
                loading={isLoading}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <Statistic
                title={
                  <>
                    <ShopOutlined /> Total Items
                  </>
                }
                value={stats.totalItems}
                precision={0}
                valueStyle={{ color: COLORS.purple }}
                loading={isLoading}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <Statistic
                title={
                  <>
                    <WalletOutlined /> Avg Order Value
                  </>
                }
                value={stats.avgOrderValue}
                precision={2}
                valueStyle={{ color: COLORS.orange }}
                prefix="$"
                loading={isLoading}
              />
            </Card>
          </Col>
        </Row>

        {/* Financial Metrics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <Statistic
                title="Total Food Cost"
                value={stats.totalFoodCost}
                precision={2}
                valueStyle={{ color: COLORS.danger }}
                prefix="$"
                loading={isLoading}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <Statistic
                title={
                  <>
                    <TruckOutlined /> Delivery Fee
                  </>
                }
                value={stats.totalDeliveryFee}
                precision={2}
                valueStyle={{ color: COLORS.cyan }}
                prefix="$"
                loading={isLoading}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <Statistic
                title="Net Profit"
                value={stats.profit}
                precision={2}
                valueStyle={{
                  color: stats.profit > 0 ? COLORS.success : COLORS.danger,
                }}
                prefix="$"
                loading={isLoading}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <Statistic
                title={
                  <>
                    <PercentageOutlined /> Profit Margin
                  </>
                }
                value={stats.profitMargin}
                precision={2}
                valueStyle={{
                  color:
                    stats.profitMargin > 10
                      ? COLORS.success
                      : stats.profitMargin > 5
                      ? COLORS.warning
                      : COLORS.danger,
                }}
                suffix="%"
                loading={isLoading}
              />
            </Card>
          </Col>
        </Row>

        {/* Growth Card */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col span={24}>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <Row align="middle" justify="space-between">
                <Col>
                  <Statistic
                    title={`Growth Rate (${stats.period})`}
                    value={Math.abs(stats.growthPercentage)}
                    precision={2}
                    valueStyle={{
                      color: stats.isPositiveGrowth
                        ? COLORS.success
                        : COLORS.danger,
                      fontSize: "28px",
                    }}
                    prefix={
                      stats.isPositiveGrowth ? (
                        <ArrowUpOutlined />
                      ) : (
                        <ArrowDownOutlined />
                      )
                    }
                    suffix="%"
                    loading={isLoading}
                  />
                </Col>
                <Col>
                  <Tag
                    color={stats.isPositiveGrowth ? "success" : "error"}
                    style={{ fontSize: "16px", padding: "8px 16px" }}
                  >
                    {stats.isPositiveGrowth
                      ? "Positive Growth"
                      : "Negative Growth"}
                  </Tag>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Main Chart */}
        <Card
          title="Earnings Over Time"
          className="shadow-lg mb-6"
          extra={
            isLoading && (
              <Space>
                <Spin size="small" />
                <span className="text-gray-500">Loading...</span>
              </Space>
            )
          }
        >
          <div className="h-80 md:h-96">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Spin size="large" />
              </div>
            ) : stats.chartData && stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatXAxis} />
                  <YAxis tickFormatter={formatYAxis} />
                  <Tooltip
                    formatter={formatTooltip}
                    labelFormatter={(value) => {
                      try {
                        return `Date: ${new Date(value).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}`;
                      } catch (error) {
                        return `Date: ${value}`;
                      }
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke={COLORS.primary}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                    name="Earnings"
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke={COLORS.success}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                    name="Orders"
                  />
                  <Line
                    type="monotone"
                    dataKey="items"
                    stroke={COLORS.purple}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                    name="Items"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  No data available for the selected period
                </p>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {/* Order Status and Payment Methods */}
          <Card
            title="Order Status Distribution"
            className="shadow-lg"
            loading={isLoading}
          >
            {stats.orderStatus && stats.orderStatus.length > 0 ? (
              <>
                <div className="space-y-3">
                  {stats.orderStatus.map((status, index) => (
                    <div
                      key={status._id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status._id)}
                        <Tag color={getStatusColor(status._id)}>
                          {status._id}
                        </Tag>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ${status.total.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {status.count} orders
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No order status data available
              </div>
            )}
          </Card>

          {/* Last orders */}
          <LastOrdersCard
            ordersList={analyticsData?.ordersList}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default EarningsGrowth;
