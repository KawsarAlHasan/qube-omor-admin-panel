import React, { useState } from "react";
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
  Checkbox,
} from "antd";
import {
  PlusOutlined,
  TagOutlined,
  PercentageOutlined,
  DollarOutlined,
  CalendarOutlined,
  CoffeeOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

import { FaSpa, FaHeartbeat } from "react-icons/fa";
import { API } from "../../../api/api";

const { RangePicker } = DatePicker;

function AddCoupon({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const [dateType, setDateType] = useState("Unlimited");
  const [isAmount, setIsAmount] = useState(false);
  const [categories, setCategories] = useState({
    isRestaurant: false,
    isSpa: false,
    isPhysio: false,
    isClasses: false,
  });

  /** Open Modal */
  const openModal = () => setIsModalOpen(true);

  /** Close Modal */
  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setDateType("Unlimited");
    setIsAmount(false);
    setCategories({
      isRestaurant: false,
      isSpa: false,
      isPhysio: false,
      isClasses: false,
    });
  };

  /** Handle Category Change */
  const handleCategoryChange = (category) => {
    setCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  /** Submit Handler */
  const onFinish = async (values) => {
    // Check if at least one category is selected
    const hasCategory = Object.values(categories).some((val) => val === true);
    if (!hasCategory) {
      message.error("Please select at least one category");
      return;
    }

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
        ...categories,
      };

      if (values.dateType === "Single" && values.singleDate) {
        payload.singleDate = values.singleDate.format("YYYY-MM-DD");
      }
      if (values.dateType === "Range" && values.dateRange) {
        payload.startDate = values.dateRange[0].format("YYYY-MM-DD");
        payload.endDate = values.dateRange[1].format("YYYY-MM-DD");
      }

      const res = await API.post("/coupon/create", payload);

      if (res.data.success) {
        message.success("Coupon created successfully!");
        closeModal();
        refetch && refetch();
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* OPEN BUTTON */}
      <Button
        className="my-main-button"
        icon={<PlusOutlined />}
        type="primary"
        onClick={openModal}
      >
        Add New Coupon
      </Button>

      {/* MODAL */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="w-10 h-10 rounded-full my-main-button flex items-center justify-center">
              <TagOutlined className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 m-0">
                Create New Coupon
              </h3>
              <p className="text-sm text-gray-500 m-0">
                Fill the coupon information below
              </p>
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={700}
        centered
        className="coupon-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="mt-6"
          initialValues={{ dateType: "Unlimited" }}
        >
          {/* Coupon Code */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">Coupon Code</span>
            }
            name="code"
            rules={[
              { required: true, message: "Enter coupon code" },
              { min: 3, message: "Minimum 3 characters required" },
            ]}
          >
            <Input
              prefix={<TagOutlined className="text-gray-400" />}
              placeholder="Ex: SUMMER2025"
              className="h-11 rounded-lg"
              size="large"
            />
          </Form.Item>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="font-semibold text-gray-700 block mb-3">
              Select Categories
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Restaurant */}
              <div
                onClick={() => handleCategoryChange("isRestaurant")}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  categories.isRestaurant
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      categories.isRestaurant
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <CoffeeOutlined className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-semibold m-0 ${
                        categories.isRestaurant
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      Restaurant
                    </p>
                    <p className="text-xs text-gray-500 m-0">
                      Food & Beverages
                    </p>
                  </div>
                  <Checkbox checked={categories.isRestaurant} />
                </div>
              </div>

              {/* Spa */}
              <div
                onClick={() => handleCategoryChange("isSpa")}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  categories.isSpa
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      categories.isSpa
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <FaSpa className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-semibold m-0 ${
                        categories.isSpa ? "text-purple-700" : "text-gray-700"
                      }`}
                    >
                      Spa
                    </p>
                    <p className="text-xs text-gray-500 m-0">Spa Services</p>
                  </div>
                  <Checkbox checked={categories.isSpa} />
                </div>
              </div>

              {/* Physio */}
              <div
                onClick={() => handleCategoryChange("isPhysio")}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  categories.isPhysio
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      categories.isPhysio
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <FaHeartbeat className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-semibold m-0 ${
                        categories.isPhysio ? "text-green-700" : "text-gray-700"
                      }`}
                    >
                      Physio
                    </p>
                    <p className="text-xs text-gray-500 m-0">Physio Services</p>
                  </div>
                  <Checkbox checked={categories.isPhysio} />
                </div>
              </div>

              {/* Classes */}
              <div
                onClick={() => handleCategoryChange("isClasses")}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  categories.isClasses
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      categories.isClasses
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <TrophyOutlined className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-semibold m-0 ${
                        categories.isClasses
                          ? "text-orange-700"
                          : "text-gray-700"
                      }`}
                    >
                      Classes
                    </p>
                    <p className="text-xs text-gray-500 m-0">
                      Fitness & Training
                    </p>
                  </div>
                  <Checkbox checked={categories.isClasses} />
                </div>
              </div>
            </div>
          </div>

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
                      ? "Discount given in amount value"
                      : "Discount given in percentage"}
                  </p>
                </div>
              </div>

              <Switch
                checked={isAmount}
                onChange={setIsAmount}
                className="bg-gray-300"
              />
            </div>
          </div>

          {/* Discount Value */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">
                {isAmount ? "Discount Amount" : "Discount Percentage (%)"}
              </span>
            }
            name="discountValue"
            rules={[
              { required: true, message: "Enter discount amount" },
              {
                type: "number",
                min: isAmount ? 1 : 1,
                max: isAmount ? 100000 : 100,
                message: isAmount
                  ? "Amount must be between 1 and 100000"
                  : "Percentage must be between 1% and 100%",
              },
            ]}
          >
            <InputNumber
              prefix={isAmount ? "$" : "%"}
              placeholder={isAmount ? "100" : "20"}
              className="w-full h-11 rounded-lg"
              size="large"
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
                  className="text-center h-auto rounded-lg"
                >
                  <CalendarOutlined className="block text-xl mb-1" />
                  <span className="block font-medium">Unlimited</span>
                </Radio.Button>
                <Radio.Button
                  value="Single"
                  className="text-center h-auto rounded-lg"
                >
                  <CalendarOutlined className="block text-xl mb-1" />
                  <span className="block font-medium">Single Date</span>
                </Radio.Button>
                <Radio.Button
                  value="Range"
                  className="text-center h-auto rounded-lg"
                >
                  <CalendarOutlined className="block text-xl mb-1" />
                  <span className="block font-medium">Date Range</span>
                </Radio.Button>
              </div>
            </Radio.Group>
          </Form.Item>

          {/* Single Date */}
          {dateType === "Single" && (
            <Form.Item
              label={
                <span className="font-semibold text-gray-700">Select Date</span>
              }
              name="singleDate"
              rules={[{ required: true, message: "Select a date" }]}
            >
              <DatePicker
                className="w-full h-11 rounded-lg"
                size="large"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          )}

          {/* Range Date */}
          {dateType === "Range" && (
            <Form.Item
              label={
                <span className="font-semibold text-gray-700">
                  Select Date Range
                </span>
              }
              name="dateRange"
              rules={[{ required: true, message: "Select date range" }]}
            >
              <RangePicker
                className="w-full h-11 rounded-lg"
                size="large"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2.5 my-main-button rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Coupon"}
            </button>
          </div>
        </Form>
      </Modal>

      {/* Custom Styling */}
      <style>{`
        .coupon-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
        }
        .coupon-modal .ant-modal-header {
          background: linear-gradient(to right, #eff6ff, #faf5ff);
          padding: 24px;
          border-bottom: none;
        }
        .coupon-modal .ant-radio-button-wrapper-checked {
          border-color: #2563eb !important;
        }
        .coupon-modal .ant-radio-button-wrapper {
          border: 2px solid #e5e7eb;
        }
        .coupon-modal .ant-switch-checked {
          background: linear-gradient(to right, #2563eb, #9333ea) !important;
        }
        .coupon-modal .ant-checkbox-checked .ant-checkbox-inner {
          background-color: transparent;
          border-color: currentColor;
        }
      `}</style>
    </>
  );
}

export default AddCoupon;
