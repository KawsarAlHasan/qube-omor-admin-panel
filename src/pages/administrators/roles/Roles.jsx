import React, { useState } from "react";
import AddRole from "./AddRole";
import ViewRole from "./ViewRole";
import EditRole from "./EditRole";
import DeleteRole from "./DeleteRole.jsx";
import { useRolesList } from "../../../api/api";
import IsLoading from "../../../components/IsLoading";
import IsError from "../../../components/IsError";
import { Table, Card, Tag, Badge, Tooltip, Space, Button } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

function Roles() {
  const { rolesList, isLoading, isError, error, refetch } = useRolesList();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  const dataSource = rolesList?.data || [];

  // Modal handlers
  const handleView = (record) => {
    setSelectedRole(record);
    setViewModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRole(record);
    setEditModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedRole(record);
    setDeleteModalOpen(true);
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
            <SafetyOutlined className="text-white text-lg" />
          </div>
          <div>
            <div className="font-semibold text-gray-800 text-base capitalize">
              {name}
            </div>
            <div className="text-xs text-gray-500">Role</div>
          </div>
        </div>
      ),
    },
    {
      title: "Accessible Modules",
      dataIndex: "permissions",
      key: "modules",
      // width: 350,
      render: (permissions) => (
        <div className="flex flex-wrap gap-0">
          {permissions.slice(0, 8).map((perm, index) => (
            <Tooltip key={index} title={perm.name}>
              <Tag color="blue" className="text-xs rounded-full px-3 py-1">
                {perm.accessibleModule}
              </Tag>
            </Tooltip>
          ))}
          {permissions.length > 8 && (
            <Tag color="default" className="text-xs rounded-full px-3 py-1">
              +{permissions.length - 8} more
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          {record.name !== "Super Admin" && (
            <>
              <Tooltip title="View Details">
                <Button
                  type="default"
                  icon={<EyeOutlined size="large" />}
                  className="text-blue-600 hover:bg-blue-50 transition-all"
                  onClick={() => handleView(record)}
                />
              </Tooltip>
              <Tooltip title="Edit Role">
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  className="text-green-600 hover:bg-green-50 transition-all"
                  onClick={() => handleEdit(record)}
                />
              </Tooltip>
              <Tooltip title="Delete Role">
                <Button
                  type="default"
                  icon={<DeleteOutlined />}
                  className="text-red-600 hover:bg-red-50 transition-all"
                  onClick={() => handleDelete(record)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header Section */}
        <AddRole refetch={refetch} />

        {/* Table Section */}
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="_id"
          pagination={false}
          className="roles-table"
          scroll={{ x: 1200 }}
          // rowClassName="hover:bg-gray-50 transition-colors duration-200"
        />
      </div>

      {/* Modals */}
      <ViewRole
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedRole(null);
        }}
        roleData={selectedRole}
      />

      <EditRole
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedRole(null);
        }}
        roleData={selectedRole}
        refetch={refetch}
      />

      <DeleteRole
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedRole(null);
        }}
        roleData={selectedRole}
        refetch={refetch}
      />

      {/* <style jsx>{`
        .roles-table :global(.ant-table-thead > tr > th) {
          background: linear-gradient(to right, #f8fafc, #f1f5f9);
          font-weight: 600;
          color: #1e293b;
          border-bottom: 2px solid #e2e8f0;
        }

        .roles-table :global(.ant-table-tbody > tr:hover > td) {
          background: #f8fafc;
        }

        .roles-table :global(.ant-badge-count) {
          font-weight: 600;
        }
      `}</style> */}
    </div>
  );
}

export default Roles;
