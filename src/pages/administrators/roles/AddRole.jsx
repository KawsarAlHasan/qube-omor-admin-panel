import React, { useState } from "react";
import { Button, Modal, Form, Input, Checkbox, message, Divider } from "antd";
import { FaPlus } from "react-icons/fa";
import { API } from "../../../api/api";

const accessibleModules = [
  "dashboard",
  "food-details",
  "food-orders",
  "food-category",
  "ingredients",
  "spa-classes",
  "spa-booking",
  "physio-classes",
  "physio-booking",
  "classes",
  "classes-booking",
  "credits",
  "credits-buyers",
  "user-management",
  "user-massages",
  "administrators",
  "drivers",
  "instructors",
  "coupon-code",
  "legal-and-banner",
];

const permissionTypes = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
  { key: "driverAssign", label: "Driver Assign" },
  { key: "statusChange", label: "Status Change" },
  { key: "paidStatusChange", label: "Paid Status" },
  { key: "attendanceChange", label: "Attendance" },
  { key: "userCreditChange", label: "User Credit" },
  { key: "veiwDetails", label: "View Details" },
];

// Module-specific permissions configuration
const modulePermissions = {
  dashboard: ["view"],
  "food-details": ["view", "create", "edit", "delete", "statusChange"],
  "food-orders": [
    "view",
    "edit",
    "driverAssign",
    "statusChange",
    "paidStatusChange",
  ],
  "food-category": ["view", "create", "edit", "delete", "statusChange"],
  ingredients: ["view", "create", "edit", "delete", "statusChange"],
  "spa-classes": ["view", "create", "edit", "delete"],
  "spa-booking": ["view", "attendanceChange"],
  "physio-classes": ["view", "create", "edit", "delete"],
  "physio-booking": ["view", "attendanceChange"],
  classes: ["view", "create", "edit", "delete"],
  "classes-booking": ["view", "attendanceChange"],
  credits: ["view", "create", "edit", "delete", "statusChange"],
  "credits-buyers": ["view", "paidStatusChange", "userCreditChange"],
  "user-management": [
    "view",
    "create",
    "edit",
    "delete",
    "statusChange",
    "userCreditChange",
  ],
  "user-massages": ["view", "create"],
  administrators: ["view", "create", "edit", "delete", "statusChange"],
  drivers: ["view", "create", "edit", "delete", "statusChange", "veiwDetails"],
  instructors: ["view", "create", "edit", "delete", "statusChange"],
  "coupon-code": ["view", "create", "edit", "delete", "statusChange"],
  "legal-and-banner": ["view", "edit"],
};

const AddRole = ({ refetch, color }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
    setPermissions({});
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPermissions({});
    form.resetFields();
  };

  const handlePermissionChange = (module, permissionKey, checked) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permissionKey]: checked,
      },
    }));
  };

  const handleSelectAll = (module) => {
    const allowedPermissions = modulePermissions[module] || [];
    const allSelected = allowedPermissions.every(
      (permKey) => permissions[module]?.[permKey]
    );

    setPermissions((prev) => ({
      ...prev,
      [module]: allowedPermissions.reduce((acc, permKey) => {
        acc[permKey] = !allSelected;
        return acc;
      }, {}),
    }));
  };

  // Global Select All / Deselect All
  const handleGlobalSelectAll = () => {
    const allSelected = accessibleModules.every((module) => {
      const allowedPermissions = modulePermissions[module] || [];
      return allowedPermissions.every(
        (permKey) => permissions[module]?.[permKey]
      );
    });

    const newPermissions = {};
    accessibleModules.forEach((module) => {
      const allowedPermissions = modulePermissions[module] || [];
      newPermissions[module] = allowedPermissions.reduce((acc, permKey) => {
        acc[permKey] = !allSelected;
        return acc;
      }, {});
    });

    setPermissions(newPermissions);
  };

  // Check if all permissions are selected
  const isAllSelected = () => {
    return accessibleModules.every((module) => {
      const allowedPermissions = modulePermissions[module] || [];
      return allowedPermissions.every(
        (permKey) => permissions[module]?.[permKey]
      );
    });
  };

  const formatModuleName = (module) => {
    return module
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getModulePermissions = (module) => {
    const allowedPermissionKeys = modulePermissions[module] || [];
    return permissionTypes.filter((perm) =>
      allowedPermissionKeys.includes(perm.key)
    );
  };

  const handleFinish = async (values) => {
    // Validate that at least one permission is selected
    const permissionsArray = Object.entries(permissions)
      .filter(([_, perms]) => Object.values(perms).some((v) => v === true))
      .map(([module, perms]) => ({
        accessibleModule: module,
        view: perms.view || false,
        create: perms.create || false,
        edit: perms.edit || false,
        delete: perms.delete || false,
        driverAssign: perms.driverAssign || false,
        statusChange: perms.statusChange || false,
        paidStatusChange: perms.paidStatusChange || false,
        attendanceChange: perms.attendanceChange || false,
        userCreditChange: perms.userCreditChange || false,
        veiwDetails: perms.veiwDetails || false,
      }));

    if (permissionsArray.length === 0) {
      message.error("Please select at least one permission for a module");
      return;
    }

    try {
      setLoading(true);

      await API.post("/role/create", {
        name: values.name,
        permissions: permissionsArray,
      });

      message.success("Role created successfully!");
      refetch?.();
      handleCancel();
    } catch (err) {
      console.error(err, "err");
      message.error(err.response?.data?.message || "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        size="large"
        className={color ? `bg-${color}` : "mb-2 my-main-button"}
        onClick={showModal}
      >
        <FaPlus className="mr-2" />
        New Role Create
      </Button>

      <Modal
        title={
          <span className="text-xl font-bold text-gray-800">
            Create New Role
          </span>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={1200}
        className="top-5"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {/* Role Name Input */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">Role Name</span>
            }
            name="name"
            rules={[
              { required: true, message: "Please enter role name" },
              { min: 3, message: "Role name must be at least 3 characters" },
            ]}
          >
            <Input
              placeholder="Enter role name"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          {/* Permissions Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-base font-semibold text-gray-700">
                Permissions <span className="text-red-500">*</span>
              </label>

              {/* Global Select/Deselect All Button */}
              <Button
                type="primary"
                size="middle"
                onClick={handleGlobalSelectAll}
                className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
              >
                {isAllSelected()
                  ? "Deselect All Modules"
                  : "Select All Modules"}
              </Button>
            </div>

            <div className="max-h-[630px] overflow-y-auto pr-2 space-y-4">
              {accessibleModules.map((module, index) => (
                <div
                  key={module}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all hover:shadow-sm bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-800">
                      {index + 1}. {formatModuleName(module)}
                    </h3>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => handleSelectAll(module)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {modulePermissions[module]?.every(
                        (permKey) => permissions[module]?.[permKey]
                      )
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {getModulePermissions(module).map((permission) => (
                      <div
                        key={permission.key}
                        className="bg-white rounded-md p-2 border border-gray-100 hover:border-blue-200 transition-all"
                      >
                        <Checkbox
                          checked={
                            permissions[module]?.[permission.key] || false
                          }
                          onChange={(e) =>
                            handlePermissionChange(
                              module,
                              permission.key,
                              e.target.checked
                            )
                          }
                          className="w-full"
                        >
                          <span className="text-sm text-gray-700 font-medium">
                            {permission.label}
                          </span>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button
              size="large"
              onClick={handleCancel}
              className="px-6 rounded-lg"
              block
            >
              Cancel
            </Button>
            <Button
              block
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              className="my-main-button px-6 rounded-lg"
            >
              Create Role
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AddRole;
