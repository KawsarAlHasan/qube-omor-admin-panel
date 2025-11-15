import React, { useState } from "react";
import { Button } from "antd";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";
import BookingModal from "./BookingModal";

function BookingList({ spaData, isLoading, isError, error, refetch }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const showModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
  };

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  return (
    <div className="mt-4 bg-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold">Classes</h1>

      {spaData?.length === 0 && (
        <p className="text-lg text-gray-600 mt-4">No classes found</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {spaData?.slice(0, 6)?.map((singleData) => (
          <div
            key={singleData?._id}
            className="bg-[#e6f0f5] p-6 rounded-lg shadow-md flex flex-col"
          >
            <h2 className="text-xl font-semibold">
              {singleData?.service_name}
            </h2>
            <p className="text-sm">
              Instructor: {singleData?.instructor?.name}
            </p>
            <p className="text-sm">
              Attendees: {singleData?.class_capacity} People
            </p>
            <p className="text-sm">Schedule: {singleData?.date}</p>
            <Button
              type="primary"
              className="mt-4 my-main-button py-3"
              onClick={() => showModal(singleData)}
            >
              View Details
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Button className="mr-2">&lt; Prev</Button>
        <Button className="mr-2">1</Button>
        <Button className="ml-2">Next &gt;</Button>
      </div>

      {/* BookingModal component */}
      <BookingModal
        singleData={selectedBooking}
        isVisible={isModalVisible}
        onClose={handleCancel}
      />
    </div>
  );
}

export default BookingList;
