import React, { useState } from "react";
import { useUsersList } from "../../../api/userApi";
import IsLoading from "../../../components/IsLoading";
import IsError from "../../../components/IsError";
import { Input, Table, Tag, Avatar, Button, Space, Tooltip } from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  DeleteFilled,
  EyeOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import AddDriver from "./AddDriver";

const { Search } = Input;

function Drivers() {
  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState({
    role: "Driver",
    status: "Active",
    page: 1,
    limit: 2000,
    name: searchText,
  });

  const { usersList, isLoading, isError, error, refetch } =
    useUsersList(filters);

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  const columns = [
    {
      title: <span>Sl no.</span>,
      dataIndex: "index",
      key: "index",
      render: (_, record, index) => (
        <span>#{index + 1 + (filters.page - 1) * filters.limit}</span>
      ),
    },
    {
      title: <span>Driver</span>,
      dataIndex: "driver",
      key: "driver",
      render: (_, record) => (
        <div className="flex flex-items-center gap-2">
          <Avatar
            size={40}
            src={record.profile_image}
            icon={!record.profile_image && <UserOutlined />}
          />
          <h1 className="mt-2">{record.name}</h1>
        </div>
      ),
    },
    {
      title: <span>Email</span>,
      dataIndex: "email",
      key: "email",
      render: (email) => <span>{email}</span>,
    },
    {
      title: <span>Phone</span>,
      dataIndex: "phone",
      key: "phone",
      render: (phone) => <span>{phone}</span>,
    },

    {
      title: <span>Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div className="flex items-center ">
          {status === "Active" ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">{status}</Tag>
          )}
          <Button
            className="-ml-1"
            title="Status Change"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openStatusModal(record)}
          />
        </div>
      ),
    },

    {
      title: <span>Delete</span>,
      key: "delete",
      render: (_, record) => (
        <Space size="middle">
          <DeleteFilled
            className="text-[23px] text-red-400 hover:text-red-300 cursor-pointer"
            onClick={() => handleUserDetails(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <Search
          placeholder="Search by driver name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={(value) => {
            setFilters((prevFilters) => ({
              ...prevFilters,
              name: value || null,
              page: 1,
            }));
          }}
          style={{ width: 350 }}
          size="large"
          allowClear
        />
        <AddDriver refetch={refetch} />
      </div>

      <Table
        columns={columns}
        dataSource={usersList?.data?.users || []}
        rowKey="_id"
        pagination={false}
        // pagination={{
        //   current: usersList?.data?.pagination?.page || 1,
        //   pageSize: usersList?.data?.pagination?.limit || 10,
        //   total: usersList?.data?.pagination?.total || 0,
        //   showSizeChanger: true,
        //   showTotal: (total, range) =>
        //     `${range[0]}-${range[1]} of ${total} drivers`,
        //   onChange: (page, pageSize) => {
        //     setFilters((prev) => ({
        //       ...prev,
        //       page,
        //       limit: pageSize,
        //     }));
        //   },
        // }}
        className="border border-gray-200"
      />
    </div>
  );
}

export default Drivers;
