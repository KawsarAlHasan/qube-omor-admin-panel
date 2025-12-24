import {
  Button,
  Col,
  DatePicker,
  Form,
  InputNumber,
  message,
  Modal,
  Row,
  Typography,
} from "antd";
import { DollarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState } from "react";
import { API } from "../../../../api/api";

const { Text } = Typography;

function AdminReturnMoney({ summary, driverId, refetch }) {
  const [isPaidModalOpen, setIsPaidModalOpen] = useState(false);
  const [isStatusChangeLoading, setIsStatusChangeLoading] = useState(false);
  const [form] = Form.useForm();

  const openPaidModal = () => {
    form.setFieldsValue({
      amount: "",
      date: dayjs(),
      notes: "",
    });
    setIsPaidModalOpen(true);
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
        amount: Number(-amount),
        date: date.format("YYYY-MM-DD"),
      });

      message.success("Return recorded successfully!");
      setIsPaidModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Failed to record return");
    } finally {
      setIsStatusChangeLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsPaidModalOpen(false);
    form.resetFields();
  };

  // Check if admin owes driver (negative adminReceivable)
  const adminOwesDriver = (summary?.adminReceivable || 0) < 0;
  const absoluteReceivable = Math.abs(summary?.adminReceivable || 0);

  return (
    <div>
      <Button
        danger
        type="default"
        size="large"
        icon={<DollarOutlined />}
        onClick={openPaidModal}
        className=" transition-all rounded-xl h-12 px-6"
      >
        Return Money
      </Button>

      {/* Pay Driver Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarOutlined className="text-emerald-600 text-xl" />
            </div>
            <div>
              <Text strong className="block">
                Record Payment
              </Text>
              <Text type="secondary" className="text-xs">
                Return Money from admin to driver
              </Text>
            </div>
          </div>
        }
        open={isPaidModalOpen}
        onOk={handlePaidAmountChange}
        onCancel={handleModalCancel}
        confirmLoading={isStatusChangeLoading}
        okText="Submit Return"
        okButtonProps={{
          className: "my-main-button border-0 rounded-xl h-10",
          icon: <DollarOutlined />,
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
            label={<Text strong>Return Date</Text>}
            rules={[{ required: true, message: "Please select return date" }]}
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
            label={<Text strong>Return Amount</Text>}
            rules={[
              { required: true, message: "Please enter return amount" },
              {
                type: "number",
                min: 0.01,
                message: "Amount must be greater than 0",
              },
            ]}
          >
            <InputNumber
              className="w-full rounded-xl h-11"
              placeholder="Enter return amount"
              prefix="$"
              min={0.01}
              step={0.01}
              precision={2}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminReturnMoney;
