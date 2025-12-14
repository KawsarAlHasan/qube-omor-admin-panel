import { useState, useEffect, useMemo } from "react";
import {
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Card,
  Divider,
  Tag,
  Space,
  Checkbox,
  Row,
  Col,
  Typography,
  DatePicker,
  Spin,
  Empty,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { API } from "../../api/api";
import { useAllActiveFoods } from "../../api/foodApi";
import { useCheckCoupon } from "../../api/settingsApi";
import dayjs from "dayjs";

const { Text } = Typography;
const { Option } = Select;

function EditFoodOrder({ record, refetch: parentRefetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [form] = Form.useForm();

  // Food items state - each item has its own configuration
  const [foodItems, setFoodItems] = useState([]);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Fetch foods when modal opens
  const { allActiveFoods = [], isLoading: isLoadingFoods } = useAllActiveFoods({
    enabled: isModalOpen,
  });

  // Fetch coupon data when coupon code changes
  const { couponCheck, isLoading: isLoadingCouponCheck } = useCheckCoupon(
    { couponCode: couponCode },
    { enabled: isModalOpen && couponCode?.length > 0 }
  );

  // Handle coupon check result
  useEffect(() => {
    if (couponCheck && couponCode) {
      if (
        couponCheck.isAmount !== undefined ||
        couponCheck.percentage !== undefined
      ) {
        setAppliedCoupon(couponCheck);
      } else {
        setAppliedCoupon(null);
      }
    } else if (!couponCode) {
      setAppliedCoupon(null);
    }
  }, [couponCheck, couponCode]);

  // Initialize form with existing order data
  useEffect(() => {
    if (isModalOpen && record && allActiveFoods.length > 0) {
      // Set basic form fields
      form.setFieldsValue({
        contact_number: record.contact_number,
        order_type: record.order_type,
        status: record.status,
        paid_status: record.paid_status,
        delivery_address: record.delivery_address,
        delivery_date: record.delivery_date
          ? dayjs(record.delivery_date)
          : null,
        date: record.date ? dayjs(record.date) : null,
        coupon_code: record.coupon_code,
      });

      // Set initial coupon code
      if (record.coupon_code) {
        setCouponCode(record.coupon_code);
      }

      // Initialize food items from existing order
      if (record.food && record.food.length > 0) {
        const initialFoodItems = record.food.map((item, index) => {
          // Get the food from allActiveFoods to get total_this_ingredient_in_this_food
          const foodData = allActiveFoods.find((f) => f._id === item.food_id);

          // Build ingredient instances with unique keys based on total_this_ingredient_in_this_food
          let ingredientInstances = [];

          if (foodData && foodData.food_ingredients) {
            foodData.food_ingredients.forEach((ing) => {
              const totalCount = ing.total_this_ingredient_in_this_food || 1;

              // Count how many of this ingredient are in the record's food_ingredients
              const selectedInRecord = (item.food_ingredients || []).filter(
                (fi) => fi._id === ing._id
              ).length;

              for (let i = 0; i < totalCount; i++) {
                // If i < selectedInRecord, it's selected (not removed)
                const isRemoved = i >= selectedInRecord;

                ingredientInstances.push({
                  uniqueKey: `${ing._id}-instance-${i}-${index}`,
                  _id: ing._id,
                  name: ing.ingredient_name,
                  price: ing.price,
                  instanceIndex: i,
                  isRemoved: isRemoved,
                });
              }
            });
          }

          // Build extra ingredient instances
          let extraIngredientInstances = [];
          if (item.extra_Ingredients && item.extra_Ingredients.length > 0) {
            item.extra_Ingredients.forEach((ext, extIdx) => {
              extraIngredientInstances.push({
                uniqueKey: `extra-${ext._id}-${extIdx}-${index}-${Date.now()}`,
                _id: ext._id,
                name: ext.name,
                price: ext.price,
              });
            });
          }

          return {
            key: `existing-${index}-${Date.now()}`,
            food_id: item.food_id,
            food_name: item.food_name,
            food_price: item.food_price,
            food_quantity: item.food_quantity,
            ingredientInstances: ingredientInstances,
            extraIngredientInstances: extraIngredientInstances,
            amount: item.amount,
          };
        });

        setFoodItems(initialFoodItems);
      }
    }
  }, [isModalOpen, record, form, allActiveFoods]);

  // Calculate coupon discount
  const calculateCouponDiscount = (subTotal) => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.isAmount) {
      return appliedCoupon.amount || 0;
    } else if (appliedCoupon.percentage) {
      return (subTotal * appliedCoupon.percentage) / 100;
    }
    return 0;
  };

  // Calculate totals
  const calculations = useMemo(() => {
    let subTotal = 0;
    let totalQuantity = 0;

    foodItems.forEach((item) => {
      const extraTotal = (item.extraIngredientInstances || []).reduce(
        (sum, ing) => sum + (Number(ing.price) || 0),
        0
      );
      const itemAmount =
        item.food_quantity * item.food_price + item.food_quantity * extraTotal;
      subTotal += itemAmount;
      totalQuantity += item.food_quantity;
    });

    const deliveryFee =
      form.getFieldValue("order_type") === "Delivery" ? 3.99 : 0;

    // Calculate coupon discount
    const couponDiscount = calculateCouponDiscount(subTotal);
    const totalPrice = Math.max(0, subTotal + deliveryFee - couponDiscount);

    return {
      subTotal: Number(subTotal.toFixed(2)),
      totalQuantity,
      deliveryFee,
      couponDiscount: Number(couponDiscount.toFixed(2)),
      totalPrice: Number(totalPrice.toFixed(2)),
    };
  }, [foodItems, form, appliedCoupon]);

  // Get food details by ID
  const getFoodById = (foodId) => {
    return allActiveFoods.find((f) => f._id === foodId);
  };

  // Add new food item
  const handleAddFoodItem = () => {
    setFoodItems([
      ...foodItems,
      {
        key: `new-${Date.now()}`,
        food_id: null,
        food_name: null,
        food_price: 0,
        food_quantity: 1,
        ingredientInstances: [],
        extraIngredientInstances: [],
        amount: 0,
      },
    ]);
  };

  // Remove food item
  const handleRemoveFoodItem = (key) => {
    setFoodItems(foodItems.filter((item) => item.key !== key));
  };

  // Handle food selection change
  const handleFoodChange = (key, foodId) => {
    const selectedFood = getFoodById(foodId);
    if (!selectedFood) return;

    // Build ingredient instances based on total_this_ingredient_in_this_food
    let ingredientInstances = [];

    if (selectedFood.food_ingredients) {
      selectedFood.food_ingredients.forEach((ing) => {
        const totalCount = ing.total_this_ingredient_in_this_food || 1;

        for (let i = 0; i < totalCount; i++) {
          ingredientInstances.push({
            uniqueKey: `${ing._id}-instance-${i}-${Date.now()}`,
            _id: ing._id,
            name: ing.ingredient_name,
            price: ing.price,
            instanceIndex: i,
            isRemoved: false, // All selected by default
          });
        }
      });
    }

    setFoodItems(
      foodItems.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            food_id: foodId,
            food_name: selectedFood.food_name,
            food_price: selectedFood.food_price,
            ingredientInstances: ingredientInstances,
            extraIngredientInstances: [],
          };
        }
        return item;
      })
    );
  };

  // Handle quantity change
  const handleQuantityChange = (key, quantity) => {
    setFoodItems(
      foodItems.map((item) => {
        if (item.key === key) {
          return { ...item, food_quantity: quantity || 1 };
        }
        return item;
      })
    );
  };

  // Handle individual ingredient instance toggle
  const handleIngredientInstanceToggle = (itemKey, uniqueKey) => {
    setFoodItems(
      foodItems.map((item) => {
        if (item.key === itemKey) {
          const updatedInstances = item.ingredientInstances.map((inst) => {
            if (inst.uniqueKey === uniqueKey) {
              return { ...inst, isRemoved: !inst.isRemoved };
            }
            return inst;
          });
          return { ...item, ingredientInstances: updatedInstances };
        }
        return item;
      })
    );
  };

  // Handle extra ingredient add
  const handleAddExtraIngredient = (itemKey, ingredientId) => {
    const selectedFood = foodItems.find((f) => f.key === itemKey);
    if (!selectedFood) return;

    const foodData = getFoodById(selectedFood.food_id);
    if (!foodData) return;

    // Find ingredient from food's extra_ingredients
    const ingredientData = (foodData.extra_ingredients || []).find(
      (ing) => ing._id === ingredientId
    );

    if (!ingredientData) return;

    setFoodItems(
      foodItems.map((item) => {
        if (item.key === itemKey) {
          const newExtra = {
            uniqueKey: `extra-${ingredientId}-${Date.now()}-${Math.random()}`,
            _id: ingredientData._id,
            name: ingredientData.ingredient_name,
            price: ingredientData.price,
          };
          return {
            ...item,
            extraIngredientInstances: [
              ...(item.extraIngredientInstances || []),
              newExtra,
            ],
          };
        }
        return item;
      })
    );
  };

  // Handle extra ingredient remove by uniqueKey
  const handleRemoveExtraIngredient = (itemKey, uniqueKey) => {
    setFoodItems(
      foodItems.map((item) => {
        if (item.key === itemKey) {
          return {
            ...item,
            extraIngredientInstances: item.extraIngredientInstances.filter(
              (ext) => ext.uniqueKey !== uniqueKey
            ),
          };
        }
        return item;
      })
    );
  };

  // Get extra ingredient count for an item
  const getExtraCount = (item, ingredientId) => {
    return (item.extraIngredientInstances || []).filter(
      (e) => e._id === ingredientId
    ).length;
  };

  // Calculate single item amount
  const calculateItemAmount = (item) => {
    const extraTotal = (item.extraIngredientInstances || []).reduce(
      (sum, ing) => sum + (Number(ing.price) || 0),
      0
    );
    return (
      item.food_quantity * item.food_price +
      item.food_quantity * extraTotal
    ).toFixed(2);
  };

  // Handle coupon code change
  const handleCouponCodeChange = (e) => {
    const value = e.target.value;
    setCouponCode(value);
    form.setFieldsValue({ coupon_code: value });
  };

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    form.setFieldsValue({ coupon_code: "" });
  };

  // Modal handlers
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFoodItems([]);
    setCouponCode("");
    setAppliedCoupon(null);
    form.resetFields();
  };

  // Submit handler
  const handleFinish = async (values) => {
    if (foodItems.length === 0) {
      message.error("Please add at least one food item");
      return;
    }

    // Validate all food items have selection
    const invalidItems = foodItems.filter((item) => !item.food_id);
    if (invalidItems.length > 0) {
      message.error("Please select food for all items");
      return;
    }

    try {
      setIsUpdating(true);

      // Prepare food array for API
      const foodPayload = foodItems.map((item) => {
        // Build remove_ingredients from instances that are removed
        const removeIngredients = item.ingredientInstances
          .filter((inst) => inst.isRemoved)
          .map((inst) => ({
            _id: inst._id,
            name: inst.name,
          }));

        // Build extra_Ingredients
        const extraIngredients = (item.extraIngredientInstances || []).map(
          (ext) => ({
            _id: ext._id,
            name: ext.name,
            price: ext.price,
          })
        );

        return {
          food_id: item.food_id,
          food_quantity: item.food_quantity,
          extra_Ingredients: extraIngredients,
          remove_ingredients: removeIngredients,
        };
      });

      const payload = {
        delivery_address: values.delivery_address,
        contact_number: values.contact_number,
        order_type: values.order_type,
        status: values.status,
        paid_status: values.paid_status,
        // date: values.date ? values.date.toISOString() : null,
        coupon: couponCode || null,
        food: foodPayload,
        delivery_fee: calculations.deliveryFee,
        sub_total: calculations.subTotal,
        total_price: calculations.totalPrice,
        coupon_discount: calculations.couponDiscount,
        coupon_code: couponCode || null,
        total_quantity: calculations.totalQuantity,
        food_cost: calculations.subTotal,
      };

      await API.put(`/food-order/update/${record?._id}`, payload);
      message.success("Order updated successfully!");
      parentRefetch?.();
      handleCancel();
    } catch (err) {
      console.error("Update error:", err);
      message.error(err.response?.data?.message || "Failed to update Order");
    } finally {
      setIsUpdating(false);
    }
  };

  const isLoading = isLoadingFoods;

  return (
    <div>
      <Button
        className="-ml-1"
        title="Edit Order"
        size="small"
        icon={<EditOutlined />}
        onClick={showModal}
      />

      <Modal
        title={
          <Space>
            <EditOutlined />
            <span>Edit Food Order - #{record?._id?.slice(-8)}</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        styles={{ body: { maxHeight: "90vh", overflowY: "auto" } }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" tip="Loading..." />
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            {/* Customer Info Section */}
            <Card
              size="small"
              title={
                <Text strong>
                  <InfoCircleOutlined /> Customer Information
                </Text>
              }
              className="mb-4"
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Customer Name">
                    <Input value={record?.user?.name} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Email">
                    <Input value={record?.user?.email} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="contact_number"
                    label="Contact Number"
                    rules={[{ required: true, message: "Contact required" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Order Settings Section */}
            <Card
              size="small"
              title={
                <Text strong>
                  <ShoppingCartOutlined /> Order Settings
                </Text>
              }
              className="mb-4"
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    name="order_type"
                    label="Order Type"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="Pickup">Pickup</Option>
                      <Option value="Delivery">Delivery</Option>
                      <Option value="Dine-in">Dine-in</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="Pending">Pending</Option>
                      <Option value="Processing">Processing</Option>
                      <Option value="On Going">On Going</Option>
                      <Option value="Delivered">Delivered</Option>
                      <Option value="Cancelled">Cancelled</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="paid_status"
                    label="Payment Status"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="COD">COD</Option>
                      <Option value="Paid">Paid</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Coupon Code">
                    <Space.Compact className="w-full">
                      <Input
                        placeholder="Enter coupon"
                        value={couponCode}
                        onChange={handleCouponCodeChange}
                        suffix={
                          isLoadingCouponCheck ? (
                            <Spin size="small" />
                          ) : appliedCoupon ? (
                            <CheckCircleOutlined className="text-green-500" />
                          ) : couponCode ? (
                            <CloseCircleOutlined className="text-red-500" />
                          ) : null
                        }
                      />
                      {couponCode && (
                        <Button
                          type="default"
                          danger
                          onClick={handleRemoveCoupon}
                        >
                          Clear
                        </Button>
                      )}
                    </Space.Compact>
                    {appliedCoupon && (
                      <div className="mt-1">
                        <Tag color="green">
                          {appliedCoupon.isAmount
                            ? `$${appliedCoupon.amount} OFF`
                            : `${appliedCoupon.percentage}% OFF`}
                        </Tag>
                      </div>
                    )}
                    {couponCode && !appliedCoupon && !isLoadingCouponCheck && (
                      <div className="mt-1">
                        <Text type="danger" className="text-xs">
                          Invalid coupon code
                        </Text>
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="delivery_address" label="Delivery Address">
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </Col>
                {/* <Col span={6}>
                  <Form.Item name="date" label="Order Date">
                    <DatePicker className="w-full" />
                  </Form.Item>
                </Col> */}
              </Row>
            </Card>

            {/* Food Items Section */}
            <Card
              size="small"
              title={
                <div className="flex justify-between items-center">
                  <Text strong>
                    <ShoppingCartOutlined /> Food Items
                  </Text>
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={handleAddFoodItem}
                    size="small"
                  >
                    Add Food Item
                  </Button>
                </div>
              }
              className="mb-4"
            >
              {foodItems.length === 0 ? (
                <Empty description="No food items added" />
              ) : (
                <div className="space-y-4">
                  {foodItems.map((item, index) => {
                    const selectedFood = getFoodById(item.food_id);

                    return (
                      <Card
                        key={item.key}
                        size="small"
                        className="bg-gray-50"
                        title={
                          <div className="flex justify-between items-center">
                            <Text>Item #{index + 1}</Text>
                            <Popconfirm
                              title="Remove this item?"
                              onConfirm={() => handleRemoveFoodItem(item.key)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                              />
                            </Popconfirm>
                          </div>
                        }
                      >
                        <Row gutter={16}>
                          {/* Food Selection */}
                          <Col span={12}>
                            <div className="mb-2">
                              <Text type="secondary">Select Food:</Text>
                            </div>
                            <Select
                              className="w-full"
                              placeholder="Select food item"
                              value={item.food_id}
                              onChange={(value) =>
                                handleFoodChange(item.key, value)
                              }
                              showSearch
                              optionFilterProp="children"
                            >
                              {allActiveFoods.map((food) => (
                                <Option key={food._id} value={food._id}>
                                  {food.food_name} - ${food.food_price}
                                </Option>
                              ))}
                            </Select>
                          </Col>

                          {/* Quantity */}
                          <Col span={6}>
                            <div className="mb-2">
                              <Text type="secondary">Quantity:</Text>
                            </div>
                            <InputNumber
                              min={1}
                              value={item.food_quantity}
                              onChange={(value) =>
                                handleQuantityChange(item.key, value)
                              }
                              className="w-full"
                            />
                          </Col>

                          {/* Amount */}
                          <Col span={6}>
                            <div className="mb-2">
                              <Text type="secondary">Amount:</Text>
                            </div>
                            <Text strong className="text-lg text-green-600">
                              ${calculateItemAmount(item)}
                            </Text>
                          </Col>
                        </Row>

                        {selectedFood && (
                          <>
                            <Divider className="my-3" />

                            {/* Base Ingredients - Individual Instances */}
                            {item.ingredientInstances &&
                              item.ingredientInstances.length > 0 && (
                                <div className="mb-3">
                                  <Text type="secondary" className="block mb-2">
                                    Base Ingredients (uncheck to remove):
                                  </Text>
                                  <div className="flex flex-wrap gap-2">
                                    {item.ingredientInstances.map((inst) => (
                                      <Checkbox
                                        key={inst.uniqueKey}
                                        checked={!inst.isRemoved}
                                        onChange={() =>
                                          handleIngredientInstanceToggle(
                                            item.key,
                                            inst.uniqueKey
                                          )
                                        }
                                      >
                                        <Tag
                                          color={
                                            inst.isRemoved ? "red" : "blue"
                                          }
                                        >
                                          {inst.name} (${inst.price})
                                          {inst.isRemoved && " - REMOVED"}
                                        </Tag>
                                      </Checkbox>
                                    ))}
                                  </div>
                                </div>
                              )}

                            {/* Extra Ingredients */}
                            {selectedFood.extra_ingredients &&
                              selectedFood.extra_ingredients.length > 0 && (
                                <div className="mb-3">
                                  <Text type="secondary" className="block mb-2">
                                    Extra Ingredients (click + to add):
                                  </Text>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedFood.extra_ingredients.map(
                                      (ing) => {
                                        const count = getExtraCount(
                                          item,
                                          ing._id
                                        );
                                        return (
                                          <div
                                            key={ing._id}
                                            className="flex items-center gap-1 border rounded px-2 py-1 bg-white"
                                          >
                                            <Tag color="green">
                                              {ing.ingredient_name} (+$
                                              {ing.price})
                                            </Tag>
                                            <span className="font-semibold mx-1">
                                              x{count}
                                            </span>
                                            <Button
                                              size="small"
                                              type="primary"
                                              icon={<PlusOutlined />}
                                              onClick={() =>
                                                handleAddExtraIngredient(
                                                  item.key,
                                                  ing._id
                                                )
                                              }
                                            />
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Show current extras with individual remove buttons */}
                            {item.extraIngredientInstances &&
                              item.extraIngredientInstances.length > 0 && (
                                <div className="mt-2">
                                  <Text type="secondary" className="block mb-1">
                                    Selected Extras (click ✕ to remove):
                                  </Text>
                                  <div className="flex flex-wrap gap-1">
                                    {item.extraIngredientInstances.map(
                                      (ext) => (
                                        <Tag
                                          key={ext.uniqueKey}
                                          color="orange"
                                          closable
                                          onClose={() =>
                                            handleRemoveExtraIngredient(
                                              item.key,
                                              ext.uniqueKey
                                            )
                                          }
                                        >
                                          {ext.name} (+${ext.price})
                                        </Tag>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Show removed ingredients summary */}
                            {/* {item.ingredientInstances &&
                              item.ingredientInstances.filter(
                                (i) => i.isRemoved
                              ).length > 0 && (
                                <div className="mt-2">
                                  <Text type="secondary" className="block mb-1">
                                    Removed Ingredients:
                                  </Text>
                                  <div className="flex flex-wrap gap-1">
                                    {item.ingredientInstances
                                      .filter((i) => i.isRemoved)
                                      .map((rem) => (
                                        <Tag key={rem.uniqueKey} color="red">
                                          {rem.name} (Removed)
                                        </Tag>
                                      ))}
                                  </div>
                                </div>
                              )} */}
                          </>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Order Summary */}
            <Card
              size="small"
              title={<Text strong>Order Summary</Text>}
              className="mb-4 bg-blue-50"
            >
              <Row gutter={16}>
                <Col span={4}>
                  <div className="text-center">
                    <Text type="secondary">Total Items</Text>
                    <div>
                      <Text strong className="text-xl">
                        {calculations.totalQuantity}
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col span={5}>
                  <div className="text-center">
                    <Text type="secondary">Subtotal</Text>
                    <div>
                      <Text strong className="text-xl">
                        ${calculations.subTotal}
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col span={5}>
                  <div className="text-center">
                    <Text type="secondary">Delivery Fee</Text>
                    <div>
                      <Text strong className="text-xl">
                        ${calculations.deliveryFee}
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col span={5}>
                  <div className="text-center">
                    <Text type="secondary">Coupon Discount</Text>
                    <div>
                      <Text strong className="text-xl text-red-500">
                        -${calculations.couponDiscount}
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col span={5}>
                  <div className="text-center">
                    <Text type="secondary">Total Price</Text>
                    <div>
                      <Text strong className="text-xl text-green-600">
                        ${calculations.totalPrice}
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={isUpdating}>
                Update Order
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
}

export default EditFoodOrder;
