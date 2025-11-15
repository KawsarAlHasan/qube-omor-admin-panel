import {
  Modal,
  Spin,
  Avatar,
  Button,
  Tag,
  Divider,
  Row,
  Col,
  Card,
  message,
} from "antd";
import {
  UserOutlined,
  CloseOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  TeamOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useSingleSpaData } from "../../api/spaApi";
import IsError from "../../components/IsError";
import { API } from "../../api/api";

function BookingModal({ singleData, isVisible, onClose }) {
  const { singleSpaData, isLoading, isError, error, refetch } =
    useSingleSpaData(
      { id: singleData?._id },
      {
        enabled: isVisible && !!singleData?._id,
      }
    );

  const data = singleSpaData?.data;

  const handleChangeAttendess = async (bookingId, type) => {
    console.log("Remove booking:", bookingId, "from", type);

    try {
      const res = await API.put("/spa-booking/change-attendees", {
        _id: bookingId,
        attendees_type: type,
      });

      if (res.status === 200) {
        message.success(`Removed from ${type} successfully!`);
        refetch();
      }
    } catch (error) {
      console.error("Error adding to class:", error);
      message.error(
        error?.response?.data?.message || `Failed to remove from ${type}`
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={900}
      closeIcon={<CloseOutlined className="text-xl" />}
      styles={{
        body: { padding: "24px 32px", maxHeight: "80vh", overflowY: "auto" },
      }}
    >
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      )}

      {isError && <IsError error={error} refetch={refetch} />}

      {data && !isLoading && !isError && (
        <div>
          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            {data.spaDetails?.service_name}
          </h2>

          {/* Instructor Info */}
          <div className="text-center mb-4">
            <p className="text-gray-600">
              <span className="font-medium">Instructor:</span>{" "}
              {data.spaDetails?.instructor?.name}
            </p>
            {data.spaDetails?.instructor?.email && (
              <p className="text-sm text-gray-500">
                <MailOutlined className="mr-1" />
                {data.spaDetails?.instructor?.email}
              </p>
            )}
          </div>

          {/* Class Details Card */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-none shadow-sm">
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8}>
                <div className="text-center">
                  <CalendarOutlined className="text-2xl text-blue-500 mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(data.spaDetails?.date)}
                  </p>
                </div>
              </Col>
              <Col xs={12} sm={8}>
                <div className="text-center">
                  <ClockCircleOutlined className="text-2xl text-green-500 mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Time</p>
                  <p className="font-semibold text-gray-800">
                    {data.spaDetails?.time || "N/A"}
                  </p>
                </div>
              </Col>
              <Col xs={12} sm={8}>
                <div className="text-center">
                  <CreditCardOutlined className="text-2xl text-orange-500 mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Credit</p>
                  <p className="font-semibold text-gray-800">
                    {data.spaDetails?.credit || 0} Credits
                  </p>
                </div>
              </Col>
              <Col xs={12} sm={8}>
                <div className="text-center">
                  <EnvironmentOutlined className="text-2xl text-red-500 mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Room Type</p>
                  <p className="font-semibold text-gray-800">
                    {data.spaDetails?.room_type || "N/A"}
                  </p>
                </div>
              </Col>
              <Col xs={12} sm={8}>
                <div className="text-center">
                  <TeamOutlined className="text-2xl text-purple-500 mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <p className="font-semibold text-gray-800">
                    {data.spaDetails?.type || "N/A"}
                  </p>
                </div>
              </Col>
              <Col xs={12} sm={8}>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <Tag
                    color={
                      data.spaDetails?.status === "active" ? "green" : "red"
                    }
                  >
                    {data.spaDetails?.status?.toUpperCase() || "N/A"}
                  </Tag>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Capacity Summary */}
          <Card className="mb-6 border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3">
              Capacity Summary
            </h4>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Class Capacity</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">
                      {data.spaDetails?.capacity?.bookedClass || 0} /{" "}
                      {data.spaDetails?.capacity?.totalClassCapacity || 0}
                    </span>
                    <Tag
                      color={
                        data.bookings?.summary?.classAvailability ===
                        "Available"
                          ? "green"
                          : "red"
                      }
                    >
                      {data.bookings?.summary?.classAvailability}
                    </Tag>
                  </div>
                  <div className="mt-2">
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{
                          width: `${
                            ((data.spaDetails?.capacity?.bookedClass || 0) /
                              (data.spaDetails?.capacity?.totalClassCapacity ||
                                1)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">
                    Waiting List Capacity
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-orange-600">
                      {data.spaDetails?.capacity?.bookedWaiting || 0} /{" "}
                      {data.spaDetails?.capacity?.totalWaitingCapacity || 0}
                    </span>
                    <Tag
                      color={
                        data.bookings?.summary?.waitingAvailability ===
                        "Available"
                          ? "green"
                          : "red"
                      }
                    >
                      {data.bookings?.summary?.waitingAvailability}
                    </Tag>
                  </div>
                  <div className="mt-2">
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-500 h-full transition-all duration-300"
                        style={{
                          width: `${
                            ((data.spaDetails?.capacity?.bookedWaiting || 0) /
                              (data.spaDetails?.capacity
                                ?.totalWaitingCapacity || 1)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          <Divider />

          {/* Attendees in Class Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Attendees in class
              </h3>
              <Tag color="blue">
                {data.bookings?.inClass?.length || 0} Attendees
              </Tag>
            </div>
            <div className="space-y-3">
              {data.bookings?.inClass?.length > 0 ? (
                data.bookings.inClass.map((booking, index) => (
                  <div
                    key={booking?._id}
                    className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-400 w-6">
                        {index + 1}.
                      </span>
                      <Avatar
                        size={44}
                        icon={<UserOutlined />}
                        src={booking?.user?.profile_image}
                        className="bg-purple-100"
                      />
                      <div>
                        <p className="text-base font-medium text-gray-800">
                          {booking?.user?.name}
                        </p>
                        <div className="flex gap-3 text-xs text-gray-500">
                          {booking?.user?.email && (
                            <span>
                              <MailOutlined /> {booking?.user.email}
                            </span>
                          )}
                          {booking?.user?.phone && (
                            <span>
                              <PhoneOutlined /> {booking?.user.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="default"
                        onClick={() =>
                          handleChangeAttendess(booking?._id, "classEnd")
                        }
                        className="bg-red-500 border-0 text-white hover:bg-red-600"
                      >
                        End Class
                      </Button>

                      <Button
                        type="default"
                        onClick={() =>
                          handleChangeAttendess(booking?._id, "waiting")
                        }
                        className="bg-yellow-500 border-0 text-black hover:bg-yellow-600"
                      >
                        Back to Waiting
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <TeamOutlined className="text-4xl mb-2" />
                  <p>No attendees in class yet</p>
                </div>
              )}
            </div>
          </div>

          <Divider />

          {/* Waiting List Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Waiting List</h3>
              <Tag color="orange">
                {data.bookings?.waiting?.length || 0} Waiting
              </Tag>
            </div>
            <div className="space-y-3">
              {data.bookings?.waiting?.length > 0 ? (
                data.bookings.waiting.map((booking) => (
                  <div
                    key={booking?._id}
                    className="flex items-center justify-between py-3 px-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Tag color="orange" className="font-semibold">
                        #{booking?.position}
                      </Tag>
                      <Avatar
                        size={44}
                        icon={<UserOutlined />}
                        src={booking?.user?.profile_image}
                        className="bg-purple-100"
                      />
                      <div>
                        <p className="text-base font-medium text-gray-800">
                          {booking?.user?.name}
                        </p>
                        <div className="flex gap-3 text-xs text-gray-500">
                          {booking?.user?.email && (
                            <span>
                              <MailOutlined /> {booking?.user.email}
                            </span>
                          )}
                          {booking?.user?.phone && (
                            <span>
                              <PhoneOutlined /> {booking?.user.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="default"
                        onClick={() =>
                          handleChangeAttendess(booking?._id, "inClass")
                        }
                        className="bg-green-500 border-0 text-white hover:bg-green-600"
                      >
                        Add to Class
                      </Button>

                      <Button
                        type="default"
                        onClick={() =>
                          handleChangeAttendess(booking?._id, "classEnd")
                        }
                        className="bg-red-500 border-0 text-white hover:bg-red-600"
                      >
                        End Class
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <TeamOutlined className="text-4xl mb-2" />
                  <p>No one in waiting list</p>
                </div>
              )}
            </div>
          </div>

          <Divider />

          {/* Class End Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Class End Attendees
              </h3>
              <Tag color="red">
                {data.bookings?.classEnd?.length || 0} Ended
              </Tag>
            </div>

            <div className="space-y-3">
              {data.bookings?.classEnd?.length > 0 ? (
                data.bookings.classEnd.map((booking, index) => (
                  <div
                    key={booking?._id}
                    className="flex items-center justify-between py-3 px-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-400 w-6">
                        {index + 1}.
                      </span>
                      <Avatar
                        size={44}
                        icon={<UserOutlined />}
                        src={booking?.user?.profile_image}
                        className="bg-red-100"
                      />
                      <div>
                        <p className="text-base font-medium text-gray-800">
                          {booking?.user?.name}
                        </p>
                        <div className="flex gap-3 text-xs text-gray-500">
                          {booking?.user?.email && (
                            <span>
                              <MailOutlined /> {booking?.user.email}
                            </span>
                          )}
                          {booking?.user?.phone && (
                            <span>
                              <PhoneOutlined /> {booking?.user.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <Button
                        type="default"
                        onClick={() =>
                          handleChangeAttendess(booking?._id, "inClass")
                        }
                        className="bg-green-500 border-0 text-white hover:bg-green-600"
                      >
                        Add to Class
                      </Button>

                      <Button
                        type="default"
                        onClick={() =>
                          handleChangeAttendess(booking?._id, "waiting")
                        }
                        className="bg-yellow-500 border-0 text-black hover:bg-yellow-600"
                      >
                        Back to Waiting
                      </Button>
                    </div> */}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <TeamOutlined className="text-4xl mb-2" />
                  <p>No attendees finished class</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default BookingModal;
