import { useAllCoupon } from "../../../api/settingsApi";
import IsLoading from "../../../components/IsLoading";
import IsError from "../../../components/IsError";
import { Button, message, Modal, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import { API } from "../../../api/api";
import EditCoupon from "./EditCoupon";
import dayjs from "dayjs";
import AddCoupon from "./AddCoupon";

function CouponCode() {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { couponData, isLoading, isError, error, refetch } = useAllCoupon();

  const openStatusModal = (record) => {
    setSelectedCoupon(record);
    setIsStatusModalOpen(true);
  };

  const handleStatusChange = async () => {
    try {
      const newStatus =
        selectedCoupon.status === "Active" ? "Deactive" : "Active";

      await API.put(`/coupon/status-change/${selectedCoupon._id}`, {
        status: newStatus,
      });

      message.success(`Status changed to ${newStatus} successfully`);
      setIsStatusModalOpen(false);
      refetch();
    } catch (err) {
      message.error(err?.response?.data?.message || "Failed to change status");
    }
  };

  const openDeleteModal = (record) => {
    setSelectedCoupon(record);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCoupon) return;

    try {
      await API.delete(`/coupon/delete/${selectedCoupon._id}`);

      message.success("Coupon deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedCoupon(null);
      refetch();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to delete Coupon");
    }
  };

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  const columns = [
    {
      title: "Coupon Code",
      dataIndex: "code",
      key: "code",
      render: (code) => <strong>{code}</strong>,
    },

    {
      title: "Where will it be used?",
      key: "categories",
      width: 310,
      render: (_, record) => {
        const categories = [];

        if (record.isRestaurant) {
          categories.push(
            <Tag color="blue" key="restaurant">
              Restaurant
            </Tag>
          );
        }
        if (record.isSpa) {
          categories.push(
            <Tag color="purple" key="spa">
              Spa
            </Tag>
          );
        }
        if (record.isPhysio) {
          categories.push(
            <Tag color="green" key="physio">
              Physio
            </Tag>
          );
        }
        if (record.isClasses) {
          categories.push(
            <Tag color="orange" key="classes">
              Classes
            </Tag>
          );
        }

        return categories.length > 0 ? (
          <Space wrap>{categories}</Space>
        ) : (
          <Tag color="default">No Category</Tag>
        );
      },
    },

    {
      title: "Type",
      dataIndex: "isAmount",
      key: "isAmount",
      render: (_, record) =>
        record.isAmount ? (
          <Tag color="blue">Amount: {record.amount}</Tag>
        ) : (
          <Tag color="purple">Percent: {record.percentage}%</Tag>
        ),
    },

    {
      title: "Date Type",
      dataIndex: "dateType",
      key: "dateType",
      render: (dateType) => <Tag color="cyan">{dateType}</Tag>,
    },

    {
      title: "Date",
      key: "dates",
      render: (_, record) => {
        if (record.dateType === "Unlimited") return <i>Unlimited</i>;
        if (record.dateType === "Single")
          return dayjs(record.singleDate).format("DD MMM, YYYY");

        if (record.dateType === "Range")
          return (
            <>
              {dayjs(record.startDate).format("DD MMM, YYYY")} -{" "}
              {dayjs(record.endDate).format("DD MMM, YYYY")}
            </>
          );

        return "--";
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Space>
          {status === "Active" ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">Deactive</Tag>
          )}
          <Button
            size="small"
            title="Change Status"
            icon={<EditOutlined />}
            onClick={() => openStatusModal(record)}
          />
        </Space>
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <EditCoupon record={record} refetch={refetch} />
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => openDeleteModal(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <AddCoupon refetch={refetch} />
      </div>

      <Table
        dataSource={couponData || []}
        columns={columns}
        pagination={false}
        rowKey="_id"
        bordered
      />

      {/* Delete Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okType="danger"
      >
        <p>
          Are you sure you want to delete the coupon{" "}
          <strong>{selectedCoupon?.code}</strong>?
        </p>
      </Modal>

      {/* Status Modal */}
      <Modal
        title="Change Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalOpen(false)}
      >
        <p>
          Change status from <strong>{selectedCoupon?.status}</strong> to{" "}
          <strong>
            {selectedCoupon?.status === "Active" ? "Deactive" : "Active"}
          </strong>
          ?
        </p>
      </Modal>
    </div>
  );
}

export default CouponCode;
