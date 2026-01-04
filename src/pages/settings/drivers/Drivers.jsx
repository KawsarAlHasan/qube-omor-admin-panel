import React, { useState } from "react";
import { useUsersDriverList } from "../../../api/userApi";
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
  EyeOutlined,
} from "@ant-design/icons";
import AddDriver from "./AddDriver";
import { API } from "../../../api/api";
import userIcon from "../../../assets/icons/userIcon.png";
import ViewDriverOrders from "./ViewDriverOrders";
import { useNavigate } from "react-router-dom";
import EditDriver from "./EditDriver";
import { usePermission } from "../../../hooks/usePermission";

const { Search } = Input;
const { confirm } = Modal;

function Drivers() {
  const { canCreate, canEdit, canDelete, canChangeStatus, canViewDetails } =
    usePermission();
  const [searchText, setSearchText] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isStatusChangeLoading, setIsStatusChangeLoading] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    role: "Driver",
    page: 1,
    limit: 2000,
    name: searchText,
  });

  const { usersList, isLoading, isError, error, refetch } =
    useUsersDriverList(filters);

  const navitete = useNavigate();

  const openStatusModal = (record) => {
    setSelectedDriver(record);
    setNewStatus(record?.status);
    setIsStatusModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedDriver) return;

    setIsStatusChangeLoading(true);

    try {
      await API.put(`/user/today-paid-us/${selectedDriver._id}`, {
        status: newStatus,
      });

      message.success("Driver paid amount updated successfully!");
      setIsStatusModalOpen(false);
      setSelectedDriver(null);
      setNewStatus("");
      refetch();
    } catch (err) {
      console.log(err.response);
      message.error(
        err.response?.data?.message || "Failed to update driver paid amount"
      );
    } finally {
      setIsStatusChangeLoading(false);
    }
  };

  const handleDeleteDriver = (record) => {
    confirm({
      title: "Are you sure you want to delete this driver?",
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete ${record?.name} from the system.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await API.delete(`/auth/delete/${record?._id}`);
          message.success("Driver deleted successfully!");
          refetch();
        } catch (err) {
          console.log(err.response);
          message.error(
            err.response?.data?.message || "Failed to delete driver"
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
      title: <span>Driver</span>,
      dataIndex: "driver",
      key: "driver",
      render: (_, record) => (
        <div className="flex flex-items-center gap-2">
          <img
            className="w-[40px] h-[40px] rounded-full mt-1"
            src={record?.profile_image || userIcon}
            alt={record?.name}
          />
          <div className="">
            <h1 className="">{record?.name}</h1>
            <p className="text-sm text-gray-600 mt-[-5px]">{record?.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: <span>Phone</span>,
      dataIndex: "phone",
      key: "phone",
      render: (phone) => <span>{phone}</span>,
    },

    {
      title: <span>Today Delivered Orders</span>,
      dataIndex: "stats",
      key: "stats",
      render: (stats) => (
        <span>
          ${stats?.todayDeliveryEarnings?.toFixed(2) || 0} (
          {stats?.deliveredOrdersCount || 0})
        </span>
      ),
    },
    {
      title: <span>Today Ongoing Orders</span>,
      dataIndex: "stats",
      key: "stats",
      render: (stats) => (
        <span>
          ${stats?.ongoingDeliveryEarnings?.toFixed(2) || 0} (
          {stats?.ongoingOrdersCount || 0})
        </span>
      ),
    },
    {
      title: <span>Today Cancelled Orders</span>,
      dataIndex: "stats",
      key: "stats",
      render: (stats) => (
        <span>
          ${stats?.cancelledAmount?.toFixed(2) || 0} (
          {stats?.cancelledOrdersCount || 0})
        </span>
      ),
    },

    ...(canViewDetails("drivers")
      ? [
          {
            title: <span>View Details</span>,
            dataIndex: "details",
            key: "details",
            render: (_, record) => (
              <div className="flex items-center gap-1">
                <Button
                  title="Change Status"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => navitete(`/drivers/${record?._id}`)}
                >
                  Details
                </Button>
              </div>
            ),
          },
        ]
      : []),

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

          {canChangeStatus("drivers") && (
            <Button
              title="Change Status"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openStatusModal(record)}
            />
          )}
        </div>
      ),
    },

    ...(canEdit("drivers")
      ? [
          {
            title: <span>Edit</span>,
            dataIndex: "edit",
            key: "edit",
            render: (_, record) => (
              <EditDriver record={record} refetch={refetch} />
            ),
          },
        ]
      : []),
    ...(canDelete("drivers")
      ? [
          {
            title: <span>Delete</span>,
            key: "delete",
            render: (_, record) => (
              <Space size="middle">
                <DeleteOutlined
                  className="text-[23px] text-red-400 hover:text-red-500 cursor-pointer transition-colors"
                  onClick={() => handleDeleteDriver(record)}
                />
              </Space>
            ),
          },
        ]
      : []),
  ];

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  return (
    <div className="p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <Search
          placeholder="Search by driver name..."
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
        {canCreate("drivers") && <AddDriver refetch={refetch} />}
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
        title="Change Driver Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => {
          setIsStatusModalOpen(false);
          setSelectedDriver(null);
          setNewStatus("");
        }}
        okText="Update"
        cancelText="Cancel"
        confirmLoading={isStatusChangeLoading}
      >
        <p className="mb-2">
          Select new status for <strong>{selectedDriver?.name}</strong>:
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

      <ViewDriverOrders
        record={selectedDriver}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}

export default Drivers;
