import React, { useState } from "react";
import { Modal, Typography, Button, Space, notification } from "antd";
import { API } from "../../api/api";

const { Title, Text } = Typography;

function ViewUser({ userDetailsData, isOpen, onClose, refetch }) {
  const [enableLoading, setEnableLoading] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleUserEnable = async (userData) => {
    setEnableLoading(true);
    try {
      // await API.post(`/admin/users/${userData.id}/action/`, {
      //   action: "enable",
      // });
      openNotification("success", "Success", "User enabled successfully");
      refetch();
      onClose();
    } catch (error) {
      openNotification("error", "Error", "Failed to enable user");
    } finally {
      setEnableLoading(false);
    }
  };

  const handleUserDisable = async (userData) => {
    setDisableLoading(true);
    try {
      // await API.post(`/admin/users/${userData.id}/action/`, {
      //   action: "disable",
      // });
      openNotification("success", "Success", "User disabled successfully");
      refetch();
      onClose();
    } catch (error) {
      openNotification("error", "Error", "Failed to disable user");
    } finally {
      setDisableLoading(false);
    }
  };

  const handleUserDelete = async (userData) => {
    setDeleteLoading(true);
    try {
      // await API.post(`/admin/users/${userData.id}/action/`, {
      //   action: "delete",
      // });
      openNotification("success", "Success", "User deleted successfully");
      refetch();
      onClose();
    } catch (error) {
      openNotification("error", "Error", "Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Modal
      title="User Action"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      {userDetailsData ? (
        <>
          <p>
            <Text strong>Name: </Text>
            {userDetailsData.full_name}
          </p>
          <p>
            <Text strong>Email: </Text>
            {userDetailsData.email}
          </p>
          <p>
            <Text strong>Phone Number: </Text>
            {userDetailsData.phone}
          </p>
          <p>
            <Text strong>Total Credit: </Text>
            {userDetailsData.total_scan}
          </p>
          <Button
            danger
            type="primary"
            block
            loading={deleteLoading}
            onClick={() => handleUserDelete(userDetailsData)}
          >
            Delete User
          </Button>

          <Space style={{ marginTop: 20 }}>
            {/* <Button
              danger
              loading={disableLoading}
              onClick={() => handleUserDisable(userDetailsData)}
            >
              Disable User
            </Button>

            <Button
              type="primary"
              loading={enableLoading}
              onClick={() => handleUserEnable(userDetailsData)}
            >
              Enable User
            </Button> */}
          </Space>
        </>
      ) : (
        <Text>No user data available</Text>
      )}
    </Modal>
  );
}

export default ViewUser;
