import React, { useState } from "react";
import { useUsersList } from "../../../api/userApi";
import IsLoading from "../../../components/IsLoading";
import IsError from "../../../components/IsError";
import {
  Input,
  Table,
  Tag,
  Avatar,
  Button,
  Space,
  Modal,
  Select,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import AddInstructor from "./AddInstructor";
import { API } from "../../../api/api";
import userIcon from "../../../assets/icons/userIcon.png";

const { Search } = Input;
const { confirm } = Modal;

function Instructors() {
  const [searchText, setSearchText] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isStatusChangeLoading, setIsStatusChangeLoading] = useState(false);

  const [filters, setFilters] = useState({
    role: "Instructor",
    page: 1,
    limit: 2000,
    name: searchText,
  });

  const { usersList, isLoading, isError, error, refetch } =
    useUsersList(filters);

  const openStatusModal = (record) => {
    setSelectedInstructor(record);
    setNewStatus(record?.status);
    setIsStatusModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedInstructor) return;

    setIsStatusChangeLoading(true);

    try {
      await API.put(`/user/status-change/${selectedInstructor._id}`, {
        status: newStatus,
      });

      message.success("Instructor status updated successfully!");
      setIsStatusModalOpen(false);
      setSelectedInstructor(null);
      setNewStatus("");
      refetch();
    } catch (err) {
      console.log(err.response);
      message.error(
        err.response?.data?.message || "Failed to update instructor status"
      );
    } finally {
      setIsStatusChangeLoading(false);
    }
  };

  const handleDeleteInstructor = (record) => {
    confirm({
      title: "Are you sure you want to delete this instructor?",
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete ${record?.name} from the system.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await API.delete(`/auth/delete/${record?._id}`);
          message.success("Instructor deleted successfully!");
          refetch();
        } catch (err) {
          console.log(err.response);
          message.error(
            err.response?.data?.message || "Failed to delete instructor"
          );
        }
      },
    });
  };

  const columns = [
    {
      title: <span>Sl no.</span>,
      dataIndex: "index",
      key: "index",
      render: (_, record, index) => (
        <span>#{index + 1 + (filters.page - 1) * filters.limit}</span>
      ),
    },
    {
      title: <span>Instructor</span>,
      dataIndex: "instructor",
      key: "instructor",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar size={40} src={record?.profile_image || userIcon} />
          <h1 className="mt-2">{record?.name}</h1>
        </div>
      ),
    },
    {
      title: <span>Email</span>,
      dataIndex: "email",
      key: "email",
      render: (email) => <span>{email}</span>,
    },
    {
      title: <span>Phone</span>,
      dataIndex: "phone",
      key: "phone",
      render: (phone) => <span>{phone}</span>,
    },
    {
      title: <span>Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div className="flex items-center gap-1">
          {status === "Active" ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">{status}</Tag>
          )}
          <Button
            title="Change Status"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openStatusModal(record)}
          />
        </div>
      ),
    },
    {
      title: <span>Delete</span>,
      key: "delete",
      render: (_, record) => (
        <Space size="middle">
          <DeleteOutlined
            className="text-[23px] text-red-400 hover:text-red-500 cursor-pointer transition-colors"
            onClick={() => handleDeleteInstructor(record)}
          />
        </Space>
      ),
    },
  ];

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <Search
          placeholder="Search by instructor name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={(value) => {
            setFilters((prevFilters) => ({
              ...prevFilters,
              name: value || null,
              page: 1,
            }));
          }}
          style={{ width: 350 }}
          size="large"
          allowClear
        />
        <AddInstructor refetch={refetch} />
      </div>

      <Table
        columns={columns}
        dataSource={usersList?.data?.users || []}
        rowKey="_id"
        pagination={false}
        className="border border-gray-200"
      />

      {/* Status Change Modal */}
      <Modal
        title="Change Instructor Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => {
          setIsStatusModalOpen(false);
          setSelectedInstructor(null);
          setNewStatus("");
        }}
        okText="Update"
        cancelText="Cancel"
        confirmLoading={isStatusChangeLoading}
      >
        <p className="mb-2">
          Select new status for <strong>{selectedInstructor?.name}</strong>:
        </p>
        <Select
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
          style={{ width: "100%" }}
          size="large"
        >
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Deactive">Deactive</Select.Option>
        </Select>
      </Modal>
    </div>
  );
}

export default Instructors;
