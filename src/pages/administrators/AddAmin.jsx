import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag,
  Collapse,
  Badge,
  Tooltip,
} from "antd";
import {
  FaPlus,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUserShield,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus as FaPlusIcon,
  FaCheck,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { API } from "../../api/api";
import AddRole from "./roles/AddRole";

const { Option } = Select;
const { Panel } = Collapse;

const AddAdmin = ({ refetch, roles, isLoadingRoles, refetchRoles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
    setSelectedRole(null);
    setShowPermissions(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedRole(null);
    setShowPermissions(false);
  };

  const handleRoleChange = (roleId) => {
    const role = roles?.find((r) => r._id === roleId);
    setSelectedRole(role);
    setShowPermissions(false);
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      await API.post("/admin/create/", values);
      message.success("Admin created successfully!");
      refetch?.();
      handleCancel();
    } catch (err) {
      console.error(err, "err");
      message.error(err.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  // Format module name for display
  const formatModuleName = (module) => {
    return module
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get permission icon
  const getPermissionIcon = (permissionKey) => {
    const icons = {
      view: <FaEye className="text-blue-500" />,
      create: <FaPlusIcon className="text-green-500" />,
      edit: <FaEdit className="text-yellow-500" />,
      delete: <FaTrash className="text-red-500" />,
      driverAssign: <FaUserShield className="text-purple-500" />,
      statusChange: <FaCheck className="text-green-500" />,
      paidStatusChange: <FaCheck className="text-emerald-500" />,
      attendanceChange: <FaCheck className="text-cyan-500" />,
      userCreditChange: <FaCheck className="text-indigo-500" />,
      veiwDetails: <FaEye className="text-blue-400" />,
    };

    return icons[permissionKey] || <FaCheck className="text-green-500" />;
  };

  // Get permission label
  const getPermissionLabel = (key) => {
    const labels = {
      view: "View",
      create: "Create",
      edit: "Edit",
      delete: "Delete",
      driverAssign: "Driver Assign",
      statusChange: "Status Change",
      paidStatusChange: "Paid Status",
      attendanceChange: "Attendance",
      userCreditChange: "User Credit",
      veiwDetails: "View Details",
    };
    return labels[key] || key;
  };

  // Count active permissions for a module
  const countActivePermissions = (permissions) => {
    return Object.entries(permissions).filter(
      ([key, value]) =>
        key !== "_id" && key !== "accessibleModule" && value === true
    ).length;
  };

  // Render permissions preview
  const renderPermissionsPreview = () => {
    if (!selectedRole) return null;

    const activeModules = selectedRole.permissions.filter((perm) => {
      return Object.entries(perm).some(
        ([key, value]) =>
          key !== "_id" && key !== "accessibleModule" && value === true
      );
    });

    return (
      <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaUserShield className="text-green-600 text-lg" />
            <h4 className="text-base font-semibold text-gray-800 m-0">
              {selectedRole.name} - Permissions Overview
            </h4>
          </div>
          <Badge
            count={activeModules.length}
            style={{ backgroundColor: "#52c41a" }}
            showZero
          >
            <span className="text-sm text-gray-600 mr-2">Active Modules</span>
          </Badge>
        </div>

        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => (
            <FaChevronDown
              className={`text-gray-500 transition-transform ${
                isActive ? "rotate-180" : ""
              }`}
            />
          )}
          className="bg-gray-50 permissions-collapse"
        >
          {activeModules.map((permission, index) => {
            const activePerms = countActivePermissions(permission);

            // Filter only enabled permissions (value === true)
            const enabledPermissions = Object.entries(permission).filter(
              ([key, value]) =>
                key !== "_id" && key !== "accessibleModule" && value === true
            );

            // Skip module if no enabled permissions
            if (enabledPermissions.length === 0) return null;

            return (
              <Panel
                key={permission._id || index}
                header={
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      {index + 1}.{" "}
                      {formatModuleName(permission.accessibleModule)}
                    </span>
                    <Tag color="blue" className="mr-2">
                      {activePerms} permissions
                    </Tag>
                  </div>
                }
                className="mb-2 bg-white border border-gray-200 rounded-lg"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
                  {enabledPermissions.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center gap-1 p-2 rounded-md bg-green-50 border border-green-200 hover:bg-green-100 transition-all"
                    >
                      {getPermissionIcon(key)}
                      <span className="text-sm text-gray-700 font-medium">
                        {getPermissionLabel(key)}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            );
          })}
        </Collapse>

        {activeModules.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FaUserShield className="text-4xl mx-auto mb-2 opacity-30" />
            <p>No permissions assigned to this role</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Button
        type="primary"
        size="large"
        className="mb-2 my-main-button shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={showModal}
        icon={<FaPlus className="mr-1" />}
      >
        New Administrator
      </Button>

      <Modal
        title={
          <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FaUserShield className="text-blue-600 text-lg" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 m-0">
                Create New Administrator
              </h3>
              <p className="text-sm text-gray-500 m-0">
                Add a new admin user to your system
              </p>
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={900}
        className="top-8"
        destroyOnClose
      >
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            requiredMark={false}
          >
            {/* Personal Information Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
              <h4 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaUser className="text-blue-600" />
                Personal Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label={
                    <span className="font-medium text-gray-700">Full Name</span>
                  }
                  name="name"
                  rules={[
                    { required: true, message: "Please enter admin name" },
                    { min: 3, message: "Name must be at least 3 characters" },
                  ]}
                >
                  <Input
                    prefix={<FaUser className="text-gray-400" />}
                    placeholder="Enter full name"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-medium text-gray-700">
                      Phone Number
                    </span>
                  }
                  name="phone"
                  rules={[
                    { required: true, message: "Please enter phone number" },
                  ]}
                >
                  <Input
                    prefix={<FaPhone className="text-gray-400" />}
                    placeholder="+880 1XXX-XXXXXX"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>
            </div>

            {/* Account Credentials Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
              <h4 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaLock className="text-purple-600" />
                Account Credentials
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label={
                    <span className="font-medium text-gray-700">
                      Email Address
                    </span>
                  }
                  name="email"
                  rules={[
                    { required: true, message: "Please enter admin email" },
                    {
                      type: "email",
                      message: "Please enter a valid email address",
                    },
                  ]}
                >
                  <Input
                    prefix={<FaEnvelope className="text-gray-400" />}
                    placeholder="admin@example.com"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-medium text-gray-700">Password</span>
                  }
                  name="password"
                  rules={[
                    { required: true, message: "Please enter admin password" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<FaLock className="text-gray-400" />}
                    placeholder="Enter secure password"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>
            </div>

            {/* Role & Permissions Section */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 mb-4">
              <h4 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaUserShield className="text-green-600" />
                Role & Permissions
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Form.Item
                  className="md:col-span-3"
                  label={
                    <span className="font-medium text-gray-700">
                      Assign Role
                    </span>
                  }
                  name="role"
                  rules={[{ required: true, message: "Please select a role" }]}
                >
                  <Select
                    placeholder="Select admin role"
                    size="large"
                    className="rounded-lg"
                    loading={isLoadingRoles}
                    suffixIcon={<FaUserShield className="text-gray-400" />}
                    showSearch
                    optionFilterProp="children"
                    onChange={handleRoleChange}
                    filterOption={(input, option) =>
                      option.children.props.children[0].props.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {roles?.map((role) => (
                      <Option key={role?._id} value={role?._id}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{role?.name}</span>
                          <Tag color="blue" className="ml-2">
                            {role?.permissions?.length} modules
                          </Tag>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  className="md:col-span-2"
                  label={
                    <span className="font-medium text-gray-700">
                      Create New Role
                    </span>
                  }
                >
                  <AddRole refetch={refetchRoles} color={"green-500"} />
                </Form.Item>
              </div>

              {/* View Permissions Button */}
              {selectedRole && (
                <div className="">
                  <Button
                    type="dashed"
                    block
                    onClick={() => setShowPermissions(!showPermissions)}
                    icon={<FaEye />}
                    className="font-medium"
                  >
                    {showPermissions
                      ? "Hide Permissions"
                      : `View ${selectedRole.name} Permissions`}
                  </Button>
                </div>
              )}

              {/* Permissions Preview */}
              {showPermissions && renderPermissionsPreview()}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button
                size="large"
                block
                onClick={handleCancel}
                className="px-8 rounded-lg font-medium hover:border-gray-400"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                loading={loading}
                className="my-main-button px-8 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                icon={!loading && <FaPlus />}
              >
                Create Administrator
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddAdmin;
