import { Card, Tag, Row, Col, Typography } from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
  BankOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

function FinancialSummary({ summary }) {
  // Check if admin owes driver (negative adminReceivable)
  const adminOwesDriver = (summary?.adminReceivable || 0) < 0;
  const absoluteReceivable = Math.abs(summary?.adminReceivable || 0);

  return (
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
                <Text className="text-slate-400 text-xs">Paid & Delivered</Text>
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
  );
}

export default FinancialSummary;
