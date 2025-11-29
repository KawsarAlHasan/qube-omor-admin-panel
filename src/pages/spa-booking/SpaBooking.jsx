import { Select } from "antd";
import React, { useEffect, useState } from "react";
import DatePicker from "./DatePicker";
import BookingList from "./BookingList";
import { useAllSpas } from "../../api/spaApi";
import { useLocation } from "react-router-dom";

function SpaBooking() {
  const [pickedDate, setPickedDate] = useState(null);
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);
  const beforeHyphen = pathnames[0]?.split("-")[0];
  const capitalized = beforeHyphen
    ? beforeHyphen.charAt(0).toUpperCase() + beforeHyphen.slice(1)
    : "";

  // Initialize filter with proper date format
  const [filter, setFilter] = useState({
    page: 1,
    limit: 100,
    type: capitalized,
    date: null,
  });

  // Update filter when capitalized or pickedDate changes
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      type: capitalized,
      page: 1, // Reset to first page when type changes
      date: pickedDate ? formatDateForAPI(pickedDate) : null,
    }));
  }, [capitalized, pickedDate]);

  // Format date for API (you might need to adjust this based on your API requirements)
  const formatDateForAPI = (date) => {
    if (!date) return null;

    // If date is a Date object
    if (date instanceof Date) {
      return date.toISOString().split("T")[0]; // YYYY-MM-DD format
    }

    // If date is already a string, return as is
    return date;
  };

  const handleDateGet = (date) => {
    console.log("Date received:", date);
    setPickedDate(date);
  };

  // Use the filter values directly in the hook
  const { spaData, isLoading, isError, error, refetch } = useAllSpas({
    page: filter.page,
    limit: filter.limit,
    type: filter.type,
    date: filter.date,
  });

  const onClassChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <div>
      {/* <div className="flex gap-2">
        <Select
          size="large"
          placeholder="Class"
          optionFilterProp="label"
          onChange={onClassChange}
          options={[
            {
              value: "jack",
              label: "Jack",
            },
            {
              value: "lucy",
              label: "Lucy",
            },
            {
              value: "tom",
              label: "Tom",
            },
          ]}
        />
        <Select
          size="large"
          placeholder="Spa/Plunges"
          optionFilterProp="label"
          onChange={onClassChange}
          options={[
            {
              value: "jack",
              label: "Jack",
            },
            {
              value: "lucy",
              label: "Lucy",
            },
            {
              value: "tom",
              label: "Tom",
            },
          ]}
        />
        <Select
          size="large"
          placeholder="Physio"
          optionFilterProp="label"
          onChange={onClassChange}
          options={[
            {
              value: "jack",
              label: "Jack",
            },
            {
              value: "lucy",
              label: "Lucy",
            },
            {
              value: "tom",
              label: "Tom",
            },
          ]}
        />
        <Select
          size="large"
          placeholder="Instructor"
          optionFilterProp="label"
          onChange={onClassChange}
          options={[
            {
              value: "jack",
              label: "Jack",
            },
            {
              value: "lucy",
              label: "Lucy",
            },
            {
              value: "tom",
              label: "Tom",
            },
          ]}
        />
        <Select
          size="large"
          placeholder="Time"
          optionFilterProp="label"
          onChange={onClassChange}
          options={[
            {
              value: "jack",
              label: "Jack",
            },
            {
              value: "lucy",
              label: "Lucy",
            },
            {
              value: "tom",
              label: "Tom",
            },
          ]}
        />
      </div> */}

      <DatePicker onDateChange={handleDateGet} />

      <BookingList
        date={filter?.date}
        spaData={spaData?.data}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
      />
    </div>
  );
}

export default SpaBooking;
