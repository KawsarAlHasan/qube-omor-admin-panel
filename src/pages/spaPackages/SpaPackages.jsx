import React, { useState } from "react";
import { useAllSpa } from "../../api/api";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";
import { Button, message, Modal, Space, Table, Tag } from "antd";
import { Link, useLocation } from "react-router-dom";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import AddSpa from "./AddSpa";
import EditSpa from "./EditSpa";

function SpaPackages() {
  const [selectedFood, setSelectedFood] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filter = {
    page: 1,
    limit: 10,
  };

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const beforeHyphen = pathnames[0]?.split("-")[0];
  const capitalized = beforeHyphen
    ? beforeHyphen.charAt(0).toUpperCase() + beforeHyphen.slice(1)
    : "";

  const { allSpa, pagination, isLoading, isError, error, refetch } =
    useAllSpa(filter);

  const openDeleteModal = (record) => {
    setSelectedFood(record);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) return <IsLoading />;

  if (isError) return <IsError error={error} refetch={refetch} />;

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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Service Name",
      dataIndex: "service_name",
      key: "service_name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <p className="truncate">{text?.slice(0, 50)}</p>,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color;
        switch (status) {
          case "Available":
            color = "green";
            break;
          case "Not Available":
            color = "red";
            break;
          case "Declined":
            color = "orange";
            break;
          default:
            color = "blue";
        }
        return (
          <Tag className="py-0.5 px-2" color={color}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <div className="spa-images">
          {images.slice(0, 2).map((img, index) => (
            <img key={index} src={img} alt="spa" className="spa-image" />
          ))}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          {/* <ViewFoodDetail record={record} />

*/}
          <EditSpa capitalized={capitalized} record={record} />

          <DeleteOutlined
            className="text-xl text-red-500 hover:text-red-700 cursor-pointer transition-colors"
            onClick={() => openDeleteModal(record)}
          />
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    // Here, you can handle page change or sorting if needed
  };

  const paginationConfig = {
    current: pagination.page,
    pageSize: pagination.limit,
    total: pagination.totalPayments,
    onChange: (page) => {
      // Update the page value and refetch data based on new page
      filter.page = page;
      refetch();
    },
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <AddSpa capitalized={capitalized} refetch={refetch} />
      </div>

      <Table
        columns={columns}
        dataSource={allSpa}
        rowKey="id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: pagination.totalUser,
          showSizeChanger: false,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
        loading={isLoading}
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
        <p>Are you sure you want to delete this {capitalized}?</p>
      </Modal>
    </div>
  );
}

export default SpaPackages;
