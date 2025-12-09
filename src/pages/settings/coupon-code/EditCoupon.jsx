import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Radio,
  DatePicker,
  Switch,
  InputNumber,
  message,
  Button,
} from "antd";
import {
  EditOutlined,
  TagOutlined,
  PercentageOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { API } from "../../../api/api";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

function EditCoupon({ record, refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [dateType, setDateType] = useState(record?.dateType || "Unlimited");
  const [isAmount, setIsAmount] = useState(record?.isAmount || false);

  // Prefill form when modal opens
  const openModal = () => {
    const initialData = {
      code: record.code,
      discountValue: record.isAmount ? record.amount : record.percentage,
      dateType: record.dateType,
      singleDate: record.singleDate ? dayjs(record.singleDate) : null,
      dateRange:
        record.startDate && record.endDate
          ? [dayjs(record.startDate), dayjs(record.endDate)]
          : null,
    };

    form.setFieldsValue(initialData);
    setDateType(record.dateType);
    setIsAmount(record.isAmount);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        code: values.code,
        isAmount: isAmount,
        amount: isAmount ? values.discountValue : 0,
        percentage: !isAmount ? values.discountValue : 0,
        dateType: values.dateType,
        startDate: null,
        endDate: null,
        singleDate: null,
      };

      if (values.dateType === "Single" && values.singleDate) {
        payload.singleDate = values.singleDate.format("YYYY-MM-DD");
      } else if (values.dateType === "Range" && values.dateRange) {
        payload.startDate = values.dateRange[0].format("YYYY-MM-DD");
        payload.endDate = values.dateRange[1].format("YYYY-MM-DD");
      }

      const res = await API.put(`/coupon/update/${record._id}`, payload);

      message.success("Coupon updated successfully!");
      closeModal();
      refetch?.();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Edit Button */}
      <Button
        type="primary"
        size="small"
        icon={<EditOutlined />}
        onClick={openModal}
        className="my-main-button"
      >
        Edit
      </Button>

      {/* Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="w-10 h-10 rounded-full my-main-button flex items-center justify-center">
              <EditOutlined className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 m-0">
                Edit Coupon
              </h3>
              <p className="text-sm text-gray-500 m-0">
                Update coupon information
              </p>
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={650}
        centered
        className="coupon-modal"
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            dateType: record.dateType,
          }}
          className="mt-6"
        >
          {/* Code */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">Coupon Code</span>
            }
            name="code"
            rules={[
              { required: true, message: "Coupon code is required" },
              { min: 3, message: "Minimum 3 characters" },
            ]}
          >
            <Input
              prefix={<TagOutlined className="text-gray-400" />}
              placeholder="Example: SUMMER2025"
              size="large"
              className="h-11 rounded-lg"
            />
          </Form.Item>

          {/* Discount Type Switch */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isAmount ? (
                  <DollarOutlined className="text-2xl text-green-600" />
                ) : (
                  <PercentageOutlined className="text-2xl text-blue-600" />
                )}
                <div>
                  <p className="font-semibold text-gray-800 m-0">
                    {isAmount ? "Fixed Amount" : "Percentage Discount"}
                  </p>
                  <p className="text-sm text-gray-600 m-0">
                    {isAmount
                      ? "Apply discount in amount"
                      : "Apply discount in percentage"}
                  </p>
                </div>
              </div>
              <Switch checked={isAmount} onChange={setIsAmount} />
            </div>
          </div>

          {/* Discount Value */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">
                {isAmount ? "Discount Amount" : "Discount Percentage"}
              </span>
            }
            name="discountValue"
            rules={[{ required: true, message: "Discount value is required" }]}
          >
            <InputNumber
              size="large"
              className="w-full h-11 rounded-lg"
              min={1}
              max={isAmount ? 100000 : 100}
              placeholder={isAmount ? "1000" : "20"}
            />
          </Form.Item>

          {/* Date Type */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">Date Type</span>
            }
            name="dateType"
          >
            <Radio.Group
              onChange={(e) => setDateType(e.target.value)}
              className="w-full"
              size="large"
            >
              <div className="grid grid-cols-3 gap-3">
                <Radio.Button
                  value="Unlimited"
                  className="rounded-lg text-center"
                >
                  <CalendarOutlined className="text-xl mb-1 block" />
                  Unlimited
                </Radio.Button>

                <Radio.Button value="Single" className="rounded-lg text-center">
                  <CalendarOutlined className="text-xl mb-1 block" />
                  Single Date
                </Radio.Button>

                <Radio.Button value="Range" className="rounded-lg text-center">
                  <CalendarOutlined className="text-xl mb-1 block" />
                  Date Range
                </Radio.Button>
              </div>
            </Radio.Group>
          </Form.Item>

          {/* Single Date */}
          {dateType === "Single" && (
            <Form.Item
              name="singleDate"
              label={
                <span className="font-semibold text-gray-700">Select Date</span>
              }
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker
                size="large"
                className="w-full h-11 rounded-lg"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          )}

          {/* Date Range */}
          {dateType === "Range" && (
            <Form.Item
              name="dateRange"
              label={
                <span className="font-semibold text-gray-700">Date Range</span>
              }
              rules={[{ required: true, message: "Please select date range" }]}
            >
              <RangePicker
                size="large"
                className="w-full h-11 rounded-lg"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 my-main-button rounded-lg transition shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Coupon"}
            </button>
          </div>
        </Form>
      </Modal>

      {/* Modal Styling */}
      <style>{`
        .coupon-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
        }
        .coupon-modal .ant-radio-button-wrapper-checked {
        //   background: linear-gradient(to right, #2563eb, #9333ea) !important;
          border-color: #2563eb !important;
        //   color: green !important;
        }
      `}</style>
    </>
  );
}

export default EditCoupon;
