import React, { useState } from "react";
import { Modal, Button, message, Alert } from "antd";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { API } from "../../../api/api";

const DeleteRole = ({ isOpen, onClose, roleData, refetch }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await API.delete(`/role/delete/${roleData._id}`);

      message.success("Role deleted successfully!");
      refetch?.();
      onClose();
    } catch (err) {
      console.log(err, "err");
      message.error(err.response?.data?.message || "Failed to delete role");
    } finally {
      setLoading(false);
    }
  };

  if (!roleData) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={550}
      centered
      closable={false}
    >
      <div className="text-center py-6">
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center animate-pulse">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <DeleteOutlined className="text-white text-3xl" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Role</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this role?
        </p>

        {/* Role Info Card */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-5 mb-6 border border-red-200">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-md">
              <ExclamationCircleOutlined className="text-white text-xl" />
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-600 font-medium">Role Name</div>
              <div className="text-lg font-bold text-gray-800 capitalize">
                {roleData.name}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-600 mb-1">Modules</div>
              <div className="text-xl font-bold text-red-600">
                {roleData.permissions.length}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-600 mb-1">Created</div>
              <div className="text-sm font-bold text-gray-700">
                {new Date(roleData.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Warning Alert */}
        <Alert
          message="Warning: This action cannot be undone!"
          description="Deleting this role will permanently remove all associated permissions and access rights. Users assigned to this role may lose their access."
          type="warning"
          icon={<WarningOutlined />}
          showIcon
          className="mb-6 text-left"
        />

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            size="large"
            onClick={onClose}
            className="flex-1 rounded-lg h-12 font-semibold"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            danger
            size="large"
            onClick={handleDelete}
            loading={loading}
            className="flex-1 rounded-lg h-12 font-semibold"
            icon={<DeleteOutlined />}
          >
            Yes, Delete Role
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteRole;