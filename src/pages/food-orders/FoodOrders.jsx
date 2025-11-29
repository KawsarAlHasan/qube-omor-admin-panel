import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Modal, Select, message, Input } from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { EditOutlined } from "@ant-design/icons";
import { API } from "../../api/api";
import FoodOrderDetails from "./FoodOrderDetails";
import { useLocation, useNavigate } from "react-router-dom";
import { useAllFoodOrders } from "../../api/foodApi";
import { useUsersList } from "../../api/userApi";
import driverIcon from "../../assets/icons/driverIcon.png";
import userIcon from "../../assets/icons/userIcon.png";

const { Search } = Input;

function FoodOrders() {
  const [searchText, setSearchText] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Get current filter from URL
  const queryParams = new URLSearchParams(location.search);
  const currentFilter = queryParams.get("filter") || "All";

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    status: currentFilter,
    search: searchText,
  });

  // Sync filter status with URL parameter
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      status: currentFilter,
      page: 1, // Reset to first page when filter changes
    }));
  }, [currentFilter]);

  // Driver assignment modal states
  const [isDriverAssignModalOpen, setIsDriverAssignModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedOrderForDriver, setSelectedOrderForDriver] = useState(null);

  // Paid Status change modal states
  const [isPaidStatusModalOpen, setIsPaidStatusModalOpen] = useState(false);
  const [selectedPaidStatus, setSelectedPaidStatus] = useState(null);
  const [newPaidStatus, setNewPaidStatus] = useState("");
  const [isPaidStatusChangeLoading, setIsPaidStatusChangeLoading] =
    useState(false);

  // Status change modal states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isStatusChangeLoading, setIsStatusChangeLoading] = useState(false);

  const { allFoodOrders, isLoading, isError, error, refetch } =
    useAllFoodOrders(filter);

  const { usersList, isLoading: isDriverListLoading } = useUsersList({
    role: "Driver",
    status: "Active",
    page: 1,
    limit: 2000,
  });

  // Driver assignment modal
  const openDriverAssignModal = (record) => {
    setSelectedOrderForDriver(record);
    setSelectedDriver(record.driver); // Set existing driver if any
    setIsDriverAssignModalOpen(true);
  };

  const handleDriverAssignChange = async () => {
    if (!selectedDriver || !selectedOrderForDriver) return;

    try {
      const res = await API.put(
        `/food-order/driver-assign/${selectedOrderForDriver._id}`,
        {
          driverID: selectedDriver._id,
        }
      );

      if (res.status === 200) {
        message.success("Driver assigned successfully!");
        setIsDriverAssignModalOpen(false);
        setSelectedOrderForDriver(null);
        setSelectedDriver(null);
        refetch();
      }
    } catch (err) {
      message.error(err?.response?.data?.message || "Failed to assign driver");
    }
  };

  // Paid status modal
  const openPaidStatusModal = (record) => {
    setSelectedPaidStatus(record);
    setNewPaidStatus(record.paid_status); // default current status
    setIsPaidStatusModalOpen(true);
  };

  const handlePaidStatusChange = async () => {
    if (!selectedPaidStatus) return;

    setIsPaidStatusChangeLoading(true);

    try {
      await API.put(
        `/food-order/paid-status-change/${selectedPaidStatus._id}`,
        {
          paid_status: newPaidStatus,
        }
      );

      message.success("Paid status updated successfully!");
      setIsPaidStatusModalOpen(false);
      setSelectedPaidStatus(null);
      setNewPaidStatus("");
      refetch();
    } catch (err) {
      message.error(
        err.response?.data?.message || "Failed to update paid status"
      );
    } finally {
      setIsPaidStatusChangeLoading(false);
    }
  };

  // Status change modal
  const openStatusModal = (record) => {
    setSelectedStatus(record);
    setNewStatus(record.status); // default current status
    setIsStatusModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedStatus) return;

    setIsStatusChangeLoading(true);

    try {
      const res = await API.put(
        `/food-order/status-change/${selectedStatus._id}`,
        {
          status: newStatus,
        }
      );

      if (res.status === 200) {
        message.success("Order status updated successfully!");
        setIsStatusModalOpen(false);
        setSelectedStatus(null);
        setNewStatus("");
        refetch();
      }
    } catch (err) {
      message.error(
        err.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setIsStatusChangeLoading(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const handleFilterChange = (type) => {
    if (type === "All") {
      navigate("/food-orders");
    } else {
      navigate(`/food-orders?filter=${type}`);
    }
  };

  const columns = [
    {
      title: <span>Sl no.</span>,
      dataIndex: "serial_number",
      key: "serial_number",
      render: (_, record, index) => (
        <span>#{index + 1 + (filter.page - 1) * filter.limit}</span>
      ),
    },
    {
      title: <span>User</span>,
      dataIndex: "user",
      key: "user",
      render: (_, record) => (
        <div className="flex flex-items-center gap-2">
          <img
            className="w-[40px] h-[40px] rounded-full mt-1"
            src={record?.user?.profile_image || userIcon}
            alt={record?.user?.name}
          />
          <div className="">
            <h1 className="">{record?.user?.name}</h1>
            <p className="text-sm text-gray-600 mt-[-5px]">
              {record?.user?.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: <span>Phone</span>,
      dataIndex: "user",
      key: "user",
      render: (user) => <span>{user?.phone}</span>,
    },
    {
      title: <span>Delivery Address</span>,
      dataIndex: "delivery_address",
      key: "delivery_address",
      render: (delivery_address) => <span>{delivery_address}</span>,
    },
    {
      title: <span>Quantity</span>,
      dataIndex: "total_quantity",
      key: "total_quantity",
      render: (total_quantity) => <span>{total_quantity}</span>,
    },
    {
      title: <span>Amount</span>,
      dataIndex: "total_price",
      key: "total_price",
      render: (total_price) => <span>${total_price?.toFixed(2)}</span>,
    },
    {
      title: <span>Food Cost</span>,
      dataIndex: "food_cost",
      key: "food_cost",
      render: (food_cost) => <span>${food_cost?.toFixed(2)}</span>,
    },
    {
      title: <span>Driver</span>,
      dataIndex: "driver",
      key: "driver",
      render: (_, record) => (
        <div className="flex flex-items-center gap-2">
          {record.driver == null ? (
            <h2>Not Assigned</h2>
          ) : (
            <div className="flex flex-items-center gap-2">
              <img
                className="w-[35px] h-[35px] rounded-full mt-1"
                src={record?.driver?.profile_image || driverIcon}
                alt={record?.driver?.name}
              />
              <div className="">
                <h1 className="">{record?.driver?.name}</h1>
                <p className="text-sm text-gray-600 mt-[-5px]">
                  {record?.driver?.phone}
                </p>
              </div>
            </div>
          )}

          <Button
            className={`-ml-0.5 ${record.driver == null ? "" : "mt-2.5"}`}
            title={record.driver == null ? "Assign Driver" : "Change Driver"}
            size="small"
            icon={<EditOutlined />}
            onClick={() => openDriverAssignModal(record)}
          />
        </div>
      ),
    },
    {
      title: <span>Paid Status</span>,
      dataIndex: "paid_status",
      key: "paid_status",
      render: (paid_status, record) => (
        <div className="flex flex-items-center gap-2">
          {paid_status == "COD" ? (
            <div className="flex flex-items-center gap-2">
              <Tag className="p-0.5 px-3" color="blue">
                {paid_status}
              </Tag>
              {/* <Button
                className="-ml-3"
                title="Change Paid Status"
                size="small"
                icon={<EditOutlined />}
                onClick={() => openPaidStatusModal(record)}
              /> */}
            </div>
          ) : (
            <Tag
              className="p-0.5 px-3"
              color={paid_status === "Paid" ? "green" : "orange"}
            >
              {paid_status}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: <span>Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div className="flex items-center">
          <Tag
            className="p-0.5 px-3"
            color={
              status === "Delivered"
                ? "green"
                : status === "On Going"
                ? "blue"
                : "orange"
            }
          >
            {status}
          </Tag>

          {status === "Delivered" ? (
            ""
          ) : (
            <Button
              className="-ml-1"
              title="Status Change"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openStatusModal(record)}
            />
          )}
        </div>
      ),
    },
    {
      title: <span>Details</span>,
      key: "Details",
      render: (_, record) => (
        <FoodOrderDetails record={record} refetch={refetch} />
      ),
    },
  ];

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div className="flex gap-2 mb-4">
          {[
            "All",
            "Pending",
            "Processing",
            "On Going",
            "Delivered",
            "Cancelled",
          ].map((filterType) => (
            <Button
              key={filterType}
              type={currentFilter === filterType ? "primary" : "default"}
              onClick={() => handleFilterChange(filterType)}
              className={currentFilter === filterType ? "my-main-button" : ""}
            >
              {filterType === "On Going"
                ? "On Going"
                : filterType === "Cancelled"
                ? "Cancelled"
                : filterType}{" "}
              Orders
            </Button>
          ))}
        </div>

        <div>
          <Search
            placeholder="Search by User name or email or phone..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => {
              setFilter((prevFilter) => ({
                ...prevFilter,
                search: value || null,
                page: 1,
              }));
            }}
            style={{ width: 350 }}
            allowClear
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={allFoodOrders?.data || []}
        rowKey="_id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: allFoodOrders?.pagination?.total || 0,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={handleTableChange}
        loading={isLoading}
      />

      {/* Driver assign modal */}
      <Modal
        title="Assign Driver"
        open={isDriverAssignModalOpen}
        onOk={handleDriverAssignChange}
        onCancel={() => {
          setIsDriverAssignModalOpen(false);
          setSelectedOrderForDriver(null);
          setSelectedDriver(null);
        }}
        okText="Assign"
        confirmLoading={isDriverListLoading}
      >
        <p>Select a driver for this order:</p>
        <Select
          showSearch
          placeholder="Select a driver"
          value={selectedDriver ? selectedDriver._id : null}
          onChange={(value) =>
            setSelectedDriver(
              usersList?.data?.users?.find((driver) => driver._id === value)
            )
          }
          style={{ width: "100%" }}
          filterOption={(input, option) => {
            const driverName =
              usersList?.data?.users?.find(
                (driver) => driver._id === option.value
              )?.name || "";
            return driverName.toLowerCase().includes(input.toLowerCase());
          }}
          loading={isDriverListLoading}
        >
          {usersList?.data?.users?.map((driver) => (
            <Select.Option key={driver._id} value={driver._id}>
              <div className="flex items-center gap-2">
                <img
                  className="w-[30px] h-[30px] rounded-full"
                  src={driver.profile_image || driverIcon}
                  alt={driver.name}
                />
                <span>{driver.name}</span>
              </div>
            </Select.Option>
          ))}
        </Select>
      </Modal>

      {/* Paid status change modal */}
      <Modal
        title="Change Paid Status"
        open={isPaidStatusModalOpen}
        onOk={handlePaidStatusChange}
        onCancel={() => {
          setIsPaidStatusModalOpen(false);
          setSelectedPaidStatus(null);
          setNewPaidStatus("");
        }}
        okText="Update"
        confirmLoading={isPaidStatusChangeLoading}
      >
        <p>Select new paid status for this order:</p>
        <Select
          value={newPaidStatus}
          onChange={(value) => setNewPaidStatus(value)}
          style={{ width: "100%" }}
        >
          <Select.Option value="Paid">Paid</Select.Option>
          <Select.Option value="COD">COD</Select.Option>
        </Select>
      </Modal>

      {/* Status change modal */}
      <Modal
        title="Change Order Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => {
          setIsStatusModalOpen(false);
          setSelectedStatus(null);
          setNewStatus("");
        }}
        okText="Update"
        confirmLoading={isStatusChangeLoading}
      >
        <p>Select new status for this order:</p>
        <Select
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
          style={{ width: "100%" }}
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Processing">Processing</Select.Option>
          <Select.Option value="On Going">On Going</Select.Option>
          <Select.Option value="Delivered">Delivered</Select.Option>
          <Select.Option value="Cancelled">Cancelled</Select.Option>
        </Select>
      </Modal>
    </div>
  );
}

export default FoodOrders;
