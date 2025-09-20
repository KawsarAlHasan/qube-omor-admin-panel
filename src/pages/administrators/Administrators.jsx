import { Avatar, message, Modal, Space, Table } from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
// import { API, useAllAdmins } from "../../api/api";
import AddAdmin from "./AddAmin";
import AdminEdit from "./AdminEdit";
import { useAdministrators } from "../../services/administratorsService";

function Administrators() {
  // const { allAdmins } = useAllAdmins();

  const { administrators, isLoading, isError, error, refetch } =
    useAdministrators();

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
          // await API.post(`/admin/administrators/${adminId}/action/`, {
          //   action: "delete",
          // });
          message.success("Admin deleted successfully!");
          refetch();
        } catch (err) {
          message.error(err.response?.data?.error || "Failed to delete admin");
        }
      },
    });
  };

  const columns = [
    {
      title: <span>Sl no.</span>,
      dataIndex: "serial_number",
      key: "serial_number",
      render: (serial_number) => <span className="">#{serial_number}</span>,
    },
    {
      title: <span>Name</span>,
      dataIndex: "full_name",
      key: "full_name",
      render: (full_name) => <span className="">{full_name}</span>,
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
      render: (role) => <span className="">{role}</span>,
    },
    {
      title: <span>Action</span>,
      key: "action",
      render: (_, record) => {
        const isSuperAdmin = record.role === "superadmin";

        return (
          <Space size="middle">
            <AdminEdit adminProfile={record} refetch={refetch} />

            <DeleteOutlined
              className={`text-[23px] bg-[#E30000] p-1 rounded-sm text-white ${
                isSuperAdmin
                  ? "cursor-not-allowed opacity-50"
                  : "hover:text-red-300 cursor-pointer"
              }`}
              onClick={
                isSuperAdmin ? undefined : () => showDeleteConfirm(record.id)
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
      <AddAdmin refetch={refetch} />

      <Table
        columns={columns}
        dataSource={administrators}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />
    </div>
  );
}

export default Administrators;
