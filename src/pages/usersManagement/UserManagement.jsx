import { useState } from "react";
import { Table, Space, Tag, Button, Modal, Select, message } from "antd";
import { MdBlock } from "react-icons/md";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { DeleteFilled, EditOutlined, EyeOutlined } from "@ant-design/icons";
import ViewUser from "./ViewUser";
import { useAllUsers } from "../../services/userService";

function UserManagement() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const [userDetailsData, setUserDetailsData] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Status change modal states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const [isStatusChangeLoading, setIsStatusChangeLoading] = useState(false);

  const { allUsers, pagination, isLoading, isError, error, refetch } =
    useAllUsers(filter);

  const handleUserDetails = (userData) => {
    setUserDetailsData(userData);
    setIsViewModalOpen(true);
  };

  const openStatusModal = (record) => {
    setSelectedCategory(record);
    setNewStatus(record.status); // default current status
    setIsStatusModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedCategory) return;

    setIsStatusChangeLoading(true);

    try {
      // await API.patch(`/category/${selectedCategory.id}`, {
      //   status: newStatus,
      // });
      message.success("User status updated successfully!");
      setIsStatusModalOpen(false);
      setSelectedCategory(null);
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

  const handleModalClose = () => {
    setUserDetailsData(null);

    setIsViewModalOpen(false);
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
      title: <span>Sl no.</span>,
      dataIndex: "serial_number",
      key: "serial_number",
      render: (serial_number) => <span>#{serial_number}</span>,
    },
    {
      title: <span>User</span>,
      dataIndex: "full_name",
      key: "full_name",
      render: (_, record) => (
        <div className="flex flex-items-center gap-2">
          <img
            className="w-[40px] h-[40px] rounded-full"
            src={record.profile}
            alt={record.full_name}
          />
          <h1 className="mt-2">{record.full_name}</h1>
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
      title: <span>Total Credits</span>,
      dataIndex: "total_scan",
      key: "total_scan",
      render: (total_scan) => <span>{total_scan}</span>,
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
          <Button
            className="-ml-1"
            title="Status Change"
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
          <DeleteFilled
            className="text-[23px] text-red-400 hover:text-red-300 cursor-pointer"
            onClick={() => handleUserDetails(record)}
          />
        </Space>
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
      <Table
        columns={columns}
        dataSource={allUsers}
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

      <ViewUser
        userDetailsData={userDetailsData}
        isOpen={isViewModalOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />

      {/* Status Change Modal */}
      <Modal
        title="Change User Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalOpen(false)}
        okText="Update"
        confirmLoading={isStatusChangeLoading}
      >
        <p className="mb-2">Select new status for this user:</p>
        <Select
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
          style={{ width: "100%" }}
        >
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Deactive">Deactive</Select.Option>
        </Select>
      </Modal>
    </div>
  );
}

export default UserManagement;
