import { useState } from "react";
import {
  Table,
  Space,
  Tag,
  Button,
  Modal,
  Select,
  message,
  Input,
  Form,
} from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { DeleteFilled, EditOutlined, DollarOutlined } from "@ant-design/icons";
import ViewUser from "./ViewUser";
import { useUsersList } from "../../api/userApi";
import userIcon from "../../assets/icons/userIcon.png";
import { API } from "../../api/api";

const { Search } = Input;

function UserManagement() {
  const [searchText, setSearchText] = useState("");
  const [userDetailsData, setUserDetailsData] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Status change modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  // Credit modal
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [isCreditLoading, setIsCreditLoading] = useState(false);

  // Filter state
  const [filter, setFilter] = useState({
    role: "User",
    page: 1,
    limit: 10,
    name: "",
  });

  const { usersList, isLoading, isError, error, refetch } =
    useUsersList(filter);

  const handleUserDetails = (userData) => {
    setUserDetailsData(userData);
    setIsViewModalOpen(true);
  };

  // Open status modal
  const openStatusModal = (user) => {
    setSelectedUser(user);
    setNewStatus(user?.status);
    setIsStatusModalOpen(true);
  };

  // Open Credit modal
  const openCreditModal = (user) => {
    setSelectedUser(user);
    setCreditAmount("");
    setIsCreditModalOpen(true);
  };

  // Update status
  const handleStatusChange = async () => {
    if (!selectedUser) return;

    setIsStatusLoading(true);
    try {
      await API.put(`/user/status-change/${selectedUser._id}`, {
        status: newStatus,
      });

      message.success("User status updated successfully!");
      setIsStatusModalOpen(false);
      setSelectedUser(null);
      refetch();
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Failed to update User status"
      );
    } finally {
      setIsStatusLoading(false);
    }
  };

  // Give Credit
  const handleGiveCredit = async () => {
    if (!creditAmount || creditAmount <= 0) {
      return message.error("Enter a valid credit amount!");
    }

    setIsCreditLoading(true);
    try {
      await API.put(`/credit/admin-give-credit`, {
        userId: selectedUser._id,
        creditId: "dhdfod",
      });

      message.success("Credit added successfully!");
      setIsCreditModalOpen(false);
      setCreditAmount("");
      setSelectedUser(null);
      refetch();
    } catch (err) {
      message.error(err?.response?.data?.message || "Failed to add credit");
    } finally {
      setIsCreditLoading(false);
    }
  };

  const handleModalClose = () => {
    setUserDetailsData(null);
    setIsViewModalOpen(false);
  };

  const handleTableChange = (pagination) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const columns = [
    {
      title: "User",
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
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },

    {
      title: "Total Credits",
      key: "credit",
      render: (_, record) => (
        <div className="flex gap-2 items-center">
          <span>{record?.credit} Credits</span>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tag color={record.status === "Active" ? "green" : "red"}>
            {record.status}
          </Tag>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openStatusModal(record)}
          />
        </div>
      ),
    },

    {
      title: "Delete",
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

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <Search
          placeholder="Search by User name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={(value) =>
            setFilter((prev) => ({ ...prev, name: value, page: 1 }))
          }
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
      />

      {/* User View Modal */}
      <ViewUser
        userDetailsData={userDetailsData}
        isOpen={isViewModalOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />

      {/* Status Modal */}
      <Modal
        title="Change User Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalOpen(false)}
        okText="Update"
        confirmLoading={isStatusLoading}
      >
        <p>Select new status:</p>
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

      {/* Credit Give Modal */}
      <Modal
        title="Add Credits to User"
        open={isCreditModalOpen}
        onCancel={() => setIsCreditModalOpen(false)}
        onOk={handleGiveCredit}
        okText="Add Credits"
        confirmLoading={isCreditLoading}
      >
        <p className="mb-2">Enter credit amount to add:</p>

        <Input
          type="number"
          placeholder="Enter credit amount"
          value={creditAmount}
          onChange={(e) => setCreditAmount(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default UserManagement;
