import React, { useState } from "react";
import { Modal, Button } from "antd";
import { useMockSpaBooking } from "../../api/spaApi"; // your API hook
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";

function BookingList() {
  const { mockSpaBooking, isLoading, isError, error, refetch } =
    useMockSpaBooking();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const showModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  return (
    <div className="mt-4 bg-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold">Classes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {mockSpaBooking.slice(0, 6).map((booking) => (
          <div
            key={booking.id}
            className="bg-[#e6f0f5] p-6 rounded-lg shadow-md flex flex-col"
          >
            <h2 className="text-xl font-semibold">{booking.spa_name}</h2>
            <p className="text-sm">Instructor: {booking.instructor}</p>
            <p className="text-sm">Attendees: {booking.attendees} People</p>
            <p className="text-sm">Schedule: {booking.schedule}</p>
            <Button
              type="primary"
              className="mt-4 my-main-button py-3"
              onClick={() => showModal(booking)}
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

      {/* Modal to display the full details of the booking */}
      <Modal
        title={`Booking Details: ${selectedBooking?.spa_name}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p>
              <strong>Instructor:</strong> {selectedBooking.instructor}
            </p>
            <p>
              <strong>Attendees:</strong> {selectedBooking.attendees} People
            </p>
            <p>
              <strong>Schedule:</strong> {selectedBooking.schedule}
            </p>

            <h3 className="text-lg font-semibold">Attendees in Class:</h3>
            <ul>
              {selectedBooking.attendees_in_class.map((attendee) => (
                <li key={attendee.id}>
                  <div className="flex flex-items-center gap-2">
                    <img
                      className="w-[40px] h-[40px] rounded-full mt-1"
                      src={attendee.profile}
                      alt={attendee.full_name}
                    />
                    <div className="">
                      <h1 className="">{attendee.full_name}</h1>
                      <p className="text-sm text-gray-600 mt-[-5px]">
                        {attendee.email}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold">Waiting List:</h3>
            <ul>
              {selectedBooking.waiting_list.map((waiter) => (
                <li key={waiter.id}>
                  <div className="flex flex-items-center gap-2">
                    <img
                      className="w-[40px] h-[40px] rounded-full mt-1"
                      src={waiter.profile}
                      alt={waiter.full_name}
                    />
                    <div className="">
                      <h1 className="">{waiter.full_name}</h1>
                      <p className="text-sm text-gray-600 mt-[-5px]">
                        {waiter.email}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default BookingList;
