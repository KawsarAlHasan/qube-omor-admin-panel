import React, { useEffect, useState } from "react";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";
import { Button, message, Modal, Space, Table, Tag } from "antd";
import { Link, useLocation } from "react-router-dom";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import AddSpa from "./AddSpa";
import EditSpa from "./EditSpa";
import { useAllSpas } from "../../api/spaApi";
import { API } from "../../api/api";

function SpaPackages() {
  const [selectedFood, setSelectedFood] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const beforeHyphen = pathnames[0]?.split("-")[0];
  const capitalized = beforeHyphen
    ? beforeHyphen.charAt(0).toUpperCase() + beforeHyphen.slice(1)
    : "";

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    type: capitalized,
  });

  // Update filter when capitalized changes
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      type: capitalized,
      page: 1, // Reset to first page when type changes
    }));
  }, [capitalized]);

  // Pass individual values instead of object
  const { spaData, isLoading, isError, error, refetch } = useAllSpas({
    page: filter.page,
    limit: filter.limit,
    type: filter.type,
  });

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
      await API.delete(`/spa/delete/${selectedFood?._id}`);
      message.success("Spa service deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedFood(null);
      setDeleteLoading(false);
      refetch();
    } catch (err) {
      message.error(
        err.response?.data?.message || "Failed to delete spa service"
      );
      setDeleteLoading(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const columns = [
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
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      render: (credit) => <span className="">{credit} Credits</span>,
    },
    {
      title: "Room",
      dataIndex: "room_type",
      key: "room_type",
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
          {images?.slice(0, 2).map((img, index) => (
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
          <EditSpa
            capitalized={capitalized}
            record={record}
            refetch={refetch}
          />

          <DeleteOutlined
            className="text-xl text-red-500 hover:text-red-700 cursor-pointer transition-colors"
            onClick={() => openDeleteModal(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <AddSpa capitalized={capitalized} refetch={refetch} />
      </div>

      <Table
        columns={columns}
        dataSource={spaData?.data}
        rowKey="_id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: spaData?.pagination?.total,
          showSizeChanger: true,
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
        <p>Are you sure you want to delete this {capitalized} service?</p>
      </Modal>
    </div>
  );
}

export default SpaPackages;
