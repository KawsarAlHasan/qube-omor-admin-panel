import React, { useState, useEffect, useRef } from "react";
import "./DatePicker.css";

const DateScrollSelector = ({
  onDateChange,
  centerDate,
  selectedDateFromParent,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);
  const scrollContainerRef = useRef(null);

  // dates generate dependent on centerDate
  useEffect(() => {
    const generateDates = (baseDateInput) => {
      const baseDate = baseDateInput ? new Date(baseDateInput) : new Date();
      const dateArray = [];

      for (let i = -30; i <= 30; i++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + i);
        dateArray.push(date);
      }

      setDates(dateArray);
    };

    generateDates(centerDate);
  }, [centerDate]);

  // Initial load selected date set
  useEffect(() => {
    if (!selectedDate && dates.length > 0 && !selectedDateFromParent) {
      const today = new Date();
      setSelectedDate(today.toDateString());
    }
  }, [dates]);

  useEffect(() => {
    if (selectedDateFromParent) {
      setSelectedDate(
        typeof selectedDateFromParent === "string"
          ? selectedDateFromParent
          : new Date(selectedDateFromParent).toDateString()
      );
    }
  }, [selectedDateFromParent]);

  // Selected date scroll into view
  useEffect(() => {
    if (scrollContainerRef.current && selectedDate) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
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
      }, 100);
    }
  }, [selectedDate, dates]);

  const handleDateSelect = (date) => {
    const dateString = date.toDateString();
    setSelectedDate(dateString);

    if (onDateChange) {
      onDateChange(dateString);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const weekday = date.toLocaleString("en-US", { weekday: "short" });

    return { day, month, weekday };
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="">
      <div className="scroll-container" ref={scrollContainerRef}>
        {dates.map((date, index) => {
          const { day, month, weekday } = formatDate(date);
          const todayCheck = isToday(date);
          const isSelected = date.toDateString() === selectedDate;

          return (
            <div
              key={index}
              className={`date-item ${isSelected ? "selected" : ""} ${
                todayCheck ? "today" : ""
              }`}
              onClick={() => handleDateSelect(date)}
            >
              <div className="date-number">{day}</div>
              <div className="date-month">{month}</div>
              <div className="date-weekday">
                {todayCheck ? "Today" : weekday}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DateScrollSelector;
