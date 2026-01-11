import React, { useState } from "react";
import {
  Input,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  InputNumber,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import AddCredit from "./AddCredit";
import { useCredits } from "../../api/spaApi";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";
import { API } from "../../api/api";
import { usePermission } from "../../hooks/usePermission";

const { TextArea } = Input;

function Credits() {
  const { canCreate, canEdit, canDelete, canChangeStatus } = usePermission();
  const { credits, isLoading, isError, error, refetch } = useCredits();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [form] = Form.useForm();

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  // Open status change modal
  const openStatusModal = (record) => {
    setSelectedCredit(record);
    setIsStatusModalOpen(true);
  };

  // Handle status change
  const handleStatusChange = async () => {
    try {
      const newStatus =
        selectedCredit.status === "Active" ? "Deactive" : "Active";

      await API.put(`/credit-package/status-change/${selectedCredit._id}`, {
        status: newStatus,
      });

      message.success(`Status changed to ${newStatus} successfully`);
      setIsStatusModalOpen(false);
      refetch();
    } catch (err) {
      message.error(err?.response?.data?.message || "Failed to change status");
      console.error("error", err);
    }
  };

  // Open edit modal
  const openEditModal = (record) => {
    setSelectedCredit(record);
    form.setFieldsValue({
      credit: record.credit,
      price: record.price,
      description: record.description,
    });
    setIsEditModalOpen(true);
  };

  // Handle edit
  const handleEdit = async (values) => {
    try {
      await API.put(`/credit-package/update/${selectedCredit._id}`, values);

      message.success("Credit updated successfully");
      setIsEditModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to update credit");
      console.error("error", err);
    }
  };

  // Handle delete
  const handleDelete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this credit?",
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete the credit package of ${record.credit} credits.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await API.delete(`/credit-package/delete/${record?._id}`);
          message.success("Credit deleted successfully");
          refetch();
        } catch (err) {
          message.error(
            err.response?.data?.message || "Failed to delete credit"
          );
          console.error("error", err);
        }
      },
    });
  };

  const columns = [
    {
      title: <span>Sl no.</span>,
      dataIndex: "index",
      key: "index",
      render: (_, record, index) => <span>#{index + 1}</span>,
    },
    {
      title: <span>Credit</span>,
      dataIndex: "credit",
      key: "credit",
      render: (credit) => <span>{credit}</span>,
    },
    {
      title: <span>Price</span>,
      dataIndex: "price",
      key: "price",
      render: (price) => <span>$ {price}</span>,
    },
    {
      title: <span>Description</span>,
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <span title={description}>
          {description.slice(0, 40)} {description.length > 40 && "..."}
        </span>
      ),
    },
    {
      title: <span>Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div className="flex items-center ">
          {status === "Active" ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">{status}</Tag>
          )}

          {canChangeStatus("credits") && (
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
    ...(canEdit("credits") || canDelete("credits")
      ? [
          {
            title: <span>Actions</span>,
            key: "actions",
            render: (_, record) => (
              <Space size="middle">
                {canEdit("credits") && (
                  <EditOutlined
                    className="text-[20px] text-blue-500 hover:text-blue-400 cursor-pointer"
                    onClick={() => openEditModal(record)}
                  />
                )}

                {canDelete("credits") && (
                  <DeleteFilled
                    className="text-[23px] text-red-400 hover:text-red-300 cursor-pointer"
                    onClick={() => handleDelete(record)}
                  />
                )}
              </Space>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        {canCreate("credits") && <AddCredit refetch={refetch} />}
      </div>

      <Table
        columns={columns}
        dataSource={credits?.data || []}
        rowKey="_id"
        pagination={false}
        className="border border-gray-200"
      />

      {/* Status Change Modal */}
      <Modal
        title="Change Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalOpen(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to change the status from{" "}
          <strong>{selectedCredit?.status}</strong> to{" "}
          <strong>
            {selectedCredit?.status === "Active" ? "Deactive" : "Active"}
          </strong>
          ?
        </p>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Credit"
        open={isEditModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsEditModalOpen(false);
          form.resetFields();
        }}
        okText="Update"
        cancelText="Cancel"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEdit}
          className="mt-4"
        >
          <Form.Item
            label="Credit"
            name="credit"
            rules={[
              { required: true, message: "Please enter credit amount" },
              { type: "number", min: 1, message: "Credit must be positive" },
            ]}
          >
            <InputNumber className="w-full" placeholder="Enter credit amount" />
          </Form.Item>

          {/* <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Please enter price" },
              { type: "number", min: 0, message: "Price must be positive" },
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder="Enter price"
              prefix="$"
            />
          </Form.Item> */}

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter description"
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Credits;
