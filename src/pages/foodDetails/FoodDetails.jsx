import React, { useState } from "react";
import {
  Table,
  Space,
  Tag,
  Button,
  Modal,
  Image,
  message,
  Input,
  Spin,
  List,
  Row,
  Col,
  Card,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useFoods } from "../../api/foodApi";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";
import AddFoodDetail from "./AddFoodDetail";
import ViewFoodDetail from "./ViewFoodDetail";
import EditFoodDetail from "./EditFoodDetail";
import { API } from "../../api/api";

const { Search } = Input;

function FoodDetails() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isStatusChangeLoading, setIsStatusChangeLoading] = useState(false);

  const [selectedFood, setSelectedFood] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    food_name: null,
    status: "all",
  });

  const { allFoods, isLoading, isError, error, refetch } = useFoods(filters);

  const openStatusModal = (record) => {
    setSelectedCategory(record);
    setNewStatus(record.food_status);
    setIsStatusModalOpen(true);
  };

  const openDeleteModal = (record) => {
    setSelectedFood(record);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedFood) return;

    setDeleteLoading(true);
    try {
      // Simulate API call
      await API.delete(`/food/delete/${selectedFood._id}`);

      message.success("Food item deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedFood(null);
      setDeleteLoading(false);
      refetch();
    } catch (err) {
      message.error(
        err.response?.data?.message || "Failed to delete food item"
      );
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedCategory) return;

    setIsStatusChangeLoading(true);

    try {
      // Simulate API call
      await API.put(`/food/status-change/${selectedCategory._id}`, {
        food_status: newStatus,
      });

      message.success("Food status updated successfully!");
      setIsStatusModalOpen(false);
      setSelectedCategory(null);
      setNewStatus("");
      refetch();
    } catch (err) {
      console.log(err.response);
      message.error(
        err.response?.data?.message || "Failed to update Food status"
      );
    } finally {
      setIsStatusChangeLoading(false);
    }
  };

  const handleTableChange = (pagination, tableFilters) => {
    const { current: page, pageSize: limit } = pagination;
    const status = tableFilters.food_status
      ? tableFilters.food_status[0]
      : null;
    const food_name = tableFilters.food_name ? tableFilters.food_name[0] : null;

    setFilters((prevFilters) => ({
      ...prevFilters,
      page,
      limit,
      status,
      food_name,
    }));
  };

  const columns = [
    {
      title: "Food Image",
      dataIndex: "food_images",
      key: "food_images",
      render: (food_images) => (
        <Image
          width={60}
          height={60}
          src={food_images?.[0] || "https://via.placeholder.com/60"}
          alt="food"
          style={{ borderRadius: "8px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Food Name",
      dataIndex: "food_name",
      key: "food_name",
      render: (name) => <span className="font-medium">{name}</span>,
    },
    {
      title: "Quantity",
      dataIndex: "quentity",
      key: "quentity",
      render: (quentity) => (
        <span
          className={
            "font-semibold " +
            (quentity > 0
              ? "text-green-500"
              : quentity < 0
              ? " text-red-700"
              : "text-red-500")
          }
        >
          {quentity == 0 ? "Out of Stock" : quentity}
        </span>
      ),
    },
    {
      title: "Price",
      dataIndex: "food_price",
      key: "food_price",
      render: (food_price) => (
        <span className="font-semibold">${food_price}</span>
      ),
    },
    {
      title: "Cost (on Me)",
      dataIndex: "cost_on_me",
      key: "cost_on_me",
      render: (cost) => <span>${cost}</span>,
    },
    {
      title: "Status",
      dataIndex: "food_status",
      key: "food_status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Deactive", value: "Deactive" },
      ],

      render: (food_status, record) => (
        <div className="flex items-center gap-2">
          <Tag
            className="p-0.5 px-3"
            color={food_status === "Active" ? "green" : "red"}
          >
            {food_status}
          </Tag>

          <Button
            className="-ml-2"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openStatusModal(record)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      // width: 120,
      render: (_, record) => (
        <Space size="middle">
          <ViewFoodDetail record={record} />

          <EditFoodDetail record={record} refetch={refetch} />

          <DeleteOutlined
            className="text-xl text-red-500 hover:text-red-700 cursor-pointer transition-colors"
            onClick={() => openDeleteModal(record)}
          />
        </Space>
      ),
    },
  ];

  React.useEffect(() => {
    refetch();
  }, [filters, refetch]);

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search Food Name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={(value) => {
            setFilters((prevFilters) => ({
              ...prevFilters,
              food_name: value || null,
              page: 1,
            }));
          }}
          style={{ width: 300 }}
        />

        <AddFoodDetail refetch={refetch} />
      </div>

      <Table
        columns={columns}
        dataSource={allFoods?.foods?.map((item, index) => ({
          key: item._id || index,
          ...item,
        }))}
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total: allFoods?.pagination?.total || 0,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={handleTableChange}
        loading={isLoading}
        // scroll={{ x: 1500 }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okType="danger"
        confirmLoading={deleteLoading}
      >
        <p>
          Are you sure you want to delete the food item "
          {selectedFood?.food_name}"? This action cannot be undone.
        </p>
      </Modal>

      {/* Status Change Modal */}
      <Modal
        title="Change Food Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalOpen(false)}
        okText="Update"
        confirmLoading={isStatusChangeLoading}
      >
        <p className="mb-2">Select new status for this Food:</p>
        <Select
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
          style={{ width: "100%" }}
        >
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Deactive">Deactive</Select.Option>
        </Select>
      </Modal>
    </div>
  );
}

export default FoodDetails;
