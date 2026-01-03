import React from "react";
import { Modal, Descriptions, Tag, Badge, Divider, Empty } from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const ViewRole = ({ isOpen, onClose, roleData }) => {
  if (!roleData) return null;

  const formatModuleName = (module) => {
    return module
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const permissionTypes = [
    { key: "view", label: "View", color: "green" },
    { key: "create", label: "Create", color: "blue" },
    { key: "edit", label: "Edit", color: "orange" },
    { key: "delete", label: "Delete", color: "red" },
    { key: "driverAssign", label: "Driver Assign", color: "purple" },
    { key: "statusChange", label: "Status Change", color: "cyan" },
    { key: "paidStatusChange", label: "Paid Status", color: "magenta" },
    { key: "attendanceChange", label: "Attendance", color: "geekblue" },
    { key: "userCreditChange", label: "User Credit", color: "volcano" },
    { key: "veiwDetails", label: "View Details", color: "lime" },
  ];

  const getEnabledPermissions = (permission) => {
    return permissionTypes.filter((perm) => permission[perm.key]);
  };

  const getTotalPermissionsCount = () => {
    let total = 0;
    roleData.permissions.forEach((perm) => {
      permissionTypes.forEach((type) => {
        if (perm[type.key]) total++;
      });
    });
    return total;
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <EyeOutlined className="text-white text-lg" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-800">Role Details</div>
            <div className="text-sm font-normal text-gray-500">
              View complete role information
            </div>
          </div>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      className="top-5"
    >
      <div className="py-4">
        {/* Role Information */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <Descriptions column={2} bordered>
            <Descriptions.Item
              label={<span className="font-semibold">Role Name</span>}
              span={2}
            >
              <span className="text-lg font-bold text-gray-800 capitalize">
                {roleData.name}
              </span>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="font-semibold">Total Modules</span>}
              span={1}
            >
              <Badge
                count={roleData.permissions.length}
                showZero
                style={{ backgroundColor: "#52c41a" }}
              />
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="font-semibold">Total Permissions</span>}
              span={1}
            >
              <Badge
                count={getTotalPermissionsCount()}
                showZero
                style={{ backgroundColor: "#1890ff" }}
              />
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider orientation="left">
          <span className="text-lg font-bold text-gray-800">
            Module Permissions
          </span>
        </Divider>

        {/* Permissions List */}
        <div className="max-h-[550px] overflow-y-auto pr-2 space-y-4">
          {roleData.permissions.map((permission, index) => {
            const enabledPerms = getEnabledPermissions(permission);
            return (
              <div
                key={permission._id}
                className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all bg-white"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-1">
                      {index + 1}. {formatModuleName(permission.accessibleModule)}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Tag color="blue" className="text-xs">
                        {permission.accessibleModule}
                      </Tag>
                      <span className="text-xs text-gray-500">
                        {enabledPerms.length} permissions enabled
                      </span>
                    </div>
                  </div>
                </div>

                {/* Only show enabled permissions */}
                {enabledPerms.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {enabledPerms.map((perm) => (
                      <div
                        key={perm.key}
                        className="flex items-center gap-2 py-2 px-3 rounded-lg border bg-green-50 border-green-200 hover:bg-green-100 transition-all"
                      >
                        <CheckCircleOutlined className="text-green-600" />
                        <div>
                          <div className="text-sm font-medium text-green-700">
                            {perm.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No permissions enabled"
                    className="my-4"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ViewRole;