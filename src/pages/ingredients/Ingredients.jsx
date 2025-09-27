import React, { useState } from "react";
import { Table, Space, Tag, Button, Modal, Select, message, Image } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";
import { useMockIngredients } from "../../api/foodApi";
import AddNewIngredient from "./AddNewIngredient";
import EditIngredient from "./EditIngredient";

function Ingredients() {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isStatusChangeLoading, setIsStatusChangeLoading] = useState(false);

  const [isEditIngredientOpen, setIsEditIngredientOpen] = useState(false);
  const [ingredientDetails, setIngredientDetails] = useState(null);

  const { mockIngredients, isLoading, isError, error, refetch } =
    useMockIngredients();

  const openStatusModal = (record) => {
    setSelectedIngredient(record);
    setNewStatus(record.status);
    setIsStatusModalOpen(true);
  };

  const handleEdit = (data) => {
    setIngredientDetails(data);
    setIsEditIngredientOpen(true);
  };

  const handleModalClose = () => {
    setIngredientDetails(null); // Reset the details
    setIsEditIngredientOpen(false); // Close modal
  };

  const openDeleteModal = (record) => {
    setSelectedIngredient(record);
    setIsDeleteModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedIngredient) return;

    setIsStatusChangeLoading(true);

    try {
      // Simulate API call
      // await API.patch(`/ingredient/${selectedIngredient._id}`, { status: newStatus });

      message.success("Ingredient status updated successfully!");
      setIsStatusModalOpen(false);
      setSelectedIngredient(null);
      setNewStatus("");
      refetch();
    } catch (err) {
      message.error(
        err.response?.data?.error || "Failed to update ingredient status"
      );
    } finally {
      setIsStatusChangeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedIngredient) return;

    try {
      // Simulate API call
      // await API.delete(`/ingredient/${selectedIngredient._id}`);

      message.success("Ingredient deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedIngredient(null);
      refetch();
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to delete ingredient");
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
      title: "Ingredient Image",
      dataIndex: "ingredient_image",
      key: "ingredient_image",
      render: (image) => (
        <Image
          width={50}
          height={50}
          src={image}
          alt="Ingredient"
          style={{ borderRadius: "8px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Ingredient Name",
      dataIndex: "ingredient_name",
      key: "ingredient_name",
      render: (name) => <span className="font-medium">{name}</span>,
    },
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
      render: (price) => <span className="">${price}</span>,
    },
    {
      title: "Cost (on me)",
      dataIndex: "cost_on_me",
      key: "cost_on_me",
      render: (cost_on_me) => <span className="">${cost_on_me}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div className="flex items-center gap-2">
          {status === "Active" ? (
            <Tag className="p-0.5 px-3" color="green">
              Active
            </Tag>
          ) : (
            <Tag className="p-0.5 px-3" color="red">
              {status}
            </Tag>
          )}
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
    {
      title: "Delete",
      key: "Delete",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => openDeleteModal(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  return (
    <div className="p-4">
      <div className="mb-4">
        <AddNewIngredient refetch={refetch} />
      </div>

      <Table
        columns={columns}
        dataSource={mockIngredients}
        rowKey="_id"
        pagination={false}
      />

      {/* Status Change Modal */}
      <Modal
        title="Change Ingredient Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalOpen(false)}
        okText="Update"
        confirmLoading={isStatusChangeLoading}
      >
        <p className="mb-2">Select new status for this ingredient:</p>
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
      <EditIngredient
        ingredientDetails={ingredientDetails}
        isOpen={isEditIngredientOpen}
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
          Are you sure you want to delete the ingredient "
          {selectedIngredient?.ingredient_name}"? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default Ingredients;
