import { useState, useMemo } from "react";
import {
  Modal,
  Select,
  Card,
  Button,
  Avatar,
  Tag,
  message,
  Spin,
  Empty,
  Divider,
} from "antd";
import {
  UserOutlined,
  GiftOutlined,
  CreditCardOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useUsersList } from "../../api/userApi";
import { useCredits } from "../../api/spaApi";
import { API } from "../../api/api";

function AdminGiveCreditByCash() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { usersList, isLoading, refetch } = useUsersList({
    role: "User",
    page: 1,
    limit: 1000000,
    status: "Active",
  });

  const {
    credits,
    isLoading: creditIsLoading,
    refetch: creditRefetch,
  } = useCredits();

  // User options for Select
  const userOptions = useMemo(() => {
    if (!usersList?.data?.users) return [];
    return usersList.data.users.map((user) => ({
      value: user._id,
      label: user.name,
      user: user,
    }));
  }, [usersList]);

  // Find selected user data
  const selectedUserData = useMemo(() => {
    if (!selectedUser || !usersList?.data?.users) return null;
    return usersList.data.users.find((u) => u._id === selectedUser);
  }, [selectedUser, usersList]);

  // Find selected credit data
  const selectedCreditData = useMemo(() => {
    if (!selectedCredit || !credits?.data) return null;
    return credits.data.find((c) => c._id === selectedCredit);
  }, [selectedCredit, credits]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setSelectedCredit(null);
  };

  const handleSubmit = async () => {
    if (!selectedUser || !selectedCredit) {
      message.warning("Please select both user and credit package");
      return;
    }

    setIsSubmitting(true);
    try {
      await API.put(`/credit/admin-give-credit`, {
        userId: selectedUser,
        creditId: selectedCredit,
      });
      message.success("Credit given successfully!");
      handleCancel();
      refetch();
      creditRefetch();
    } catch (err) {
      message.error(err?.response?.data?.message || "Failed to give credit");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom filter for user search
  const filterOption = (input, option) => {
    const user = option.user;
    const searchText = input.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.phone?.toLowerCase().includes(searchText)
    );
  };

  return (
    <div>
      <Button
        type="primary"
        size="large"
        icon={<GiftOutlined />}
        onClick={showModal}
        className="my-main-button"
      >
        Give Credit by Cash
      </Button>

      <Modal
        title={
          <div className="flex items-center gap-3 pb-2">
            <div className="w-10 h-10 my-main-button rounded-full flex items-center justify-center">
              <GiftOutlined className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 m-0">
                Give Credit by Cash
              </h3>
              <p className="text-xs text-gray-500 m-0">
                Manually assign credits to users
              </p>
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
        className="credit-modal"
      >
        <Spin spinning={isLoading || creditIsLoading}>
          <div className="py-4 space-y-6">
            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserOutlined className="mr-2" />
                Select User
              </label>
              <Select
                showSearch
                placeholder="Search by name, email, or phone..."
                optionFilterProp="children"
                filterOption={filterOption}
                onChange={(value) => setSelectedUser(value)}
                value={selectedUser}
                className="w-full"
                size="large"
                suffixIcon={<SearchOutlined />}
                notFoundContent={
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No users found"
                  />
                }
                optionRender={(option) => (
                  <div className="flex items-center gap-3 py-1">
                    <Avatar
                      src={option.data.user.profile_image}
                      icon={<UserOutlined />}
                      className="bg-indigo-100 text-indigo-600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate">
                        {option.data.user.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {option.data.user.email} • {option.data.user.phone}
                      </div>
                    </div>
                    <Tag color="blue" className="ml-auto">
                      {option.data.user.credit} credits
                    </Tag>
                  </div>
                )}
                options={userOptions}
              />
            </div>

            {/* Selected User Card */}
            {selectedUserData && (
              <Card
                className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200"
                size="small"
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    size={56}
                    src={selectedUserData.profile_image}
                    icon={<UserOutlined />}
                    className="bg-indigo-500"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 m-0">
                      {selectedUserData.name}
                    </h4>
                    <p className="text-sm text-gray-500 m-0">
                      {selectedUserData.email}
                    </p>
                    <p className="text-xs text-gray-400 m-0">
                      {selectedUserData.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Current Balance</div>
                    <div className="text-xl font-bold text-indigo-600">
                      {selectedUserData.credit}
                      <span className="text-sm font-normal ml-1">credits</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <Divider className="my-4" />

            {/* Credit Package Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <CreditCardOutlined className="mr-2" />
                Select Credit Package
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {credits?.data?.map((credit) => (
                  <div
                    key={credit._id}
                    onClick={() => setSelectedCredit(credit._id)}
                    className={`
                      relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-200
                      ${
                        selectedCredit === credit._id
                          ? "border-indigo-500 bg-indigo-50 shadow-md scale-105"
                          : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                      }
                    `}
                  >
                    {selectedCredit === credit._id && (
                      <CheckCircleOutlined className="absolute top-2 right-2 text-indigo-500 text-lg" />
                    )}
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${
                          selectedCredit === credit._id
                            ? "text-indigo-600"
                            : "text-gray-800"
                        }`}
                      >
                        {credit.credit}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">credits</div>
                      <div className="flex items-center justify-center gap-1 text-green-600 font-semibold">
                        <DollarOutlined />
                        {credit.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            {selectedUserData && selectedCreditData && (
              <Card className="bg-green-50 border-green-200" size="small">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">After adding:</div>
                    <div className="text-lg font-bold text-green-600">
                      {selectedUserData.credit + selectedCreditData.credit}{" "}
                      credits
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Cash received:</div>
                    <div className="text-lg font-bold text-green-600">
                      ${selectedCreditData.price}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                size="large"
                onClick={handleCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={!selectedUser || !selectedCredit}
                className="flex-1 my-main-button"
                icon={<GiftOutlined />}
              >
                Give Credit
              </Button>
            </div>
          </div>
        </Spin>
      </Modal>
    </div>
  );
}

export default AdminGiveCreditByCash;
