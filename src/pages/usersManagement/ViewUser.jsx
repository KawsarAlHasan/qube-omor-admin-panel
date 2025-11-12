import React, { useState } from "react";
import { Modal, Typography, Button, notification } from "antd";
import { API } from "../../api/api";

const { Text } = Typography;

function ViewUser({ userDetailsData, isOpen, onClose, refetch }) {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleUserDelete = async (userData) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/user/delete/${userData._id}`);

      openNotification("success", "Success", "User deleted successfully");
      refetch();
      onClose();
    } catch (error) {
      openNotification(
        "error",
        "Error",
        error.response?.data?.message || "Failed to delete user"
      );
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
            {userDetailsData?.name}
          </p>
          <p>
            <Text strong>Email: </Text>
            {userDetailsData?.email}
          </p>
          <p>
            <Text strong>Phone Number: </Text>
            {userDetailsData?.phone}
          </p>
          <p>
            <Text strong>Total Credit: </Text>
            {userDetailsData?.credit}
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
        </>
      ) : (
        <Text>No user data available</Text>
      )}
    </Modal>
  );
}

export default ViewUser;
