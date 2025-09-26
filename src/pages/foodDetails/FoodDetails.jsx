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
} from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useMockFoods } from "../../api/foodApi";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";
import AddFoodDetail from "./AddFoodDetail";
import ViewFoodDetail from "./ViewFoodDetail";
import EditFoodDetail from "./EditFoodDetail";

const { Search } = Input;

function FoodDetails() {
  const [selectedFood, setSelectedFood] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    food_name: null,
    status: null,
  });

  const { mockFoods, pagination, isLoading, isError, error, refetch } =
    useMockFoods(filters);

  const openDeleteModal = (record) => {
    setSelectedFood(record);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedFood) return;

    setDeleteLoading(true);
    try {
      // Simulate API call
      // await API.delete(`/foods/${selectedFood.id}`);

      message.success("Food item deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedFood(null);
      setDeleteLoading(false);
      refetch();
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to delete food item");
      setDeleteLoading(false);
    }
  };

  const handleTableChange = (pagination, tableFilters) => {
    const { current: page, pageSize: limit } = pagination;
    const status = tableFilters.status ? tableFilters.status[0] : null;
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
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Food Image",
      dataIndex: "images",
      key: "image",
      render: (images) => (
        <Image
          width={60}
          height={60}
          src={images?.[0] || "https://via.placeholder.com/60"}
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
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    //   render: (text) => (
    //     <span title={text}>{text?.length > 50 ? `${text.slice(0, 50)}...` : text || "N/A"}</span>
    //   ),
    // },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => <span>{quantity}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span className="font-semibold">${price}</span>,
    },
    {
      title: "Cost (on Me)",
      dataIndex: "cost_on_me",
      key: "cost_on_me",
      render: (cost) => <span>${cost}</span>,
    },
    // {
    //   title: "Calories",
    //   dataIndex: "calories",
    //   key: "calories",
    // },
    // {
    //   title: "Cooking Time",
    //   dataIndex: "cookign_time",
    //   key: "cooking_time",
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Deactive", value: "Deactive" },
      ],
      render: (status) =>
        status === "Active" ? (
          <Tag className="px-2 py-0.5" color="green">Active</Tag>
        ) : (
          <Tag className="px-2 py-0.5"  color="red">Deactive</Tag>
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

          <EditFoodDetail record={record} />

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

        <AddFoodDetail />
      </div>

      <Table
        columns={columns}
        dataSource={mockFoods.map((item, index) => ({
          key: item.id || index,
          ...item,
        }))}
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total: pagination?.totalItems || 0,
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
    </div>
  );
}

export default FoodDetails;
