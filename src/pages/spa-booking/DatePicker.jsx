import React, { useState, useEffect, useRef } from "react";
import "./DatePicker.css";

const DateScrollSelector = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const generateDates = () => {
      const today = new Date();
      const dateArray = [];

      for (let i = -30; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dateArray.push(date);
      }

      setDates(dateArray);

      setSelectedDate(today.toDateString());
    };

    generateDates();
  }, []);

  const handleDateSelect = (date) => {
    const dateString = date.toDateString();
    setSelectedDate(dateString);
  };

  useEffect(() => {
    if (scrollContainerRef.current && selectedDate) {
      const selectedElement = scrollContainerRef.current.querySelector(
        ".date-item.selected"
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }

    if (onDateChange) {
      onDateChange(selectedDate);
    }
  }, [selectedDate]);

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const weekday = date.toLocaleString("en-US", { weekday: "short" });

    return { day, month, weekday };
  };

  return (
    <div className="">
      <div className="scroll-container" ref={scrollContainerRef}>
        {dates.map((date, index) => {
          const { day, month, weekday } = formatDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected = date.toDateString() === selectedDate;

          return (
            <div
              key={index}
              className={`date-item ${isSelected ? "selected" : ""} ${
                isToday ? "today" : ""
              }`}
              onClick={() => handleDateSelect(date)}
            >
              <div className="date-number">{day}</div>
              <div className="date-month">{month}</div>
              <div className="date-weekday">{isToday ? "Today" : weekday}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DateScrollSelector;
