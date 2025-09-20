import { useState } from "react";
import { Table, Modal, notification } from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { ExclamationCircleOutlined } from "@ant-design/icons";
// import { API, useStripePayments } from "../../api/api";
import { usePayments } from "../../services/paymentService";

const { confirm } = Modal;

function Payments() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const { paymentsData, pagination, isLoading, isError, error, refetch } =
    usePayments(filter);

  const handleTableChange = (pagination, filters, sorter) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const columns = [
    {
      title: <span>SL No.</span>,
      dataIndex: "serial_number",
      key: "serial_number",
      render: (serial_number) => <span className="">#{serial_number}</span>,
    },
    {
      title: <span>User</span>,
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: <span>Email</span>,
      dataIndex: "email",
      key: "email",
      render: (email) => <span className="">{email}</span>,
    },

    {
      title: <span>Payments</span>,
      dataIndex: "pay_amout",
      key: "pay_amout",
      render: (pay_amout) => <span className="">${pay_amout}</span>,
    },
    {
      title: <span>date</span>,
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <span className="">{new Date(date).toLocaleString()}</span>
      ),
    },
  ];

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  // pagination
  // :
  // limit
  // :
  // 10
  // page
  // :
  // 1
  // totalPages
  // :
  // 5
  // totalPayments
  // :
  // 50

  console.log(paymentsData, "paymentsData");

  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={paymentsData}
        rowKey="id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: pagination.totalPayments,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
        loading={isLoading}
      />
    </div>
  );
}

export default Payments;
