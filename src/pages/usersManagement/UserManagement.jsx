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
import {
  DeleteFilled,
  EditOutlined,
  DollarOutlined,
  GiftOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import ViewUser from "./ViewUser";
import { useUsersList } from "../../api/userApi";
import userIcon from "../../assets/icons/userIcon.png";
import { API } from "../../api/api";
import { useCredits } from "../../api/spaApi";
import CreditsDetails from "./CreditsDetails";

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
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isCreditLoading, setIsCreditLoading] = useState(false);

  // Credit view modal
  const [isCreditViewModalOpen, setIsCreditViewModalOpen] = useState(null);

  // Filter state
  const [filter, setFilter] = useState({
    role: "User",
    page: 1,
    limit: 10,
    name: "",
  });

  const { usersList, isLoading, isError, error, refetch } =
    useUsersList(filter);

  const {
    credits,
    isLoading: creditIsLoading,
    refetch: creditRefetch,
  } = useCredits();

  const handleUserDetails = (userData) => {
    setUserDetailsData(userData);
    setIsViewModalOpen(true);
  };

  const handleCreditsDetails = (userData) => {
    setSelectedUser(userData);
    setIsCreditViewModalOpen(true);
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
    if (!selectedCredit) {
      return message.error("Please select a credit package!");
    }

    setIsCreditLoading(true);
    try {
      await API.put(`/credit/admin-give-credit`, {
        userId: selectedUser._id,
        creditId: selectedCredit,
      });

      message.success("Credit added successfully!");
      setIsCreditModalOpen(false);
      setSelectedCredit(null);
      setSelectedUser(null);
      refetch();
      creditRefetch();
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

  const handleCreditsModalClose = () => {
    setSelectedUser(null);
    setIsCreditViewModalOpen(false);
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
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openCreditModal(record)}
          />
        </div>
      ),
    },
    {
      title: "View Credits",
      dataIndex: "credit",
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleCreditsDetails(record)}
        >
          View Credits
        </Button>
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

      <CreditsDetails
        userData={selectedUser}
        isOpen={isCreditViewModalOpen}
        onClose={handleCreditsModalClose}
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
        title={
          <div className="flex items-center gap-3 pb-2">
            <div className="w-10 h-10 my-main-button rounded-full flex items-center justify-center">
              <GiftOutlined className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 m-0">
                Give Credit by Cash
              </h3>
              <p className="text-xs text-gray-500 m-0">
                Manually assign credits to users
              </p>
            </div>
          </div>
        }
        open={isCreditModalOpen}
        onCancel={() => {
          setIsCreditModalOpen(false);
          setSelectedCredit(null);
        }}
        onOk={handleGiveCredit}
        okText="Give Credit by Cash"
        confirmLoading={isCreditLoading}
        width={500}
      >
        {/* Credit Package Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <CreditCardOutlined className="mr-2" />
            Select Credit Package
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {credits?.data?.map((credit) => (
              <div
                key={credit._id}
                onClick={() => setSelectedCredit(credit._id)}
                className={`
            relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-200
            ${
              selectedCredit === credit._id
                ? "border-indigo-500 bg-indigo-50 shadow-md scale-105"
                : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm"
            }
          `}
              >
                {selectedCredit === credit._id && (
                  <CheckCircleOutlined className="absolute top-2 right-2 text-indigo-500 text-lg" />
                )}

                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      selectedCredit === credit._id
                        ? "text-indigo-600"
                        : "text-gray-800"
                    }`}
                  >
                    {credit.credit}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">credits</div>
                  <div className="flex items-center justify-center gap-1 text-green-600 font-semibold">
                    <DollarOutlined />
                    {credit.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default UserManagement;
