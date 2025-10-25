import React, { useState } from "react";
import { Table, Tag, Button, Modal, Select, message } from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { EditOutlined } from "@ant-design/icons";
import { useAllMockDriverList, useAllMockFoodOrders } from "../../api/api";
import FoodOrderDetails from "./FoodOrderDetails";
import { useLocation, useNavigate } from "react-router-dom";

function FoodOrders() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const currentFilter = queryParams.get("filter") || "All";

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  // Driver assignment modal states
  const [isDriverAssignModalOpen, setIsDriverAssignModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

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

  const {
    allMockFoodOrders,
    pagination = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useAllMockFoodOrders(filter);

  const { allMockDriverList, isLoading: isDriverListLoading } =
    useAllMockDriverList();

  // Driver assignment modal
  const openDriverAssignModal = (record) => {
    setSelectedDriver(record.driver); // Set existing driver if any
    setIsDriverAssignModalOpen(true);
  };

  const handleDriverAssignChange = async () => {
    if (!selectedDriver) return;

    try {
      message.success("Driver assigned successfully!");

      console.log("selectedDriverselectedDriver", selectedDriver);

      setIsDriverAssignModalOpen(false);
      refetch();
    } catch (err) {
      message.error("Failed to assign driver");
    }
  };

  // paid status model
  const openPaidStatusModal = (record) => {
    setSelectedPaidStatus(record);
    setNewPaidStatus(record.status); // default current status
    setIsPaidStatusModalOpen(true);
  };

  const handlePaidStatusChange = async () => {
    if (!selectedPaidStatus) return;

    setIsPaidStatusChangeLoading(true);

    try {
      message.success("User paid status updated successfully!");
      setIsPaidStatusModalOpen(false);
      setSelectedPaidStatus(null);
      setNewPaidStatus("");
      refetch();
    } catch (err) {
      message.error(
        err.response?.data?.error || "Failed to update User paid status"
      );
    } finally {
      setIsPaidStatusChangeLoading(false);
    }
  };

  // status change modal
  const openStatusModal = (record) => {
    setSelectedStatus(record);
    setNewStatus(record.status); // default current status
    setIsStatusModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedStatus) return;

    setIsStatusChangeLoading(true);

    try {
      message.success("User status updated successfully!");
      setIsStatusModalOpen(false);
      setSelectedStatus(null);
      setNewStatus("");
      refetch();
    } catch (err) {
      message.error(
        err.response?.data?.error || "Failed to update User status"
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
      render: (_, record, index) => <span>#{index + 1}</span>,
    },
    {
      title: <span>User</span>,
      dataIndex: "user",
      key: "user",
      render: (_, record) => (
        <div className="flex flex-items-center gap-2">
          <img
            className="w-[40px] h-[40px] rounded-full mt-1"
            src={record.user.profile}
            alt={record.user.name}
          />
          <div className="">
            <h1 className="">{record.user.name}</h1>
            <p className="text-sm text-gray-600 mt-[-5px]">
              {record.user.email}
            </p>
          </div>
        </div>
      ),
    },

    {
      title: <span>Phone</span>,
      dataIndex: "contact_number",
      key: "contact_number",
      render: (contact_number) => <span>{contact_number}</span>,
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
      render: (total_price) => <span>${total_price.toFixed(2)}</span>,
    },
    {
      title: <span>Food Cost</span>,
      dataIndex: "food_cost",
      key: "food_cost",
      render: (food_cost) => <span>${food_cost.toFixed(2)}</span>,
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
                className="w-[40px] h-[40px] rounded-full mt-1"
                src={record?.driver?.profile}
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
              <Button
                className="-ml-3"
                title="Status Change"
                size="small"
                icon={<EditOutlined />}
                onClick={() => openPaidStatusModal(record)}
              />
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
      <div className="flex gap-2 mb-4">
        <Button
          type={currentFilter === "All" ? "primary" : "default"}
          onClick={() => handleFilterChange("All")}
          className={currentFilter === "All" ? "my-main-button" : ""}
        >
          All Orders
        </Button>
        <Button
          type={currentFilter === "Pending" ? "primary" : "default"}
          onClick={() => handleFilterChange("Pending")}
          className={currentFilter === "Pending" ? "my-main-button" : ""}
        >
          Pending
        </Button>
        <Button
          type={currentFilter === "On_Going" ? "primary" : "default"}
          onClick={() => handleFilterChange("On_Going")}
          className={currentFilter === "On_Going" ? "my-main-button" : ""}
        >
          On Going
        </Button>
        <Button
          type={currentFilter === "Delivered" ? "primary" : "default"}
          onClick={() => handleFilterChange("Delivered")}
          className={currentFilter === "Delivered" ? "my-main-button" : ""}
        >
          Delivered
        </Button>
        <Button
          type={currentFilter === "Canceled" ? "primary" : "default"}
          onClick={() => handleFilterChange("Canceled")}
          className={currentFilter === "Canceled" ? "my-main-button" : ""}
        >
          Canceled
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={allMockFoodOrders}
        rowKey="_id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: pagination.totalPayments || 0,
          showSizeChanger: false,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
        loading={isLoading}
      />

      {/* driver assign modal */}
      <Modal
        title="Assign Driver"
        open={isDriverAssignModalOpen}
        onOk={handleDriverAssignChange}
        onCancel={() => setIsDriverAssignModalOpen(false)}
        okText="Assign"
      >
        <p>Select a driver for this order:</p>
        <Select
          showSearch
          placeholder="Select a driver"
          value={selectedDriver ? selectedDriver._id : null}
          onChange={(value) =>
            setSelectedDriver(
              allMockDriverList.find((driver) => driver._id === value)
            )
          }
          style={{ width: "100%" }}
          filterOption={(input, option) => {
            const driverName =
              allMockDriverList.find((driver) => driver._id === option.value)
                ?.name || "";
            return driverName.toLowerCase().includes(input.toLowerCase());
          }}
        >
          {allMockDriverList.map((driver) => (
            <Select.Option key={driver._id} value={driver._id}>
              <div className="flex items-center gap-2">
                <img
                  className="w-[30px] h-[30px] rounded-full"
                  src={driver.profile}
                  alt={driver.name}
                />
                <span>{driver.name}</span>
              </div>
            </Select.Option>
          ))}
        </Select>
      </Modal>

      {/* Paid status change */}
      <Modal
        title="Paid Change Status"
        open={isPaidStatusModalOpen}
        onOk={handlePaidStatusChange}
        onCancel={() => setIsPaidStatusModalOpen(false)}
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
          <Select.Option value="Online Pay">Online Pay</Select.Option>
        </Select>
      </Modal>

      {/* status change */}
      <Modal
        title="Change Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalOpen(false)}
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
          <Select.Option value="Delivered">Delivered</Select.Option>
          <Select.Option value="Cancelled">Cancelled</Select.Option>
        </Select>
      </Modal>
    </div>
  );
}

export default FoodOrders;
