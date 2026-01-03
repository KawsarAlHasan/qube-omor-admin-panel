import React, { useState } from "react";
import { Table, Space, Tag, Button, Modal, Select, message, Image } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAllCategory } from "../../api/foodApi";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";
import AddNewCategory from "./AddNewCategory";
import EditCategory from "./EditCategory";
import { API } from "../../api/api";
import { usePermission } from "../../hooks/usePermission";

function FoodCategory() {
  const { canCreate, canEdit, canDelete, canChangeStatus } = usePermission();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isStatusChangeLoading, setIsStatusChangeLoading] = useState(false);

  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState(null);

  const params = { status: "all" };
  const { mockCategory, isLoading, isError, error, refetch } =
    useAllCategory(params);

  const openStatusModal = (record) => {
    setSelectedCategory(record);
    setNewStatus(record.category_status);
    setIsStatusModalOpen(true);
  };

  const handleEdit = (data) => {
    setCategoryDetails(data);
    setIsEditCategoryOpen(true);
  };

  const handleModalClose = () => {
    setCategoryDetails(null); // Reset the details
    setIsEditCategoryOpen(false); // Close modal
  };

  const openDeleteModal = (record) => {
    setSelectedCategory(record);
    setIsDeleteModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedCategory) return;

    setIsStatusChangeLoading(true);

    try {
      // Simulate API call
      await API.put(`/food-category/status-change/${selectedCategory._id}`, {
        status: newStatus,
      });

      message.success("Category status updated successfully!");
      setIsStatusModalOpen(false);
      setSelectedCategory(null);
      setNewStatus("");
      refetch();
    } catch (err) {
      message.error(
        err.response?.data?.message || "Failed to update category status"
      );
    } finally {
      setIsStatusChangeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      // Simulate API call
      await API.delete(`/food-category/delete/${selectedCategory._id}`);

      message.success("Category deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      refetch();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  const columns = [
    {
      title: "Sl no.",
      dataIndex: "_id",
      key: "serial_number",
      render: (id, record, index) => <span>#{index + 1}</span>,
    },
    {
      title: "Category Image",
      dataIndex: "category_image",
      key: "category_image",
      render: (image) => (
        <Image
          width={50}
          height={50}
          src={image}
          alt="category"
          style={{ borderRadius: "8px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Category Name",
      dataIndex: "category_name",
      key: "category_name",
      render: (name) => <span className="font-medium">{name}</span>,
    },
    {
      title: "Status",
      dataIndex: "category_status",
      key: "category_status",
      render: (category_status, record) => (
        <div className="flex items-center gap-2">
          <Tag
            className="p-0.5 px-3"
            color={category_status === "Active" ? "green" : "red"}
          >
            {category_status}
          </Tag>

          {canChangeStatus("food-category") && (
            <Button
              className="-ml-2"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openStatusModal(record)}
            />
          )}
        </div>
      ),
    },

    ...(canEdit("food-category")
      ? [
          {
            title: "Edit",
            key: "edit",
            render: (_, record) => (
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              >
                Edit
              </Button>
            ),
          },
        ]
      : []),

    ...(canDelete("food-category")
      ? [
          {
            title: "Delete",
            key: "Delete",
            render: (_, record) => (
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => openDeleteModal(record)}
              >
                Delete
              </Button>
            ),
          },
        ]
      : []),
  ];

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  return (
    <div className="">
      <div className="mb-4">
        {canCreate("food-category") && <AddNewCategory refetch={refetch} />}
      </div>

      <Table
        columns={columns}
        dataSource={mockCategory}
        rowKey="_id"
        pagination={false}
      />

      {/* Status Change Modal */}
      <Modal
        title="Change Category Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalOpen(false)}
        okText="Update"
        confirmLoading={isStatusChangeLoading}
      >
        <p className="mb-2">Select new status for this category:</p>
        <Select
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
          style={{ width: "100%" }}
        >
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Deactive">Deactive</Select.Option>
        </Select>
      </Modal>

      {/* edit modal */}
      <EditCategory
        categoryDetails={categoryDetails}
        isOpen={isEditCategoryOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okType="danger"
      >
        <p>
          Are you sure you want to delete the category "
          {selectedCategory?.category_name}"? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default FoodCategory;
