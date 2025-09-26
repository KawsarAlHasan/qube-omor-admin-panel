import { Select } from "antd";
import React from "react";
import DatePicker from "./DatePicker";
import BookingList from "./BookingList";

function SpaBooking() {
  const onClassChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <div>
      <div className="flex gap-2">
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
      </div>

      <DatePicker />


      <BookingList />
    </div>
  );
}

export default SpaBooking;
