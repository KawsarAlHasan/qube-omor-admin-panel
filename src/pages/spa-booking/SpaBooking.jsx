import { useEffect, useState } from "react";
import DateScrollSelector from "./DateScrollSelector";
import BookingList from "./BookingList";
import { useAllSpas } from "../../api/spaApi";
import { useLocation } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";

function SpaBooking() {
  const toDate = new Date();
  const dateStr = toDate.toDateString();

  const [pickedDate, setPickedDate] = useState(dateStr);
  const [centerDate, setCenterDate] = useState(null);
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);
  const beforeHyphen = pathnames[0]?.split("-")[0];
  const capitalized = beforeHyphen
    ? beforeHyphen.charAt(0).toUpperCase() + beforeHyphen.slice(1)
    : "";

  const [filter, setFilter] = useState({
    type: capitalized,
    date: null,
  });

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      type: capitalized,
      date: pickedDate ? formatDateForAPI(pickedDate) : null,
    }));
  }, [capitalized, pickedDate]);

  const formatDateForAPI = (date) => {
    if (!date) return null;
    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    }
    return date;
  };

  const handleDateGet = (date) => {
    setPickedDate(date);
  };

  const onChange = (date, dateString) => {
    if (dateString) {
      const selectedDate = new Date(dateString);
      const dateStr = selectedDate.toDateString();
      setPickedDate(dateStr);
      setCenterDate(selectedDate);
    }
  };

  const { spaData, isLoading, isError, error, refetch } = useAllSpas({
    type: filter.type,
    date: filter.date,
  });

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
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">
          {capitalized} Booking on {formatDate(new Date(pickedDate)) || "N/A"}
        </h1>
        <DatePicker
          size="large"
          onChange={onChange}
          value={pickedDate ? dayjs(pickedDate) : null}
        />
      </div>

      <DateScrollSelector
        onDateChange={handleDateGet}
        centerDate={centerDate}
        selectedDateFromParent={pickedDate}
      />

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
