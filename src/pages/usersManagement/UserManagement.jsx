import { useState } from "react";
import { Table, Space, Tag, Button, Modal, Select, message, Input } from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { DeleteFilled, EditOutlined } from "@ant-design/icons";
import ViewUser from "./ViewUser";
import { useUsersList } from "../../api/userApi";
import userIcon from "../../assets/icons/userIcon.png";
import { API } from "../../api/api";

const { Search } = Input;

function UserManagement() {
  const [searchText, setSearchText] = useState("");
  const [userDetailsData, setUserDetailsData] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Status change modal states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const [isStatusChangeLoading, setIsStatusChangeLoading] = useState(false);

  // Combine all filter parameters in one state
  const [filter, setFilter] = useState({
    role: "User",
    page: 1,
    limit: 10,
    name: "", // search query
  });

  const { usersList, isLoading, isError, error, refetch } =
    useUsersList(filter);

  const handleUserDetails = (userData) => {
    setUserDetailsData(userData);
    setIsViewModalOpen(true);
  };

  const openStatusModal = (record) => {
    setSelectedCategory(record);
    setNewStatus(record?.status); // default current status
    setIsStatusModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedCategory) return;
    setIsStatusChangeLoading(true);
    try {
      await API.put(`/user/status-change/${selectedCategory._id}`, {
        status: newStatus,
      });

      message.success("User status updated successfully!");
      setIsStatusModalOpen(false);
      setSelectedCategory(null);
      setNewStatus("");
      refetch();
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Failed to update User status"
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
      dataIndex: "index",
      key: "index",
      render: (_, record, index) => (
        <span>#{index + 1 + (filter.page - 1) * filter.limit}</span>
      ),
    },
    {
      title: <span>User</span>,
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex flex-items-center gap-2">
          <img
            className="w-[40px] h-[40px] rounded-full"
            src={record?.profile_image || userIcon}
            alt={record?.name}
          />
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
      title: <span>Total Credits</span>,
      dataIndex: "credit",
      key: "credit",
      render: (credit) => <span>{credit} Credits</span>,
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
      <div className="flex justify-between items-center mb-2">
        <Search
          placeholder="Search by User name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={(value) => {
            setFilter((prevFilter) => ({
              ...prevFilter,
              name: value || null,
              page: 1,
            }));
          }}
          style={{ width: 350 }}
          size="large"
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={usersList?.data?.users}
        rowKey="_id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: usersList?.data?.pagination?.total,
          showSizeChanger: true,
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
