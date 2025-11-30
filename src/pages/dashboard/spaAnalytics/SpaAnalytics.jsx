import { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  Space,
  Statistic,
  Alert,
  Row,
  Col,
  Tag,
  message,
  Tabs,
  Badge,
} from "antd";
import {
  DollarOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  TeamOutlined,
  FireOutlined,
  ScheduleOutlined,
  WalletOutlined,
  PercentageOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useSpaAnalytics } from "../../../api/settingsApi";
import CreditPurchases from "./CreditPurchases";
import TopCreditBuyers from "./TopCreditBuyers";
import RecentBookings from "./RecentBookings";
import DateSelect from "../../../components/DateSelect";
const { TabPane } = Tabs;

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
  lime: "#a0d911",
  gold: "#faad14",
};

// SpaAnalytics component
function SpaAnalytics({ selectType }) {
  const [dateRange, setDateRange] = useState({
    start_date: null,
    end_date: null,
  });

  const type =
    selectType == "spa" ? "Spa" : selectType == "physio" ? "Physio" : null;

  // Use the analytics hook with dynamic dates
  const { spaAnalyticsData, isLoading, isError, error, refetch } =
    useSpaAnalytics({
      startDate: dateRange.start_date,
      endDate: dateRange.end_date,
      type: type,
    });

  const handleApply = (dates) => {
    setDateRange({
      start_date: dates.startDate,
      end_date: dates.endDate,
    });
  };

  // Format chart data
  const formatChartData = (data) => {
    if (!data || !data.chartData || !Array.isArray(data.chartData)) {
      return [];
    }
    return data.chartData.map((item) => ({
      date: item.date,
      bookings: item.bookings || 0,
      totalCredits: item.totalCredits || 0,
      uniqueUsers: item.uniqueUsers || 0,
      spaBookings: item.spaBookings || 0,
      physioBookings: item.physioBookings || 0,
    }));
  };

  // Calculate stats from API data
  const calculateStats = () => {
    if (!spaAnalyticsData) {
      return {
        summary: {
          totalBookings: 0,
          totalCreditsUsed: 0,
          uniqueUsers: 0,
          uniqueServices: 0,
          avgBookingsPerUser: 0,
        },
        creditSummary: {
          totalCreditsPurchased: 0,
          totalRevenue: 0,
          totalTransactions: 0,
          avgCreditPerPurchase: 0,
          avgPricePerPurchase: 0,
          creditUtilizationRate: 0,
        },
        typeComparison: { spa: null, physio: null },
        chartData: [],
        topCreditBuyers: [],
        recentBookings: [],
        recentCreditPurchases: [],
      };
    }

    return {
      summary: spaAnalyticsData.summary || {},
      creditSummary: spaAnalyticsData.creditSummary || {},
      typeComparison: spaAnalyticsData.typeComparison || {
        spa: null,
        physio: null,
      },
      chartData: formatChartData(spaAnalyticsData),
      topCreditBuyers: spaAnalyticsData.topCreditBuyers || [],
      recentBookings: spaAnalyticsData.recentBookings || [],
      recentCreditPurchases: spaAnalyticsData.recentCreditPurchases || [],
    };
  };

  const stats = calculateStats();

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

  // excel download
  const downloadPDF = async () => {
    try {
      const response = await API.get(
        `/settings/spa-analytics/download-pdf?startDate=${dateRange.start_date}&endDate=${dateRange.end_date}`,
        {
          responseType: "blob",
        }
      );

      console.log("XLSX Response:", response);

      const contentDisposition = response.headers["content-disposition"];
      let filename = `${type}-analytics-report-${dateRange.start_date}-to-${dateRange.end_date}.xlsx`;

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
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {selectType === "spa" ? "Spa" : "Physio"} Analytics
        </h1>

        <Space direction="horizontal" size="middle" wrap>
          <DateSelect
            initialRange="1m"
            onApply={handleApply}
            isLoading={isLoading}
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

      {/* Main Summary Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <Statistic
              title={
                <span className="flex items-center gap-2">
                  <CalendarOutlined /> Total Bookings
                </span>
              }
              value={stats.summary.totalBookings}
              valueStyle={{ color: COLORS.primary }}
              loading={isLoading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <Statistic
              title={
                <span className="flex items-center gap-2">
                  <CreditCardOutlined /> Credits Used
                </span>
              }
              value={stats.summary.totalCreditsUsed}
              valueStyle={{ color: COLORS.purple }}
              loading={isLoading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <Statistic
              title={
                <span className="flex items-center gap-2">
                  <TeamOutlined /> Unique Users
                </span>
              }
              value={stats.summary.uniqueUsers}
              valueStyle={{ color: COLORS.success }}
              loading={isLoading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
            <Statistic
              title={
                <span className="flex items-center gap-2">
                  <RiseOutlined /> Avg Bookings/User
                </span>
              }
              value={stats.summary.avgBookingsPerUser}
              precision={2}
              valueStyle={{ color: COLORS.orange }}
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>

      {/* Credit Summary Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Credits Purchased"
              value={stats.creditSummary.totalCreditsPurchased}
              valueStyle={{ color: COLORS.cyan }}
              prefix={<WalletOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Revenue"
              value={stats.creditSummary.totalRevenue}
              precision={2}
              valueStyle={{ color: COLORS.success }}
              prefix={<DollarOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Transactions"
              value={stats.creditSummary.totalTransactions}
              valueStyle={{ color: COLORS.primary }}
              loading={isLoading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Credit Utilization"
              value={stats.creditSummary.creditUtilizationRate}
              precision={2}
              valueStyle={{
                color:
                  stats.creditSummary.creditUtilizationRate > 70
                    ? COLORS.success
                    : stats.creditSummary.creditUtilizationRate > 40
                    ? COLORS.warning
                    : COLORS.danger,
              }}
              prefix={<PercentageOutlined />}
              suffix="%"
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>

      {/* Type Comparison (Spa vs Physio) - Only show when no filter */}
      {!selectType && stats.typeComparison && (
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} md={12}>
            <Card
              title={
                <span className="flex items-center gap-2">
                  🧖 Spa Statistics
                </span>
              }
              className="shadow-lg border-t-4 border-t-blue-500"
              loading={isLoading}
            >
              {stats.typeComparison.spa ? (
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="Bookings"
                      value={stats.typeComparison.spa.totalBookings}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Credits"
                      value={stats.typeComparison.spa.totalCredits}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Unique Users"
                      value={stats.typeComparison.spa.uniqueUsers}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Avg Credits/Booking"
                      value={stats.typeComparison.spa.avgCreditsPerBooking}
                      precision={2}
                    />
                  </Col>
                </Row>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No Spa data available
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <span className="flex items-center gap-2">
                  💆 Physio Statistics
                </span>
              }
              className="shadow-lg border-t-4 border-t-green-500"
              loading={isLoading}
            >
              {stats.typeComparison.physio ? (
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="Bookings"
                      value={stats.typeComparison.physio.totalBookings}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Credits"
                      value={stats.typeComparison.physio.totalCredits}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Unique Users"
                      value={stats.typeComparison.physio.uniqueUsers}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Avg Credits/Booking"
                      value={stats.typeComparison.physio.avgCreditsPerBooking}
                      precision={2}
                    />
                  </Col>
                </Row>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No Physio data available
                </div>
              )}
            </Card>
          </Col>
        </Row>
      )}

      {/* Main Bookings Chart */}
      <Card
        title="📈 Bookings Over Time"
        className="shadow-lg mb-6"
        loading={isLoading}
      >
        <div className="h-80">
          {stats.chartData && stats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorBookings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={COLORS.primary}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.purple}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.purple}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatXAxis} />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) =>
                    `Date: ${dayjs(value).format("MMM DD, YYYY")}`
                  }
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke={COLORS.primary}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                  name="Bookings"
                />
                <Area
                  type="monotone"
                  dataKey="totalCredits"
                  stroke={COLORS.purple}
                  fillOpacity={1}
                  fill="url(#colorCredits)"
                  name="Credits Used"
                />
              </AreaChart>
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

      {/* Tables Section */}
      <Tabs defaultActiveKey="1" className="mb-6">
        <TabPane
          tab={
            <span>
              <ScheduleOutlined /> Recent Bookings
            </span>
          }
          key="2"
        >
          <RecentBookings
            dataSource={stats.recentBookings}
            isLoading={isLoading}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <CreditCardOutlined /> Credit Purchases
            </span>
          }
          key="3"
        >
          <CreditPurchases
            dataSource={stats.recentCreditPurchases}
            isLoading={isLoading}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <FireOutlined /> Top Credit Buyers
            </span>
          }
          key="4"
        >
          <TopCreditBuyers
            dataSource={stats.topCreditBuyers}
            loading={isLoading}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default SpaAnalytics;
