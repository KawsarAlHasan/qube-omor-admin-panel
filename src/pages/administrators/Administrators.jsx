import { Avatar, Button, message, Modal, Space, Table, Tag } from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AddAdmin from "./AddAmin";
import AdminEdit from "./AdminEdit";
import { API, useAdminList, useRolesList } from "../../api/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MdManageAccounts } from "react-icons/md";

function Administrators() {
  const { adminList, isLoading, isError, error, refetch } = useAdminList();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const { rolesList } = useRolesList();
  const roles = rolesList?.data || [];

  // Open status change modal
  const openStatusModal = (record) => {
    setSelectedAdmin(record);
    setIsStatusModalOpen(true);
  };

  // Handle status change
  const handleStatusChange = async () => {
    try {
      const newStatus =
        selectedAdmin.status === "Active" ? "Deactive" : "Active";

      await API.put(`/admin/status-change/${selectedAdmin._id}`, {
        status: newStatus,
      });

      message.success(`Status changed to ${newStatus} successfully`);
      setIsStatusModalOpen(false);
      refetch();
    } catch (err) {
      message.error(err?.response?.data?.message || "Failed to change status");
    }
  };

  // 🗑️ delete confirm modal
  const showDeleteConfirm = (adminId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this admin?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await API.delete(`/admin/delete/${adminId}`);
          message.success("Admin deleted successfully!");
          refetch();
        } catch (err) {
          message.error(
            err.response?.data?.message || "Failed to delete admin"
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
      render: (_, record, index) => <span className="">#{index + 1}</span>,
    },
    {
      title: <span>Name</span>,
      dataIndex: "name",
      key: "name",
      render: (name) => <span className="">{name}</span>,
    },
    {
      title: <span>Email</span>,
      dataIndex: "email",
      key: "email",
      render: (email) => <span className="">{email}</span>,
    },
    {
      title: <span>Phone</span>,
      dataIndex: "phone",
      key: "phone",
      render: (phone) => <span className="">{phone}</span>,
    },
    {
      title: <span>Has Access To</span>,
      dataIndex: "role",
      key: "role",
      render: (role) => <span className="">{role?.name}</span>,
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
      title: <span>Action</span>,
      key: "action",
      render: (_, record) => {
        const isSuperAdmin = record.role === "Super Admin";

        return (
          <Space size="middle">
            <AdminEdit adminProfile={record} refetch={refetch} roles={roles} />

            <DeleteOutlined
              className={`text-[23px] bg-[#E30000] p-1 rounded-sm text-white ${
                isSuperAdmin
                  ? "cursor-not-allowed opacity-50"
                  : "hover:text-red-300 cursor-pointer"
              }`}
              onClick={
                isSuperAdmin ? undefined : () => showDeleteConfirm(record?._id)
              }
            />
          </Space>
        );
      },
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
      <div className="flex justify-between items-center mb-4">
        <AddAdmin refetch={refetch} roles={roles} />
        <Link to="/administrators/roles">
          <Button
            size="large"
            icon={<MdManageAccounts size={25} />}
            type="primary"
            className="my-main-button"
          >
            Roles Management
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={adminList?.data}
        rowKey="_id"
        loading={isLoading}
        pagination={false}
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
          <strong>{selectedAdmin?.status}</strong> to{" "}
          <strong>
            {selectedAdmin?.status === "Active" ? "Deactive" : "Active"}
          </strong>
          ?
        </p>
      </Modal>
    </div>
  );
}

export default Administrators;
