import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// spa booking data
export const useMockSpaBooking = () => {
  const getData = async () => {
    const response = await axios.get("/spaBooking.json");
    return response.data;
  };

  const {
    data: mockSpaBooking = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["mockSpaBooking"],
    queryFn: getData,
  });

  return { mockSpaBooking, isLoading, isError, error, refetch };
};
