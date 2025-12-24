import { Card, Empty, Tag, Timeline, Typography } from "antd";
import { DollarOutlined, HistoryOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

function PaymentHistory({ payments }) {
  return (
    <div>
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
          <div className="max-h-[460px] overflow-y-auto p-4">
            <Timeline
              items={[...payments].reverse().map((payment) => ({
                dot: (
                  <div
                    className={`w-8 h-8 ${
                      payment.amount < 0 ? "bg-red-600" : "bg-emerald-600"
                    } rounded-full flex items-center justify-center`}
                  >
                    <DollarOutlined className="text-white text-sm" />
                  </div>
                ),
                children: (
                  <div className="ml-2 pb-4">
                    <div className="flex items-center justify-between">
                      <Text
                        strong
                        className={`text-lg ${
                          payment.amount < 0 ? "text-red-600" : "text-emerald-600"
                        }`}
                      >
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
                      <Text type="secondary" className="text-xs italic block">
                        {payment.note}
                      </Text>
                    )}
                  </div>
                ),
              }))}
            />
          </div>
        ) : (
          <Empty
            description="No payments recorded yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
}

export default PaymentHistory;